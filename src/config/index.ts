import { config } from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = config();

if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

const apolloStudioUrl = 'https://studio.apollographql.com';

export default {
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT + '', 10),
  sessionSecret: 'asd124lijas!@3123',
  apolloStudioUrl,
  sqlitePath: '/tmp/sqlite.db',
  corsOptions: {
    origin: [apolloStudioUrl],
    credentials: true,
  },
};
