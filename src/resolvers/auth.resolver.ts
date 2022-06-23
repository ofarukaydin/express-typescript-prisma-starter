import { User } from '@generated/type-graphql';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';

import { LoginInput } from 'dto/auth.dto';
import { AuthService } from 'services/auth.service';
import { Context } from 'types/context';

@Service()
@Resolver()
export default class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => User)
  async login(
    @Arg('input', { nullable: true }) { email, password }: LoginInput,
    @Ctx() ctx: Context,
  ) {
    const { user } = await ctx.authenticate('graphql-local', {
      // @ts-ignore
      email,
      password,
    });

    if (user) {
      await ctx.login(user);
    }

    return user;
  }

  @Query(() => User, { nullable: true })
  whoAmI(@Ctx() ctx: Context) {
    return ctx.getUser();
  }

  @Mutation(() => User)
  async createUser(@Arg('input') input: LoginInput, @Ctx() ctx: Context) {
    const user = await this.authService.signup(input.email, input.password);

    await ctx.login(user);
    return user;
  }
}
