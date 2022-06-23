import { Express } from 'express';

import config from 'config';

export function setHeadersForApolloStudio(app: Express) {
  app.set('trust proxy', process.env.NODE_ENV !== 'production');
  app.set('Access-Control-Allow-Origin', config.apolloStudioUrl);
  app.set('Access-Control-Allow-Credentials', true);
}
