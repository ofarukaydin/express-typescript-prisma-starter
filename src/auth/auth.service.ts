import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

import { Service } from 'typedi';

import { UsersService } from 'users/users.service';
import { AppError } from 'utils/error';

const scrypt = promisify(_scrypt);

@Service()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const foundUser = await this.usersService.getByEmailAndIncludePassword(
      email,
    );

    if (foundUser) {
      throw new AppError({ message: 'User already exists' });
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const result = `${salt}.${hash.toString('hex')}`;

    const user = await this.usersService.create(email, result);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...rest } = user;

    return rest;
  }

  async signin(email: string, password: string) {
    const user = await this.usersService.getByEmailAndIncludePassword(email);

    if (!user?.id) {
      throw new AppError({ message: 'User not found' });
    }

    const [salt, storedHash] = user.password.split('.');

    if (!(salt && storedHash)) {
      throw new AppError({
        message:
          'An error occurred while splitting password into salt and hash',
      });
    }

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new AppError({ message: 'Invalid password' });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...rest } = user;

    return rest;
  }
}
