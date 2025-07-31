const express = require("express");
const cors = require("cors");
const itemRoutes = require("./routes/items");
const previewRoutes = require("./routes/preview");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/items", itemRoutes);
app.use("/api/preview", previewRoutes);

const PORT = 3001;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🔌 server running at http://localhost:${PORT}`)
);
