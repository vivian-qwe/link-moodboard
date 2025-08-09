// background.js for Chrome Extension
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveLinkMoodboard",
    title: "Save to Link Moodboard",
    contexts: ["page", "link", "selection", "image"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "saveLinkMoodboard") {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });

    chrome.tabs.sendMessage(tab.id, {
      action: "scrapeData",
      imageUrl: info.srcUrl || "",
    });
  }
});

chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.action === "sendDataToServer") {
    try {
      const res = await fetch("http://localhost:3001/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message.data),
      });
      if (res.ok) {
        // console.log("Saved to Link Moodboard!");
      } else {
        // console.error("Failed to save item.");
      }
    } catch (err) {
      // console.error("Error saving item:", err);
    }
  }
});
