import { AuthService } from './auth.service';
import { Users } from './entities/users.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';
import { RolesUserGuard } from './guards/roles-user.guard';
import { ValidRoles } from './interfaces';
import {
  GetHeaders,
  GetUser,
  CheckRoles,
  Authentication_Autorization,
} from './decorators';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authenticacion')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'Registro de usuarios',
    type: Users,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto de datos',
  })
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiCreatedResponse({
    status: 201,
    description: 'Login usuarios',
    schema: {
      example: {
        fullName: 'lizandro narvaez',
        email: 'correo@hotmail.com',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImUyNzU0NWRlLTg4YjgtNGRlZS1iNzI5LTRkOGExNDNmOTlhYSIsImlhdCI6MTY5NDI5NzUxNywiZXhwIjoxNjk0MzAxMTE3fQ.XzF8huKxWp3eKcfdrtHMhGMuR1yfo6VmWxufshHOWFE',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  // TAREA:CheckStatus
  @Get('check-auth')
  @Authentication_Autorization()
  checkAuthStatus(@Headers('authorization') authorization: string) {
    return this.authService.checkStatus(authorization);
  }
  @Get('private')
  @UseGuards(AuthGuard())
  testingRouteJwt(
    @GetUser() user: Users,
    @GetUser('email') email: string,
    // Una forma de retornar los header
    @GetHeaders() rawheaders: string[],
    // Otra forma de retornar
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return {
      token: 'Es valido',
      user,
      userEmail: email,
      rawheaders,
      headers: headers.authorization.split(' ')[1],
    };
  }

  @Get('private2')
  // Con este custom decorators verificamos que el usuario que intenta acceder a la pagina es un usuario, super-user o admin
  @CheckRoles(ValidRoles.superUser, ValidRoles.admin)
  // COn este decoramos verificamos la autenticacion y con el otro verificamos la autorizacion
  @UseGuards(AuthGuard(), RolesUserGuard)
  privateRoute2(@GetUser() user: Users) {
    return user;
  }

  @Get('private3')
  @Authentication_Autorization(
    ValidRoles.admin,
    ValidRoles.superUser,
    ValidRoles.user,
  )
  @UseGuards(AuthGuard(), RolesUserGuard)
  privateRoute3() {
    return `Soy la ruta 3, estas autorizado`;
  }
}
