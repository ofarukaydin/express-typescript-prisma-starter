import { config } from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = config();

if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

const apolloStudioUrl = process.env.APOLLO_STUDIO_URL || '';

class Config {
  public env: string = process.env.NODE_ENV || 'development';
  public port: number = process.env.PORT
    ? parseInt(process.env.PORT + '', 10)
    : 3000;

  public sessionSecret = process.env.SESSION_SECRET || '';
  public apolloStudioUrl = apolloStudioUrl || '';
  public sqlitePath = process.env.SESSION_DB_PATH || '';

  public corsOptions = {
    origin: [apolloStudioUrl],
    credentials: true,
  };
}

export default new Config();
