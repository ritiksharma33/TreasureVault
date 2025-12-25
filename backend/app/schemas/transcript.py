# File: backend/app/schemas/transcript.py

from pydantic import BaseModel, Field

# Schema for the incoming YouTube URL
class URLRequest(BaseModel):
    url: str = Field(..., description="The YouTube video URL")

# Schema for the outgoing Transcript Data
class TranscriptResponse(BaseModel):
    url: str
    transcript: str
    suggested_title: str