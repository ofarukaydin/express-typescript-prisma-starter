import { Express, Request } from 'express';
import { GraphQLLocalStrategy } from 'graphql-passport';
import passport from 'passport';
import Container from 'typedi';

import { AuthService } from 'services/auth.service';
import { UsersService } from 'services/user.service';
import { UserWithoutPassword } from 'types/context';

type Payload = { id: number; email: string };

declare global {
  namespace Express {
    interface User extends UserWithoutPassword {}
  }
}

export function initPassport(app: Express) {
  passport.serializeUser((user, done) => {
    return done(null, { id: user.id, email: user.email });
  });

  passport.deserializeUser(
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

  passport.use(
    new GraphQLLocalStrategy((email, password, done) => {
      if (typeof email === 'string' && typeof password === 'string') {
        const authService = Container.get(AuthService);
        authService
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

  app.use(passport.initialize());
  app.use(passport.session());
}
