import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../../app";

let mongod;
let server;

export async function setup() {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  server = app.listen(3001); // Or a different port
}

export async function teardown() {
  await mongoose.disconnect();
  await mongod.stop();
  server.close();
}
