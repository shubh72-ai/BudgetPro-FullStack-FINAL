// api/verify-payment.js
//
// POST /api/verify-payment
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
//
// This is the single most important security step in the whole flow.
// Razorpay's checkout widget calls our success handler client-side, but a
// malicious user could fake that call without ever actually paying. The
// only way to know a payment is real is to recompute the HMAC signature
// server-side using our secret key and compare it to what Razorpay sent.

const crypto = require("crypto");
const { getDb } = require("./lib/db");
const { applyCors } = require("./lib/cors");

module.exports = async (req, res) => {
  if (applyCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment verification fields" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    const db = await getDb();

    const updateResult = await db.collection("orders").findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        $set: {
          status: "completed",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          completedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    const order = updateResult?.value || updateResult; // driver-version-safe

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Fire the confirmation email. We don't fail the whole request if
    // email sending has a problem — the customer already paid and the
    // download link below works regardless.
    try {
      await fetch(`${process.env.SITE_URL}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order._id.toString() }),
      });
    } catch (emailErr) {
      console.error("send-email trigger failed (non-fatal):", emailErr);
    }

    return res.status(200).json({
      success: true,
      downloadToken: order.downloadToken,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      plan: order.plan,
    });
  } catch (err) {
    console.error("verify-payment error:", err);
    return res.status(500).json({ error: "Verification failed" });
  }
};
