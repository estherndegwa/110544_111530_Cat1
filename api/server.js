import express from "express";
import morgan from "morgan";
import { MongoClient } from "mongodb";

const MONGO_URL = process.env.MONGO_URL || "mongodb://root:rootpassword@mongo:27017/?authSource=admin";
const DB_NAME = process.env.DB_NAME || "shop";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

let db, products, reviews;

async function init() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  db = client.db(DB_NAME);
  products = db.collection("products");
  reviews = db.collection("reviews");
  console.log("Connected to MongoDB");
}

app.get("/health", (_, res) => res.json({ status: "ok" }));

// Create product
app.post("/products", async (req, res) => {
  try {
    const doc = req.body;
    await products.insertOne(doc);
    res.status(201).json({ ok: true, id: doc._id });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Read product
app.get("/products/:id", async (req, res) => {
  const doc = await products.findOne({ _id: req.params.id });
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json(doc);
});

// Update product (partial)
app.patch("/products/:id", async (req, res) => {
  const result = await products.updateOne({ _id: req.params.id }, { $set: req.body });
  res.json({ matched: result.matchedCount, modified: result.modifiedCount });
});

// Delete product
app.delete("/products/:id", async (req, res) => {
  const result = await products.deleteOne({ _id: req.params.id });
  res.json({ deleted: result.deletedCount });
});

// Recent reviews for product
app.get("/products/:id/reviews", async (req, res) => {
  const docs = await reviews.find({ product_id: req.params.id }).sort({ created_at: -1 }).limit(5).toArray();
  res.json(docs);
});

// Add a review
app.post("/products/:id/reviews", async (req, res) => {
  const review = {
    ...req.body,
    product_id: req.params.id,
    created_at: new Date()
  };
  await reviews.insertOne(review);
  res.status(201).json({ ok: true });
});

init().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`API listening on :${port}`));
}).catch(err => {
  console.error(err);
  process.exit(1);
});