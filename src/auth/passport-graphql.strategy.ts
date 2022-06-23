import { GraphQLLocalStrategy } from 'graphql-passport';
import { Strategy } from 'passport';
import { Service } from 'typedi';

import { AuthService } from 'auth/auth.service';
import { UserWithoutPassword } from 'types/context';
import { UsersService } from 'users/user.service';

type Payload = Pick<UserWithoutPassword, 'id' | 'email'>;

declare global {
  namespace Express {
    interface User extends UserWithoutPassword {}
  }
}

export interface PassportStrategy<T = UserWithoutPassword> {
  serializer: (user: T, done: (err: unknown, payload: Payload) => void) => void;
  deserializer: (
    payload: Payload,
    done: (err: unknown, user?: T | null) => void,
  ) => void;
  strategy: Strategy;
}

@Service()
export class GraphQLLocalStrategyWrapper implements PassportStrategy {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  public name = 'graphql-local';

  get serializer() {
    const serializer: PassportStrategy['serializer'] = (user, done) => {
      return done(null, { id: user.id, email: user.email });
    };

    return serializer;
  }

  get deserializer() {
    const deserializer: PassportStrategy['deserializer'] = async (
      payload,
      done,
    ) => {
      const returnedUser = await this.usersService.findByEmail(payload.email);

      return done(null, returnedUser);
    };

    return deserializer;
  }

  get strategy() {
    return new GraphQLLocalStrategy((email, password, done) => {
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
    });
  }
}
