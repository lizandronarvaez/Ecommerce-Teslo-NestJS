import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces';

export const META_ROLES = 'roles';
export const CheckRoles = (...args: ValidRoles[]) => {
  return SetMetadata(META_ROLES, args);
};
