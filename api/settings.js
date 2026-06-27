// api/settings.js
//
// GET /api/settings              — public, returns current prices
// PATCH /api/settings            — admin only, body: { plan, price }

const { getDb } = require("./lib/db");
const { requireAdmin } = require("./lib/auth");
const { applyCors } = require("./lib/cors");

const DEFAULTS = {
  monthly: { price: 19, label: "Monthly Budget Template" },
  yearly: { price: 49, label: "Yearly Budget Template" },
};

module.exports = async (req, res) => {
  if (applyCors(req, res)) return;

  const db = await getDb();

  if (req.method === "GET") {
    const rows = await db.collection("settings").find({}).toArray();
    const merged = { ...DEFAULTS };
    rows.forEach((r) => {
      if (merged[r._id]) merged[r._id] = { ...merged[r._id], price: r.price };
    });
    return res.status(200).json(merged);
  }

  if (req.method === "PATCH") {
    if (!requireAdmin(req)) return res.status(401).json({ error: "Unauthorized" });

    const { plan, price } = req.body || {};
    if (!DEFAULTS[plan] || typeof price !== "number" || price <= 0) {
      return res.status(400).json({ error: "Invalid plan or price" });
    }

    await db.collection("settings").updateOne(
      { _id: plan },
      { $set: { price, updatedAt: new Date() } },
      { upsert: true }
    );

    return res.status(200).json({ success: true, plan, price });
  }

  return res.status(405).json({ error: "Method not allowed" });
};
