// api/health.js
// GET /api/health  — returns 200 with status info; useful for uptime monitors
const { applyCors } = require("./lib/cors");

module.exports = async (req, res) => {
  if (applyCors(req, res)) return;
  return res.status(200).json({
    status: "ok",
    ts: new Date().toISOString(),
    env: {
      razorpay: !!process.env.RAZORPAY_KEY_ID,
      mongodb: !!process.env.MONGODB_URI,
      resend: !!process.env.RESEND_API_KEY,
      monthlyFile: !!process.env.MONTHLY_FILE_URL,
      yearlyFile: !!process.env.YEARLY_FILE_URL,
    },
  });
};
