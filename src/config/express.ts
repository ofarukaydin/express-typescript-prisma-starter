import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import { Service } from 'typedi';

import { PassportWrapper } from 'auth/passport';
import config from 'config';
import { SessionMiddleware } from 'config/session';

@Service()
export class ExpressWrapper {
  public app: Express;
  constructor(
    private passport: PassportWrapper,
    private sessionMiddleware: SessionMiddleware,
  ) {
    this.app = express();
    this.initSession();
    this.initializeMiddlewares();
    this.setHeadersForApolloStudio();
  }

  initializeMiddlewares() {
    const [passportInitialize, passportSession] =
      this.passport.getExpressMiddlewares();

    this.app.use(passportInitialize?.());
    this.app.use(passportSession?.());
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  setHeadersForApolloStudio() {
    this.app.set('trust proxy', config.env !== 'production');
    this.app.set('Access-Control-Allow-Origin', config.apolloStudioUrl);
    this.app.set('Access-Control-Allow-Credentials', true);
  }

  initSession() {
    // TODO: Using sqlite store for now for faster development times. Migrate to redis in prod.
    this.app.use(this.sessionMiddleware.getSessionMiddleware());
  }
}
