import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV;

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Use a global variable to persist the MongoClient promise in development
if (NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }

  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production, avoid global state
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db("portfolio"); // Make sure this matches your actual DB name
}

export default clientPromise;
