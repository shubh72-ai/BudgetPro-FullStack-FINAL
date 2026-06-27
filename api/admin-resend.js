// api/admin-resend.js
// POST /api/admin-resend
// Header: Authorization: Bearer <admin_jwt>
// Body: { orderId }
// Resends the purchase confirmation + download link to the customer.

const { requireAdmin } = require("./lib/auth");
const { applyCors } = require("./lib/cors");

module.exports = async (req, res) => {
  if (applyCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!requireAdmin(req)) return res.status(401).json({ error: "Unauthorized" });

  const { orderId } = req.body || {};
  if (!orderId) return res.status(400).json({ error: "orderId required" });

  try {
    const response = await fetch(`${process.env.SITE_URL}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    const result = await response.json();
    if (result.error) return res.status(500).json(result);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("admin-resend error:", err);
    return res.status(500).json({ error: "Failed to resend email" });
  }
};
