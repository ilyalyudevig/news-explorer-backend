
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../../app";

async function globalSetup() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGODB_URI = uri;

  const server = await new Promise((resolve, reject) => {
    const s = app.listen(0, () => {
      resolve(s);
    });
    s.on("error", reject);
  });

  const { port } = server.address();
  process.env.BASE_URL = `http://localhost:${port}`;

  // Store the server instance and mongod instance for teardown
  global.__SERVER__ = server;
  global.__MONGOD__ = mongod;
}

export default globalSetup;
