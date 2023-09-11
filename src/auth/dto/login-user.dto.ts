import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'correo@example.com',
  })
  @IsEmail({}, { message: 'Email incorrecto' })
  // Convertir el email de mayuscula a minuscula
  @Transform((email) => email.value.toLowerCase())
  email: string;

  @ApiProperty({
    example: 'password',
  })
  @IsString()
  password: string;
}
