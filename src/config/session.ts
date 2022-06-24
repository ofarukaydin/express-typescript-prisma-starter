import { RequestHandler } from 'express';
import session from 'express-session';
import { Service } from 'typedi';

import config from 'config';
import { SqlLiteSessionStorage } from 'config/sqlite-store';

@Service()
export class SessionMiddleware {
  public session: RequestHandler;

  constructor(private sqliteStorage: SqlLiteSessionStorage) {
    this.session = session({
      secret: config.sessionSecret,
      saveUninitialized: false,
      resave: false,
      cookie: {
        sameSite: 'none',
        httpOnly: false,
        maxAge: 60000,
        secure: true,
      },
      store: this.sqliteStorage.store,
      unset: 'destroy',
    });
  }

  getSessionMiddleware() {
    return this.session;
  }
}
