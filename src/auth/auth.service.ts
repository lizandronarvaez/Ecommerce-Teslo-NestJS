import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
// import { comparePassword, hashPassword } from './helpers/bcrypt.helper';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from './helpers/bcrypt.helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly jwtService: JwtService,
    private readonly users: Users,
  ) {}

  // METODO REGISTRAR USUARIO
  async register(createUserDto: CreateUserDto) {
    // Creamos la plantilla para insertar en la base de datos
    const user = this.userRepository.create(createUserDto);
    try {
      await this.userRepository.save(user);
      delete user.password;
      return {
        ...user,
        token: this.generateTokenJwt({ id: user.id }),
      };
    } catch (error) {
      this.handleDBerror(error);
    }
  }

  // METODO PARA LOGEAR
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    //  Utilizar este metodo para realizar una bsqueda y cuando la realizemos, no devuelva los campos que queremos ver
    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        email: true,
        password: true,
        fullName: true,
        id: true,
      },
    });
    if (!user)
      throw new UnauthorizedException(`El email ${email} no está registrado`);

    const passwordIsValid = comparePassword(password, user.password);
    if (!passwordIsValid)
      throw new UnauthorizedException('La contraseña no es correcta');

    // TODO: Generar el token cuando se inicie sesion
    // TODO: Usar siempre el id para generar el token
    const token = this.generateTokenJwt({ id: user.id });
    delete user.password;
    delete user.id;
    return {
      ...user,
      token,
    };
  }
  // Metodo para comprobar el usuario a traves del token
  async checkStatus(authorization: string) {
    // Extraigo el token
    const token = authorization.split(' ')[1];
    // Descrifo el token
    const { id } = this.jwtService.verify(token);
    // Buscar el usuario con ese id
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        password: true,
      },
    });
    // Generamos el nuevo token
    const newToken = this.generateTokenJwt({ id: user.id });
    delete user.id;
    // Retorno el token
    return {
      ...user,
      newToken,
    };
  }
  // Generar el token
  private generateTokenJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  // never jamas va a regresar un valor
  private handleDBerror(error: any): never {
    if (error.code === '23505') {
      const err = error.detail.replace(/[{(),"",.}]/g, '');
      throw new BadRequestException(err);
    }
    throw new InternalServerErrorException('Ocurrio un error, revisa el log');
  }
}
