/* ******************************************
 * src/db/connection.ts
 * *************************************** */
import { MongoClient, type Db } from 'mongodb';

// Cached MongoClient & database instance to the connected MongoDB database
let client: MongoClient | undefined;
let db: Db | undefined;

// Connect to MongoDB
export async function connectToDatabase(): Promise<Db> {
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

  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log('[db/connection] MongoClient connected');
  }

  db = client.db(dbName);
  console.log(`[db/connection] Connected to MongoDB database: ${dbName}`);

  return db;
}
