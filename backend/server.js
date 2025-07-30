const express = require("express");
const cors = require("cors");
const { getLinkPreview } = require("link-preview-js");

const app = express();
app.use(cors());

// app.get("/preview", async (req, res) => {
//   const { url } = req.query;
//   if (!url) {
//     return res.status(400).json({ error: "URL parameter is required" });
//   }

//   try {
//     const data = await getLinkPreview(url);
//     res.json({
//       title: data.title || "No title found",
//       description: data.description || "No description found",
//       image:
//         data.mediaType === "image"
//           ? data.url
//           : Array.isArray(data.images) && data.images.length > 0
//           ? data.images[0]
//           : null,
//       source: new URL(url).hostname,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to fetch link preview" });
//   }
// });


const PORT = 3001;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🔌 server running at http://localhost:${PORT}`)
);
