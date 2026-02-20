/* ******************************************
 * src/db/connection.ts
 * *************************************** */
import { MongoClient, type Db } from 'mongodb';

// Cached database instance to the connected MongoDB database
let db: Db | undefined;

// Connect to MongoDB
export async function connectToDatabase() {
  if (db) {
    return db;
  }

  // Environment Variable
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME;

  if (!uri) {
    throw new Error('[db/connection] MONGODB_URI is not defined in .env');
  }

  if (!dbName) {
    throw new Error('[db/connection] DB_NAME is not defined in .env');
  }

  const client = new MongoClient(uri);
  await client.connect();

  db = client.db(dbName);
  console.log(`[db/connection] Connected to MongoDB database: ${dbName}`);

  return db;
}
