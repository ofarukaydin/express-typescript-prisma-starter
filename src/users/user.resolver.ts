import { User } from '@generated/type-graphql';
import { Authorized, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';

import { UsersService } from './user.service';
@Service()
@Resolver()
export default class UsersResolver {
  constructor(private userService: UsersService) {}

  @Query(() => [User])
  @Authorized()
  async getAllUsers() {
    const userData = await this.userService.getAllUsers();

    return userData;
  }
}
