import { MongoClient } from "mongodb";

const uri =
  process.env.MONGODB_URI ??
  process.env.MONGO_URI ??
  "mongodb://127.0.0.1:27017";

const dbName =
  process.env.MONGODB_DB ?? process.env.DB_NAME ?? "booknook";

type MongoGlobal = typeof globalThis & {
  __bookNookMongoClient?: MongoClient;
};

const globalForMongo = globalThis as MongoGlobal;

/**
 * One client per server process. The driver connects lazily, so importing
 * this module during `next build` never opens a socket.
 */
export const mongoClient =
  globalForMongo.__bookNookMongoClient ??
  new MongoClient(uri, {
    serverSelectionTimeoutMS: 10_000,
    maxPoolSize: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForMongo.__bookNookMongoClient = mongoClient;
}

export function getDb() {
  return mongoClient.db(dbName);
}
