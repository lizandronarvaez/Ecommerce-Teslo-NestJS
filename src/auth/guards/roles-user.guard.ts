import {
  BadGatewayException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/check-roles.decorator';

@Injectable()
export class RolesUserGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const user = context.switchToHttp().getRequest().user;
    if (!user) throw new BadGatewayException(`User no encontrado`);

    for (const rol of user.roles) {
      if (validRoles.includes(rol)) {
        return true;
      }
    }
    throw new UnauthorizedException(
      `El usuario ${user.fullName} no esta autorizado, no es un usuario-administrador`,
    );
  }
}
