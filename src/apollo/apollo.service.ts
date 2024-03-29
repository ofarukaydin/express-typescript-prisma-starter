import {
  applyResolversEnhanceMap,
  ResolversEnhanceMap,
} from '@generated/type-graphql';
import { ApolloServer, ExpressContext, Config } from 'apollo-server-express';
import { buildSchema, BuildSchemaOptions } from 'type-graphql';
import { Service } from 'typedi';

import { ApolloServerConfig } from 'apollo/apollo-config';
import { ConfigService } from 'config';
import { ExpressService } from 'express-app';
import { AppError } from 'utils/error';

type InitializeOptions = {
  schemaOptions: BuildSchemaOptions;
  autoGeneratedSchemaOptions: ResolversEnhanceMap;
  apolloServerConfig: Omit<Config, 'schema'>;
};

@Service()
export class ApolloService {
  private _apolloServer?: ApolloServer<ExpressContext>;

  constructor(
    private expressService: ExpressService,
    private configService: ConfigService,
    private apolloServerConfig: ApolloServerConfig,
  ) {}

  async initializeApolloServerInstance({
    autoGeneratedSchemaOptions,
    apolloServerConfig,
    schemaOptions,
  }: InitializeOptions) {
    applyResolversEnhanceMap(autoGeneratedSchemaOptions);
    const schema = await buildSchema(schemaOptions);

    this._apolloServer = new ApolloServer({
      schema,
      ...apolloServerConfig,
    });
  }

  async initialize() {
    await this.initializeApolloServerInstance(this.apolloServerConfig);
    await this.apolloServer.start();

    this.apolloServer.applyMiddleware({
      app: this.expressService.app,
      cors: this.configService.corsOptions,
    });

    this.expressService.app.listen(this.configService.port, () => {
      console.log(
        `Server started on port ${this.configService.port} (${this.configService.env})`,
      );
    });
  }

  get apolloServer() {
    if (!this._apolloServer) {
      throw new AppError({ message: 'No apollo server instance created' });
    }
    return this._apolloServer;
  }
}
