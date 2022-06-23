import { User as PrismaUser } from '@prisma/client';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { PassportSubscriptionContext, PassportContext } from 'graphql-passport';

export type UserWithoutPassword = Omit<PrismaUser, 'password'>;

export type Context = PassportContext<UserWithoutPassword, ExpressRequest> & {
  res: ExpressResponse;
};

export type ProjectSubscriptionContext = PassportSubscriptionContext<
  UserWithoutPassword,
  ExpressRequest
>;
