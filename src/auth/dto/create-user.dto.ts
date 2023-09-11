import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'nombre usuario',
  })
  @MinLength(1, { message: 'El nombre es obligatorio' })
  @IsString()
  fullName: string;

  @ApiProperty({
    example: 'email@example.com',
  })
  @IsEmail({}, { message: 'Email incorrecto' })
  @IsNotEmpty({ message: 'Email obligatorio' })
  // @IsString()
  email: string;

  @ApiProperty({
    example: 'password',
  })
  @IsString()
  @Length(6, 50, {
    message: 'La contraseña debe tener minimo 6 caracteres y maximo 50',
  })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe contenedor mayúsculas,minúsculas, letras y números',
  })
  password: string;
}
