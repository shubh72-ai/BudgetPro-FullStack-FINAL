// api/admin-stats.js
//
// GET /api/admin-stats
// Header: Authorization: Bearer <admin_jwt>

const { getDb } = require("./lib/db");
const { requireAdmin } = require("./lib/auth");
const { applyCors } = require("./lib/cors");

module.exports = async (req, res) => {
  if (applyCors(req, res)) return;
  if (!requireAdmin(req)) return res.status(401).json({ error: "Unauthorized" });

  try {
    const db = await getDb();
    const orders = await db
      .collection("orders")
      .find({ status: "completed" })
      .sort({ createdAt: -1 })
      .toArray();

    const totalSales = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0) / 100;
    const totalDownloads = orders.reduce((sum, o) => sum + (o.downloadCount || 0), 0);
    const monthlySales = orders.filter((o) => o.plan === "monthly").length;
    const yearlySales = orders.filter((o) => o.plan === "yearly").length;

    const customers = orders.map((o) => ({
      id: o._id.toString(),
      name: o.customerName,
      email: o.customerEmail,
      plan: o.planLabel,
      date: o.createdAt,
      amount: o.amount / 100,
      status: o.status,
      downloads: o.downloadCount || 0,
    }));

    return res.status(200).json({
      totalSales,
      totalRevenue,
      totalDownloads,
      monthlySales,
      yearlySales,
      customers,
    });
  } catch (err) {
    console.error("admin-stats error:", err);
    return res.status(500).json({ error: "Could not load stats" });
  }
};
