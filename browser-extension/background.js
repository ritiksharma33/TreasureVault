// File: background.js

// Listen for the 'capture_vault' command defined in manifest.json
chrome.commands.onCommand.addListener((command) => {
  if (command === "capture_vault") {
    // 1. Get the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      
      // 2. Only run if we are on a YouTube page
      if (activeTab.url && activeTab.url.includes("youtube.com")) {
        
        // 3. Execute the function that sends the URL to the API
        sendUrlToApi(activeTab.url);
        
      } else {
        // Optionally notify the user
        console.log("Not on a YouTube page. Capture ignored.");
      }
    });
  }
});


// Function to send the URL to your FastAPI backend
async function sendUrlToApi(url) {
    const API_BASE_URL = 'http://127.0.0.1:8000'; // Make sure this is correct!

    try {
        const response = await fetch(`${API_BASE_URL}/api/transcript`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url }),
        });

        if (response.ok) {
            // Optional: Show a quick notification that the vault was created
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'vault-icon.png', // You'd need to add this image
                title: 'Treasure Vault',
                message: 'Vault creation started! Check your dashboard.',
                priority: 2
            });
        } else {
            // Handle API errors
            const errorData = await response.json();
            console.error('API Error:', errorData.detail);
        }

    } catch (error) {
        console.error('Network or Fetch Error:', error);
    }
}