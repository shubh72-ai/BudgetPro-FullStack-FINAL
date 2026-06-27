// api/download/[token].js
//
// GET /api/download/:token
//
// Verifies the token belongs to a *completed* order before redirecting to
// the actual file. This is what stops people from downloading the product
// without paying — the token is only handed out after verify-payment
// confirms a genuine Razorpay signature.

const { getDb } = require("../lib/db");
const { applyCors } = require("../lib/cors");

const FILE_URLS = {
  // These point at the files uploaded to Vercel Blob storage / your CDN.
  // Set these two env vars after uploading Monthly_Budget_Template_.xlsx
  // and Yearly_Budget_Template.xlsx — see SETUP.md.
  monthly: process.env.MONTHLY_FILE_URL,
  yearly: process.env.YEARLY_FILE_URL,
};

module.exports = async (req, res) => {
  if (applyCors(req, res)) return;

  const { token } = req.query;
  if (!token) return res.status(400).send("Missing download token.");

  try {
    const db = await getDb();
    const order = await db.collection("orders").findOne({ downloadToken: token });

    if (!order) {
      return res.status(404).send("Invalid or expired download link.");
    }
    if (order.status !== "completed") {
      return res.status(403).send("Payment not completed for this order.");
    }

    const fileUrl = FILE_URLS[order.plan];
    if (!fileUrl) {
      return res.status(500).send("Product file not configured yet. Contact support.");
    }

    await db.collection("orders").updateOne(
      { _id: order._id },
      { $inc: { downloadCount: 1 }, $set: { lastDownloadAt: new Date() } }
    );

    res.writeHead(302, { Location: fileUrl });
    return res.end();
  } catch (err) {
    console.error("download error:", err);
    return res.status(500).send("Something went wrong. Please contact support.");
  }
};
