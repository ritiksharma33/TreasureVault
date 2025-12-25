
# 🎓 Treasure Vault

Treasure Vault is a powerful knowledge management system designed to capture, organize, and store high-value insights from YouTube videos and manual entries. It helps you turn passive watching into an active library of ideas and actions.

## 🚀 Core Features

* **YouTube Intelligence:** Generate vaults automatically by pasting a YouTube URL. The system fetches the transcript for you to review and save.
* **One-Click Clipping:** Use the integrated **Chrome Extension** to capture videos directly while browsing YouTube.
* **Manual Entries:** Create "Manual Vaults" for your own thoughts, book notes, or meeting insights.
* **Full CRUD Support:**
* **Create:** Multiple ways to add content (URL, Extension, Manual).
* **Read:** Clean grid view to browse your library and a detailed view for deep reading.
* **Update:** Edit your ideas, titles, or tags at any time.
* **Delete:** Remove vaults you no longer need with a single click.


* **Organized Tags:** Categorize your knowledge using custom tags for easy filtering.

---

## 🛠️ Project Structure

* **/backend**: FastAPI (Python) server handling database logic and transcript scraping.
* **/Frontend**: Vanilla JavaScript dashboard for managing your vaults.
* **/browser-extension**: Chrome-compatible extension for instant video clipping.

---

## 💻 Installation & Setup

### 1. Backend Setup

1. Navigate to the backend folder: `cd backend`
2. Install dependencies: `pip install -r requirements.txt` (or install `fastapi`, `uvicorn`, `sqlalchemy`, `youtube-transcript-api` manually).
3. Start the server:
```bash
python3 -m uvicorn main:app --reload

```


*The API will run at `http://127.0.0.1:8000*`

### 2. Frontend Setup

1. Open the `Frontend` folder in VS Code.
2. Launch `index.html` using **Live Server** (Port 5500).
*The dashboard will run at `http://127.0.0.1:5500*`

### 3. Extension Installation

1. Open Google Chrome and go to `chrome://extensions/`.
2. Enable **Developer Mode** (top right toggle).
3. Click **Load Unpacked**.
4. Select the `browser-extension` folder from this project.
5. The Treasure Vault icon will now appear in your browser bar!

---

## 📖 How to Use

### Creating a Vault via YouTube Link

1. Copy a YouTube video URL.
2. Paste it into the input bar at the top of the Dashboard.
3. Click **Create Vault from URL**. The transcript will be fetched and saved to your grid.

### Creating a Vault via Chrome Extension

1. While watching any YouTube video, click the **Treasure Vault extension icon**.
2. Click **Save to Vault**.
3. The video transcript will be sent directly to your backend and appear in your dashboard.

### Managing your Vaults

* **View:** Click on any card in the grid to see the full transcript and ideas.
* **Edit:** Click the **Edit** button inside the detail view to update the content.
* **Delete:** Click the **Delete** button to permanently remove a vault.

---

## 📝 Technologies Used

* **Backend:** Python, FastAPI, SQLAlchemy (SQLite)
* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **Scraping:** YouTube Transcript API

---

### 💡 Pro Tip

Make sure your **Backend** is running before using the extension or the dashboard, as they both rely on the API to save and load data.

