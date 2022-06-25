import { config } from 'dotenv';
import { Service } from 'typedi';

import { AppError } from 'utils/error';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = config();

if (envFound.error) {
  throw new AppError({ message: "Couldn't find .env file" });
}

const apolloStudioUrl = process.env.APOLLO_STUDIO_URL || '';

@Service()
export class ConfigService {
  public env = process.env.NODE_ENV || 'development';
  public port = process.env.PORT ? parseInt(process.env.PORT + '', 10) : 3000;
  public sessionSecret = process.env.SESSION_SECRET || '';
  public apolloStudioUrl = apolloStudioUrl || '';
  public sqlitePath = process.env.SESSION_DB_PATH || '';

  public corsOptions = {
    origin: [apolloStudioUrl],
    credentials: true,
  };
}

export default new ConfigService();
