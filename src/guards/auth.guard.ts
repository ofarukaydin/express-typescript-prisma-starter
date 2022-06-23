import { AuthChecker } from 'type-graphql';

import { Context } from 'types/context';

export const customAuthChecker: AuthChecker<Context, string> = ({
  context,
}) => {
  return context.isAuthenticated();
};
