import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import express from 'express';

import config from 'config';
import { initApollo } from 'config/apollo';
import { setHeadersForApolloStudio } from 'config/apollo-studio';
import { corsOptions } from 'config/cors';
import { initPassport } from 'config/passport';
import { initSession } from 'config/session';

const startServer = async () => {
  const apolloServer = await initApollo();
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  setHeadersForApolloStudio(app);
  initSession(app);
  initPassport(app);

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: corsOptions,
  });

  app.listen(config.port, () => {
    console.log(`Server started on port ${config.port} (${config.env})`);
  });
};

startServer();
