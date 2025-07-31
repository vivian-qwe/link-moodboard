const express = require("express");
const router = express.Router();
const { getLinkPreview } = require("link-preview-js");

router.get("/", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL parameter is required" });
  }

  try {
    const data = await getLinkPreview(url);
    res.json({
      title: data.title || "No title available",
      description: data.description || "No description available",
      image_url:
        data.mediaType === "image"
          ? data.url
          : Array.isArray(data.images) && data.images.length > 0
          ? data.images[0]
          : "No image available",
      url, // original full URL
      source_url: new URL(url).hostname,
    });
  } catch (error) {
    console.error("Error fetching link preview:", error);
    res.status(500).json({ error: "Failed to fetch link preview" });
  }
});

module.exports = router;
