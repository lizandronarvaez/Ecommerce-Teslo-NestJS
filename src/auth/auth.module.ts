import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Users } from 'src/auth/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, Users],
  imports: [
    TypeOrmModule.forFeature([Users]),
    // Utilizamos passport para utilizar jwt
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory: () => {
        return {
          secret: process.env.SECRET_KEY,
          signOptions: {
            expiresIn: '1d',
          },
        };
      },
    }),
  ],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}

// JwtModule.register({
//   secret: process.env.SECRET_KEY,
//   signOptions: {
//     expiresIn: '1d',
//   },
// }),
