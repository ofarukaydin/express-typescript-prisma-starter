import config from 'config';

export const corsOptions = {
  origin: [config.apolloStudioUrl],
  credentials: true,
};
