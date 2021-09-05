import * as IORedis from 'ioredis';
import * as connectRedis from 'connect-redis';
import * as session from 'express-session';

export const session_secret = 'my-secret';
export const redisClient = new IORedis();
export const SessionRedisStore = connectRedis(session);
export const store = new SessionRedisStore({ client: redisClient });
