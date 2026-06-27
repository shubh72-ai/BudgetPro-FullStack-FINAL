// api/lib/db.js
//
// MongoDB Atlas connection helper for Vercel serverless functions.
// Reuses the connection across warm invocations to avoid exhausting
// Atlas's connection limit (each cold start would otherwise open a new one).

const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "budgetpro";

let cachedClient = null;
let cachedDb = null;

async function getDb() {
  if (cachedDb) return cachedDb;

  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it in Vercel → Settings → Environment Variables.");
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }

  cachedDb = cachedClient.db(dbName);
  return cachedDb;
}

module.exports = { getDb };
