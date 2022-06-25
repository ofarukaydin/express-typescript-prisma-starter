import { IsEmail, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export abstract class LoginInput {
  @Field({ nullable: false })
  @IsEmail()
  abstract email: string;

  @Field({ nullable: false })
  @Length(6)
  abstract password: string;
}
