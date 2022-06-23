import { createParamDecorator } from 'type-graphql';

import { Context } from 'types/context';

export function CurrentUser() {
  return createParamDecorator<Context>(({ context }) => context.getUser());
}
