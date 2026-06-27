// api/download/[token].js
//
// GET /api/download/:token

const fs = require("fs");
const path = require("path");
const { getDb } = require("../lib/db");
const { applyCors } = require("../lib/cors");

const FILE_CONFIG = {
  monthly: {
    envUrl: process.env.MONTHLY_FILE_URL,
    localFile: "Monthly_Budget_Template_.xlsx",
    downloadName: "BudgetPro-Monthly-Template.xlsx",
  },
  yearly: {
    envUrl: process.env.YEARLY_FILE_URL,
    localFile: "Yearly_Budget_Template.xlsx",
    downloadName: "BudgetPro-Yearly-Template.xlsx",
  },
};

module.exports = async (req, res) => {
  if (applyCors(req, res)) return;

  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Missing download token.");
  }

  try {
    const db = await getDb();

    const order = await db.collection("orders").findOne({
      downloadToken: token,
    });

    if (!order) {
      return res.status(404).send("Invalid or expired download link.");
    }

    if (order.status !== "completed") {
      return res.status(403).send("Payment not completed for this order.");
    }

    const config = FILE_CONFIG[order.plan];

    if (!config) {
      return res.status(500).send("Invalid product plan.");
    }

    await db.collection("orders").updateOne(
      { _id: order._id },
      {
        $inc: { downloadCount: 1 },
        $set: { lastDownloadAt: new Date() },
      }
    );

    // Option 1: If file URL is configured in Vercel env, redirect to it
    if (config.envUrl) {
      res.writeHead(302, { Location: config.envUrl });
      return res.end();
    }

    // Option 2: Download from local product-files folder
    const filePath = path.join(process.cwd(), "product-files", config.localFile);

    if (!fs.existsSync(filePath)) {
      console.error("File not found:", filePath);

      return res.status(500).send(
        `Product file not found. Please check product-files folder and filename: ${config.localFile}`
      );
    }

    const stat = fs.statSync(filePath);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${config.downloadName}"`
    );
    res.setHeader("Content-Length", stat.size);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (err) {
    console.error("download error:", err);
    return res.status(500).send("Something went wrong. Please contact support.");
  }
};