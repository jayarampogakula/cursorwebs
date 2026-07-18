import { Queue } from "bullmq";
import IORedis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redisConnection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
});

// Initialize the BullMQ Website Generation Queue
export const websiteGenerationQueue = new Queue("website-generation", {
  connection: redisConnection as any,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: "exponential",
      delay: 10000,
    },
    removeOnComplete: 100,
    removeOnFail: 200,
  },
});
