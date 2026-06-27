// api/lib/cors.js
//
// Applies permissive CORS for same-origin Vercel deployment (frontend and
// /api live on the same domain, so this is mostly a safety net) and
// handles preflight OPTIONS requests.

function applyCors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true; // signal: caller should return early
  }
  return false;
}

module.exports = { applyCors };
