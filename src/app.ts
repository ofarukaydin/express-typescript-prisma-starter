import 'reflect-metadata';

import Container from 'typedi';

import config from 'config';
import { initApollo } from 'config/apollo';
import { corsOptions } from 'config/cors';
import { ExpressWrapper } from 'config/passport';

const startServer = async () => {
  const apolloServer = await initApollo();
  const { app } = Container.get(ExpressWrapper);

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
