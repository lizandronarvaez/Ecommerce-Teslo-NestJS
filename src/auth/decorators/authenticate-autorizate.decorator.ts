import { UseGuards, applyDecorators } from '@nestjs/common';
import { CheckRoles } from './check-roles.decorator';
import { RolesUserGuard } from '../guards/roles-user.guard';
import { AuthGuard } from '@nestjs/passport';
import { ValidRoles } from '../interfaces';

export const Authentication_Autorization = (...roles: ValidRoles[]) => {
  return applyDecorators(
    // Con este custom decorators verificamos que el usuario que intenta acceder a la pagina es un usuario, super-user o admin
    CheckRoles(...roles),
    // COn este decoramos verificamos la autenticacion y con el otro verificamos la autorizacion
    UseGuards(AuthGuard(), RolesUserGuard),
  );
};
