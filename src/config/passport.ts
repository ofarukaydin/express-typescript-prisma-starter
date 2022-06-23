/* eslint-disable @typescript-eslint/ban-types */
import cookieParser from 'cookie-parser';
import { Express, Request } from 'express';
import express from 'express';
import session from 'express-session';
import sqliteStoreFactory from 'express-session-sqlite';
import { GraphQLLocalStrategy } from 'graphql-passport';
import passport, { PassportStatic } from 'passport';
import sqlite3 from 'sqlite3';
import Container, { Inject, Service } from 'typedi';

import config from 'config';
import { AuthService } from 'services/auth.service';
import { UsersService } from 'services/user.service';
import { UserWithoutPassword } from 'types/context';

type Payload = { id: number; email: string };

declare global {
  namespace Express {
    interface User extends UserWithoutPassword {}
  }
}

@Service()
export class PassportWrapper {
  private _passport: PassportStatic;
  private _strategyName = 'graphql-local';

  constructor(private authService: AuthService) {
    this._passport = passport;
    this.iniSSerialize();
    this.initDeserialize();
    this.initStrategy();
  }

  iniSSerialize() {
    this._passport.serializeUser(
      (user: UserWithoutPassword, done: CallableFunction) => {
        return done(null, { id: user.id, email: user.email });
      },
    );
  }

  initDeserialize() {
    this._passport.deserializeUser(
      async (
        req: Request,
        payload: Payload,
        done: (err: unknown, user?: Express.User | false | null) => void,
      ) => {
        const usersService = Container.get(UsersService);

        const returnedUser = await usersService.findByEmail(payload.email);

        return done(null, returnedUser);
      },
    );
  }

  initStrategy() {
    this._passport.use(
      new GraphQLLocalStrategy((email, password, done) => {
        if (typeof email === 'string' && typeof password === 'string') {
          this.authService
            .signin(email, password)
            .then((userData) => {
              if (!userData.id) {
                return done(null, userData);
              }

              return done(null, userData);
            })
            .catch(done);
        } else {
          done(new Error('Email or password is not string'));
        }
      }),
    );
  }

  async authenticate(
    authenticator: CallableFunction,
    options: { email: string; password: string },
  ) {
    return authenticator(this._strategyName, options);
  }

  getExpressMiddlewares() {
    return [
      this._passport.initialize.bind(this._passport),
      this._passport.session.bind(this._passport),
    ];
  }
}

@Service()
export class ExpressWrapper {
  public app: Express;
  constructor(private passport: PassportWrapper) {
    this.app = express();
    this.initSession();
    this.initializeMiddlewares();
    this.setHeadersForApolloStudio();
  }

  initializeMiddlewares() {
    const [passportInitialize, passportSession] =
      this.passport.getExpressMiddlewares();

    this.app.use(passportInitialize());
    this.app.use(passportSession());
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  setHeadersForApolloStudio() {
    this.app.set('trust proxy', process.env.NODE_ENV !== 'production');
    this.app.set('Access-Control-Allow-Origin', config.apolloStudioUrl);
    this.app.set('Access-Control-Allow-Credentials', true);
  }

  initSession() {
    const SqliteStore = sqliteStoreFactory(session);

    // TODO: Using sqlite store for now for faster development times. Migrate to redis in prod.
    this.app.use(
      session({
        secret: config.sessionSecret,
        saveUninitialized: false,
        resave: false,
        cookie: {
          sameSite: 'none',
          httpOnly: false,
          maxAge: 60000,
          secure: true,
        },
        store: new SqliteStore({
          // Database library to use. Any library is fine as long as the API is compatible
          // with sqlite3, such as sqlite3-offline
          driver: sqlite3.Database,
          // for in-memory database
          // path: ':memory:'
          path: '/tmp/sqlite.db',
          // Session TTL in milliseconds
          ttl: 3000000,
          // (optional) Session id prefix. Default is no prefix.
          prefix: 'sess:',
          // (optional) Adjusts the cleanup timer in milliseconds for deleting expired session rows.
          // Default is 50 minutes.
          cleanupInterval: 3000000,
        }),
        unset: 'destroy',
      }),
    );
  }
}
