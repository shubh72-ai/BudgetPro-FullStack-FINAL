// api/send-email.js
//
// POST /api/send-email
// Body: { orderId }
//
// Sends the post-purchase confirmation email containing the secure,
// token-based download link. Called automatically by verify-payment,
// but can also be called manually (e.g. an admin "Resend" button).

const { Resend } = require("resend");
const { ObjectId } = require("mongodb");
const { getDb } = require("./lib/db");
const { applyCors } = require("./lib/cors");

module.exports = async (req, res) => {
  if (applyCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { orderId } = req.body || {};
    if (!orderId) return res.status(400).json({ error: "orderId is required" });

    const db = await getDb();
    const order = await db.collection("orders").findOne({ _id: new ObjectId(orderId) });

    if (!order) return res.status(404).json({ error: "Order not found" });

    const downloadUrl = `${process.env.SITE_URL}/api/download/${order.downloadToken}`;
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: order.customerEmail,
      subject: "Your Budget Template is ready to download 🎉",
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 20px;">
          <h2 style="color: #0F1E3C;">Thank you, ${order.customerName}!</h2>
          <p style="color: #4A5568; line-height: 1.6;">
            Your payment of ₹${order.amount / 100} for the <strong>${order.planLabel}</strong>
            was successful. Your template is ready to download.
          </p>
          <a href="${downloadUrl}"
             style="display: inline-block; background: #00C896; color: #fff; padding: 14px 28px;
                    border-radius: 10px; text-decoration: none; font-weight: 600; margin: 16px 0;">
            Download Your Template
          </a>
          <p style="color: #718096; font-size: 13px;">
            This link is unique to your purchase and works at any time. If you run into any
            issues, just reply to this email and we'll help you out.
          </p>
        </div>
      `,
    });

    await db.collection("orders").updateOne(
      { _id: order._id },
      { $set: { emailSent: true, emailSentAt: new Date() } }
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("send-email error:", err);
    return res.status(500).json({ error: "Could not send email" });
  }
};
