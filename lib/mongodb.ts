import mongoose from "mongoose";

// Define the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Validate that the MongoDB URI is defined

// Define TypeScript interface for the cached connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global object to include mongoose cache
declare global {
  var mongoose: MongooseCache | undefined;
}

// Initialize the cache object
// In development, use a global variable to preserve the connection across hot reloads
// In production, the cache is scoped to the module
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Establishes a connection to MongoDB using Mongoose
 * Caches the connection to prevent multiple connections during hot reloads in development
 * @returns Promise that resolves to the Mongoose instance
 */
async function connectDB(): Promise<typeof mongoose> {
  // If a connection already exists, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise exists, create a new connection
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable Mongoose buffering
    };
    if (!MONGODB_URI) {
      throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local"
      );
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    // Wait for the connection promise to resolve and cache the connection
    cached.conn = await cached.promise;
  } catch (e) {
    // If connection fails, reset the promise so it can be retried
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
