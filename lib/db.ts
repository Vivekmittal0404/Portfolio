import "server-only";

import mongoose from "mongoose";

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  retryAfter: number;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached = globalThis.mongooseCache ?? {
  connection: null,
  promise: null,
  retryAfter: 0,
};

globalThis.mongooseCache = cached;

export function isDatabaseConfigured() {
  return Boolean(process.env.MONGODB_URI);
}

export class DatabaseUnavailableError extends Error {
  constructor() {
    super("MongoDB is unreachable. Check the Atlas Network Access IP list.");
    this.name = "DatabaseUnavailableError";
  }
}

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (cached.connection) return cached.connection;
  if (Date.now() < cached.retryAfter) throw new DatabaseUnavailableError();

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3500,
    });
  }

  try {
    cached.connection = await cached.promise;
  } catch {
    cached.promise = null;
    cached.retryAfter = Date.now() + 15_000;
    throw new DatabaseUnavailableError();
  }

  cached.retryAfter = 0;
  return cached.connection;
}
