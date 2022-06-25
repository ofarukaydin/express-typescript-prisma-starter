/* eslint-disable @typescript-eslint/ban-types */
import passport, { PassportStatic } from 'passport';
import { Service } from 'typedi';

import { GraphQLLocalStrategyWrapper } from 'auth/passport/graphql.strategy';

@Service()
export class PassportService {
  private _passport: PassportStatic;
  constructor(private strategy: GraphQLLocalStrategyWrapper) {
    this._passport = passport;
    this.initSerializer();
    this.initDeserializer();
    this.initStrategy();
  }

  initSerializer() {
    this._passport.serializeUser(this.strategy.serializer);
  }

  initDeserializer() {
    this._passport.deserializeUser(this.strategy.deserializer);
  }

  initStrategy() {
    this._passport.use(this.strategy.strategy);
  }

  getExpressMiddlewares() {
    return [
      this._passport.initialize.bind(this._passport),
      this._passport.session.bind(this._passport),
    ] as const;
  }
}
