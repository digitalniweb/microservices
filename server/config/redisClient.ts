import IoRedis from "ioredis";
import dotenv from "dotenv";

// Načtení environmentálních proměnných
dotenv.config();

const redis = new IoRedis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
});
console.log(redis);
export default redis;
