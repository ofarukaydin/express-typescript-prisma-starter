/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  validateOrReject,
} from 'class-validator';
import Container, { Service } from 'typedi';

import { AppError } from 'utils/error';

export enum NodeEnvironment {
  development = 'development',
  production = 'production',
  test = 'test',
}

@Service()
export class ConfigService {
  @IsEnum(NodeEnvironment)
  public env = process.env.NODE_ENV as NodeEnvironment;

  @IsNumber({ allowNaN: false })
  public port = parseInt(process.env.PORT!);

  @IsNotEmpty()
  public sessionSecret = process.env.SESSION_SECRET!;

  @IsNotEmpty()
  public apolloStudioUrl = process.env.APOLLO_STUDIO_URL!;

  @IsNotEmpty()
  public sqlitePath = process.env.SESSION_DB_PATH!;

  public corsOptions = {
    origin: [ConfigService.prototype.apolloStudioUrl],
    credentials: true,
  };
}

validateOrReject(Container.get(ConfigService), {
  validationError: {
    target: false,
  },
}).catch((errors) => {
  console.log(errors);
  throw new AppError({
    message: '',
    stack: 'ERROR: Check env variables',
  });
});
