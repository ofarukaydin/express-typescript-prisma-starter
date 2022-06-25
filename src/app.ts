import 'reflect-metadata';

import Container, { Service } from 'typedi';

import { ApolloService } from 'apollo/apollo.service';

@Service()
class ServerInitializer {
  constructor(private apolloService: ApolloService) {}

  async initialize() {
    await this.apolloService.initialize();
  }
}

const server = Container.get(ServerInitializer);
server.initialize();
