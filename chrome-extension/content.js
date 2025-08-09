chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrapeData") {
    const imageUrl =
      request.imageUrl ||
      document.querySelector('meta[property="og:image"]')?.content ||
      [...document.images].find((img) => img.width > 100 && img.height > 100)
        ?.src ||
      "";

    const description =
      document.querySelector('meta[property="og:description"]')?.content ||
      document.querySelector('meta[name="description"]')?.content ||
      "";

    const data = {
      title: document.title,
      url: window.location.href,
      image_url: imageUrl,
      description,
      type: "link",
      source_url: window.location.hostname,
      note: "",
    };

    chrome.runtime.sendMessage({ action: "sendDataToServer", data });
  }
});
