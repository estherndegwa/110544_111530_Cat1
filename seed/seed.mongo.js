// Seed script to initialize 'shop' database with products, categories, and reviews.

const dbName = "shop";
const db = db.getSiblingDB(dbName);

// Drop for clean slate when re-seeding (optional)
db.products.drop();
db.categories.drop();
db.reviews.drop();

db.products.insertMany([
  {
    _id: "SKU-1001",
    name: "Noise-Cancelling Headphones",
    brand: "AcoustiX",
    price: 149.99,
    in_stock: true,
    categories: ["audio", "accessories"],
    specs: { color: "black", weight_grams: 250, battery_hours: 30 },
    tags: ["wireless", "bluetooth", "ANC"],
    ratings: { average: 4.5, count: 124 }
  },
  {
    _id: "SKU-1002",
    name: "Portable Bluetooth Speaker",
    brand: "SoundBay",
    price: 89.99,
    in_stock: true,
    categories: ["audio"],
    specs: { waterproof: "IPX7", battery_hours: 12, color: "blue" },
    tags: ["portable", "bass"],
    ratings: { average: 4.1, count: 80 }
  },
  {
    _id: "SKU-2001",
    name: "USB-C Charger 65W",
    brand: "ChargePro",
    price: 39.99,
    in_stock: true,
    categories: ["power", "accessories"],
    specs: { color: "white", wattage: 65, ports: ["USB-C"] },
    tags: ["fast-charge", "compact"],
    ratings: { average: 4.3, count: 56 }
  }
]);

db.categories.insertMany([
  { slug: "audio", display_name: "Audio", description: "Headphones, speakers, audio gear" },
  { slug: "accessories", display_name: "Accessories", description: "Cables, chargers, cases" },
  { slug: "power", display_name: "Power", description: "Charging devices and power banks" }
]);

db.reviews.insertMany([
  {
    product_id: "SKU-1001",
    user: { id: "U-001", name: "Alice" },
    rating: 5,
    comment: "Excellent noise cancellation!",
    created_at: new Date()
  },
  {
    product_id: "SKU-1001",
    user: { id: "U-002", name: "Bob" },
    rating: 4,
    comment: "Great sound, a bit tight fit.",
    created_at: new Date()
  },
  {
    product_id: "SKU-2001",
    user: { id: "U-003", name: "Charlie" },
    rating: 5,
    comment: "Charges my laptop fast.",
    created_at: new Date()
  }
]);

// Helpful indexes
db.products.createIndex({ categories: 1 });
db.products.createIndex({ price: 1, in_stock: 1 });
db.reviews.createIndex({ product_id: 1, created_at: -1 });

print("Seed completed for 'shop' database.");