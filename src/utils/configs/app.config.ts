import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });
// Only pass secrets here
export const APP_CONFIG = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL,

  HTTP_TIMEOUT: process.env.HTTP_TIMEOUT,
  HTTP_MAX_REDIRECTS: process.env.HTTP_MAX_REDIRECTS,

  MYSQL_HOST: process.env.MYSQL_HOST,
  MYSQL_PORT: process.env.MYSQL_PORT,
  MYSQL_USER: process.env.MYSQL_USER,
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
  MYSQL_DATABASE: process.env.MYSQL_DATABASE,

  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_ENABLE: process.env.REDIS_ENABLE,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD
} as const;
