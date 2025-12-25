# File: backend/app/services/transcript_service.py
import requests
import re
import json
from urllib.parse import urlparse, parse_qs
# Use the correct imports from your working code
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound

# --- Custom Error Classes (keep these the same) ---
class TranscriptError(Exception):
    pass
class VideoNotFoundError(TranscriptError):
    pass
class TranscriptUnavailableError(TranscriptError):
    pass
# -------------------------------------------------

def get_video_metadata(youtube_url: str) -> dict:
    """
    Fetches the video title and channel name using the embedded YouTube JSON data.
    This method is more reliable than simple tag scraping.
    """
    try:
        response = requests.get(youtube_url)
        response.raise_for_status()

        html = response.text

        # 1. Search for the main YouTube configuration JSON object
        json_match = re.search(r'ytInitialPlayerResponse\s*=\s*(\{.*?\})\s*;', html)

        if json_match:
            # 2. Parse the JSON
            data = json.loads(json_match.group(1))

            # 3. Extract Title and Author from the embedded data path
            title = data['videoDetails']['title'].strip()
            channel_name = data['videoDetails']['author'].strip()
            
            return {
                'title': title,
                'channel': channel_name,
                'video_id': _extract_video_id(youtube_url)
            }
        
        # --- Fallback to simple title if JSON fails ---
        title_match = re.search(r"<title>(.*?)</title>", html, re.IGNORECASE)
        title = title_match.group(1).replace(" - YouTube", "").strip() if title_match else "Untitled Video"

        return {
            'title': title,
            'channel': "Channel Not Found (Fallback)",
            'video_id': _extract_video_id(youtube_url)
        }

    except requests.exceptions.RequestException as e:
        raise VideoNotFoundError(f"Failed to access YouTube URL: {str(e)}")
    except Exception as e:
        # This catches errors if the JSON structure is unexpected
        raise VideoNotFoundError(f"Could not parse video metadata: {str(e)}")


def _extract_video_id(url: str) -> str | None:
    """
    Integrates the working Video ID extraction logic.
    """
    parsed_url = urlparse(url)

    if not parsed_url.hostname:
        return None

    if "youtu.be" in parsed_url.hostname:
        # Check for empty path if it's just 'youtu.be/'
        path_parts = parsed_url.path.split('/')
        return path_parts[1] if len(path_parts) > 1 else None

    if "youtube.com" in parsed_url.hostname:
        if parsed_url.path == '/watch':
            query_params = parse_qs(parsed_url.query)
            if 'v' in query_params:
                return query_params['v'][0]
        elif parsed_url.path.startswith('/embed/'):
            return parsed_url.path.split('/')[2]
    
    return None


def get_video_transcript(youtube_url: str) -> str:
    """
    Fetches the full transcript text from a YouTube video URL using the working logic.
    """
    video_id = _extract_video_id(youtube_url)

    if not video_id:
        raise VideoNotFoundError("Invalid YouTube URL or video ID not found.")

    try:
        # 1. Create an instance of the API client (as in your working code)
        ytt_api = YouTubeTranscriptApi()

        # 2. Call the fetch method directly on the instance
        # NOTE: We use the fetch method which returns TranscriptList objects with .text attributes
        fetched_transcript = ytt_api.fetch(video_id, languages=['en'])

        # 3. Join the text parts together using DOT notation
        full_transcript = " ".join([item.text for item in fetched_transcript])
        
        if not full_transcript.strip():
            raise TranscriptUnavailableError("Transcript was found but is empty.")
            
        return full_transcript

    except (TranscriptsDisabled, NoTranscriptFound) as e:
        # Re-raise as our custom TranscriptUnavailableError
        raise TranscriptUnavailableError(f"Transcript unavailable: {e}")
        
    except Exception as e:
        # Catch any other low-level network or API errors
        raise TranscriptError(f"An unexpected API service error occurred: {str(e)}")
