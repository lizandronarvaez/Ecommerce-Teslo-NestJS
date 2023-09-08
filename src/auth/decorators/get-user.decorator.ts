import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  // La data son los valores que le pasamos por parametros a los custom decorators
  (data: string, context: ExecutionContext) => {
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      // Un error internal es un error que el desarrollador backend lo realiza
      throw new InternalServerErrorException(`Usuario no encontrado`);
    }
    // // Si la data o el campo que buscamos existe
    // // Devuelve el campo
    // if (data) {
    //   return user[data];
    // }
    // // Sino existe la data o el campo
    // // Devuelve el usuario
    // return user;

    // OTRA FORMA DE HACER EL RETORNO
    return data ? user[data] : user;
  },
);
