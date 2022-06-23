import { UserWithoutPassword } from 'types/context';
declare global {
  namespace Express {
    export interface Request {
      user: UserWithoutPassword;
    }
  }
}
