import session from 'express-session';
import { Service } from 'typedi';

import { ConfigService } from 'config';
import { SqlLiteSessionStorage } from 'express-app/session/sqlite-store';

@Service()
export class SessionMiddleware {
  public session;

  constructor(
    private sqliteStorage: SqlLiteSessionStorage,
    private configService: ConfigService,
  ) {
    this.session = session({
      secret: this.configService.sessionSecret,
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
