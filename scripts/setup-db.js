// scripts/setup-db.js
// Run ONCE after first deploy:  node scripts/setup-db.js
// Creates indexes and seeds default settings row.

require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "budgetpro");

  // ── orders collection ──────────────────────────────────────────
  await db.collection("orders").createIndex({ razorpayOrderId: 1 }, { unique: true, sparse: true });
  await db.collection("orders").createIndex({ downloadToken: 1 }, { unique: true });
  await db.collection("orders").createIndex({ customerEmail: 1 });
  await db.collection("orders").createIndex({ status: 1 });
  await db.collection("orders").createIndex({ createdAt: -1 });
  console.log("✅  orders indexes created");

  // ── settings collection ────────────────────────────────────────
  for (const [id, price] of [["monthly", 19], ["yearly", 49]]) {
    await db.collection("settings").updateOne(
      { _id: id },
      { $setOnInsert: { _id: id, price, updatedAt: new Date() } },
      { upsert: true }
    );
  }
  console.log("✅  settings seeded (monthly=₹19, yearly=₹49)");

  await client.close();
  console.log("🎉  Database setup complete.");
})().catch((e) => { console.error(e); process.exit(1); });
