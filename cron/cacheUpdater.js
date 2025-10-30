const cron = require("node-cron");
const client = require("../config/redis");

cron.schedule("*/30 * * * *", async () => {
  console.log("⏳ Refreshing News Cache...");
  const keys = await client.keys("news:*");

  for (let key of keys) {
    await client.del(key);
  }
});
