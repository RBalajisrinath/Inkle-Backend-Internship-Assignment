import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: (process.env.JWT_SECRET || 'your-secret-key') as string,
  jwtExpire: (process.env.JWT_EXPIRE || '7d') as string,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  databaseUrl: process.env.DATABASE_URL
};
