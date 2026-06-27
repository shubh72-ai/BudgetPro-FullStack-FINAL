// api/create-order.js
//
// POST /api/create-order
// Body: { name, email, phone, plan }   plan = "monthly" | "yearly"
//
// Looks up the live price from the `settings` collection (so the admin
// panel can change prices without a redeploy), creates a Razorpay order,
// and stores a "pending" order document. The frontend then opens
// Razorpay Checkout using the returned order id.

const Razorpay = require("razorpay");
const { getDb } = require("./lib/db");
const { applyCors } = require("./lib/cors");

const PLAN_DEFAULTS = {
  monthly: { price: 19, label: "Monthly Budget Template" },
  yearly: { price: 49, label: "Yearly Budget Template" },
};

module.exports = async (req, res) => {
  if (applyCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { name, email, phone, plan } = req.body || {};

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email, and phone are required" });
    }
    if (!PLAN_DEFAULTS[plan]) {
      return res.status(400).json({ error: "Invalid plan. Must be 'monthly' or 'yearly'" });
    }

    const db = await getDb();

    // Read live price from settings, falling back to the hardcoded default
    // the very first time (before an admin has saved any settings row).
    const settings = await db.collection("settings").findOne({ _id: plan });
    const priceInRupees = settings?.price ?? PLAN_DEFAULTS[plan].price;
    const amountInPaise = priceInRupees * 100;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    const orderDoc = {
      customerName: name,
      customerEmail: email.toLowerCase().trim(),
      customerPhone: phone,
      plan,
      planLabel: PLAN_DEFAULTS[plan].label,
      amount: amountInPaise,
      currency: "INR",
      razorpayOrderId: razorpayOrder.id,
      status: "pending",
      downloadToken: require("crypto").randomBytes(24).toString("hex"),
      downloadCount: 0,
      emailSent: false,
      createdAt: new Date(),
    };

    const result = await db.collection("orders").insertOne(orderDoc);

    return res.status(200).json({
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
      internalOrderId: result.insertedId.toString(),
    });
  } catch (err) {
    console.error("create-order error:", err);
    return res.status(500).json({ error: "Could not create order" });
  }
};
