

# 🏴‍☠️ Treasure Vault: YouTube Intelligence System

"Stop watching, start capturing. Turn passive scrolling into an actionable library of wisdom."


https://github.com/user-attachments/assets/9146822a-ecd5-4c86-b5b5-c32331383a35



**Treasure Vault** is a full-stack knowledge management engine. It uses a custom **Chrome Extension** and a **FastAPI backend** to strip the noise from YouTube videos, extracting transcripts and turning them into "Knowledge Vaults" instantly.

-----
## 📺 The Workflow

1.  **Discover:** Find a high-value video on YouTube.
2.  **Extract:** Click the **Treasure Vault Extension** or paste the URL.
3.  **Refine:** Review the auto-fetched transcript in your clean dashboard.
4.  **Action:** Turn notes into a "Manual Vault" for long-term storage.

-----

## 🌟 Key Features

  * **⚡ One-Click Clipping:** A dedicated **Chrome Extension** to capture insights without leaving YouTube.
  * **🤖 Transcript Intelligence:** Automatically fetches full transcripts via the YouTube API.
  * **🗃️ Hybrid Storage:** Support for both automated YouTube extraction and manual "Brain Dumps."
  * **🏷️ Tagging System:** Categorize your knowledge (e.g., \#Coding, \#Finance, \#Productivity) for instant retrieval.

-----

## 🛠️ The Tech Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Backend** | **Python / FastAPI** | High-performance API handling & Scraping. |
| **Frontend** | **Vanilla JS / CSS3** | Clean, dependency-free dashboard UI. |
| **Extension** | **Chrome API** | Background script for seamless browser integration. |
| **Database** | **SQLAlchemy (SQLite)** | Lightweight, reliable relational storage. |

-----

## 🛡️ Security & Integrity (Roadmap v2.0)

We are currently moving towards an enterprise-grade security model:

1.  **Google OAuth:** Seamless, secure login for private vaults.
2.  **Encrypted Storage:** Ensuring your private notes stay private.
3.  **JWT Validation:** Securing the bridge between the Extension and the Backend.

-----

## 🤖 AI Insights (Coming Soon)

We are integrating **LLMs** to move beyond simple transcripts:

  * **Summarization:** Turn 20-minute videos into 5 bullet points.
  * **Action Extraction:** AI identifies "To-Do" items mentioned in the video.
  * **Auto-Tagging:** Intelligent categorization based on video context.

-----

## 💻 Local Setup

### 1\. The Engine (Backend)

```bash
cd backend
pip install -r requirements.txt
python3 -m uvicorn main:app --reload
```

### 2\. The Dashboard (Frontend)

Simply open `index.html` using **Live Server** on Port 5500.

### 3\. The Tool (Extension)

1.  Go to `chrome://extensions/`
2.  Enable **Developer Mode**.
3.  Click **Load Unpacked** and select the `/browser-extension` folder.
4.  <img width="1440" height="811" alt="Screenshot 2026-03-19 at 3 47 31 PM" src="https://github.com/user-attachments/assets/d9636548-c3b7-42d5-8117-478dcbb1026b" />
<img width="1440" height="822" alt="Screenshot 2026-03-19 at 3 47 14 PM" src="https://github.com/user-attachments/assets/5865aece-967d-48f5-9a92-4e7e0544ab2f" />
<img width="1440" height="821" alt="Screenshot 2026-03-19 at 3 47 00 PM" src="https://github.com/user-attachments/assets/f2ba0300-2d85-4d2b-a4d4-da7fe27cae00" />

-----

Built with ❤️ for learners and builders. Check out my other projects on [GitHub](https://github.com/ritiksharma33).

-----
