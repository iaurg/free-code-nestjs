import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// need to use a class instead of an interface because we need to use validation
export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
