const Redis = require('ioredis');
const { RateLimiterRedis } = require('rate-limiter-flexible');

const redis = new Redis();

const rateLimiterPerSecond = new RateLimiterRedis({
  storeClient: redis,
  points: 1,
  duration: 1,
  keyPrefix: 'rate_limit_second',
});

const rateLimiterPerMinute = new RateLimiterRedis({
  storeClient: redis,
  points: 20,
  duration: 60,
  keyPrefix: 'rate_limit_minute',
});

async function checkRateLimits(user_id) {
  try {
    await rateLimiterPerSecond.consume(user_id);
    await rateLimiterPerMinute.consume(user_id);
    return true;
  } catch (err) {
    if (err instanceof Error) {
      return false;
    }
    console.error(err);
    return false;
  }
}

module.exports = { checkRateLimits };
