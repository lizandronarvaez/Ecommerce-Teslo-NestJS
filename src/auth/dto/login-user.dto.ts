import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'Email incorrecto' })
  email: string;

  @IsString()
  password: string;
}
