async function globalTeardown() {
  await global.__SERVER__.close();
  await global.__MONGOD__.stop();
}

export default globalTeardown;
