import {
  ResolversEnhanceMap,
  HabitCrudResolver,
  HabitItemCrudResolver,
} from '@generated/type-graphql';
import { Config } from 'apollo-server-express';
import { Authorized, BuildSchemaOptions } from 'type-graphql';
import Container, { Service } from 'typedi';

import { customAuthChecker } from 'auth/auth.guard';
import { AuthResolver } from 'auth/auth.resolver';
import { GraphQLLocalStrategyWrapper } from 'auth/passport/graphql.strategy';
import { PrismaService } from 'prisma/prisma.service';
import { Context } from 'types/context';
import { UsersResolver } from 'users/users.resolver';

@Service()
export class ApolloServerConfig {
  public apolloServerConfig: Config;

  constructor(
    private prismaService: PrismaService,
    private graphqlLocalStrategy: GraphQLLocalStrategyWrapper,
  ) {
    this.apolloServerConfig = {
      context: this.buildContext(),
      debug: true,
      introspection: true,
    };
  }

  public autoGeneratedSchemaOptions: ResolversEnhanceMap = {
    Habit: {
      _all: [Authorized()],
    },
    HabitItem: {
      _all: [Authorized()],
    },
  };

  public schemaOptions: BuildSchemaOptions = {
    resolvers: [
      HabitCrudResolver,
      HabitItemCrudResolver,
      AuthResolver,
      UsersResolver,
    ],
    container: Container,
    authChecker: customAuthChecker,
  };

  buildContext() {
    return ({ req, res }: Context) => ({
      ...this.graphqlLocalStrategy.getContext({ req, res }),
      prisma: this.prismaService,
    });
  }
}
