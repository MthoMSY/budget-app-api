import { IsString, Length, Matches } from 'class-validator';

const PASSWORD_REGEX: RegExp =
  /^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$/;

export class SignUpDto {
  @Length(3, 20)
  @IsString()
  username: string;

  @Length(8, 20)
  @IsString()
  @Matches(PASSWORD_REGEX, {
    message: 'Password strength does not match criteria',
  })
  password: string;
}

export class SignInDto {
  @Length(3, 20)
  @IsString()
  username: string;

  @IsString()
  password: string;
}
