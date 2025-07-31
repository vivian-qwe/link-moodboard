require("dotenv").config();

const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

//CRUD operations

//create
router.post("/", async (req, res) => {
  const { title, description, image_url, url, type, source_url, note } =
    req.body;
  console.log("Adding item:", {
    title,
    description,
    image_url,
    url,
    type,
    source_url,
    note,
  });
  const { data, error } = await supabase
    .from("items")
    .insert([{ title, description, image_url, url, type, source_url, note }]);
  if (error) {
    console.error("Supabase insert error:", error);
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
});

//read all
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("items").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

//update
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("items")
    .update(req.body)
    .eq("id", id);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

//delete
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("items").delete().eq("id", id);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
