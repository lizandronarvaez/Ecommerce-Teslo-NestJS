import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Users } from '../entities/users.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {
    super({
      secretOrKey: process.env.SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: JwtPayload): Promise<Users> {
    const { id } = payload;
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new UnauthorizedException(`Token is not valid`);

    if (!user.isActive)
      throw new UnauthorizedException(`Usuario inactivo, hubo un error`);

    return user;
  }
}
