// api/admin-login.js
//
// POST /api/admin-login
// Body: { username, password }

const { signAdminToken } = require("./lib/auth");
const { applyCors } = require("./lib/cors");

module.exports = async (req, res) => {
  if (applyCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { username, password } = req.body || {};

  const validUser = username === process.env.ADMIN_USERNAME;
  const validPass = password === process.env.ADMIN_PASSWORD;

  if (!validUser || !validPass) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  return res.status(200).json({ token: signAdminToken() });
};
