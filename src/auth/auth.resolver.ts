import { User } from '@generated/type-graphql';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';

import { LoginInput } from 'auth/auth.dto';
import { AuthService } from 'auth/auth.service';
import { Context, UserWithoutPassword } from 'types/context';
import { CurrentUser } from 'users/current-user.decorator';

@Service()
@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => User)
  async login(
    @Arg('input') { email, password }: LoginInput,
    @Ctx() { authenticate, login }: Context,
  ) {
    const { user } = await authenticate('graphql-local', {
      email,
      password,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    if (user) {
      await login(user);
    }

    return user;
  }

  @Query(() => User, { nullable: true })
  whoAmI(@CurrentUser() user: UserWithoutPassword) {
    return user;
  }

  @Mutation(() => User)
  async createUser(@Arg('input') input: LoginInput, @Ctx() ctx: Context) {
    const user = await this.authService.signup(input.email, input.password);

    await ctx.login(user);
    return user;
  }
}
