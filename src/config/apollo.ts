import { resolvers, applyResolversEnhanceMap } from '@generated/type-graphql';
import { ApolloServer } from 'apollo-server-express';
import { Authorized, buildSchema } from 'type-graphql';
import Container from 'typedi';

import { customAuthChecker } from 'auth/auth.guard';
import AuthResolver from 'auth/auth.resolver';
import { GraphQLLocalStrategyWrapper } from 'auth/passport-graphql.strategy';
import { PrismaService } from 'prisma/prisma.service';
import UsersResolver from 'users/users.resolver';

export async function initApollo() {
  // Require authentication for auto generated resolvers
  applyResolversEnhanceMap({
    Habit: {
      _all: [Authorized()],
    },
    HabitItem: {
      _all: [Authorized()],
    },
    User: {
      _all: [Authorized()],
    },
  });

  const schema = await buildSchema({
    resolvers: [...resolvers, AuthResolver, UsersResolver],
    // container: Container,
    authChecker: customAuthChecker,
  });

  const graphQLStrategy = Container.get(GraphQLLocalStrategyWrapper);

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({
      ...graphQLStrategy.getContext({ req, res }),
      prisma: Container.get(PrismaService),
    }),
  });

  Container.set(ApolloServer, apolloServer);

  return apolloServer;
}
