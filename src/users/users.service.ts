import { Service } from 'typedi';

import { UserRepository } from 'users/users.repository';

@Service()
export class UsersService {
  constructor(private readonly usersRepository: UserRepository) {}

  async create(email: string, password: string) {
    return this.usersRepository.create(email, password);
  }

  async getByEmailAndIncludePassword(email: string) {
    return this.usersRepository.getByEmailAndIncludePassword(email);
  }

  async getByEmail(email: string) {
    return this.usersRepository.getByEmail(email);
  }

  async getById(id: number) {
    return this.usersRepository.getById(id);
  }

  async getAllUsers() {
    return this.usersRepository.getAllUsers();
  }
}
