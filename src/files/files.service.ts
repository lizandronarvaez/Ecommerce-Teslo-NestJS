import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  getImageProduct(imageName: string) {
    // Se busca el path de la imagen
    // __dirname, carpeta donde se guardan las imagen, y el tipo de archivos que buscamos
    const path = join(__dirname, '../../static/productos', imageName);
    // Si no existe el path
    if (!existsSync(path)) {
      // Mandamos un error
      throw new BadRequestException(
        `No se encontro el producto con la imagen ${imageName}`,
      );
    }
    // SI existe retornamos el path
    return path;
  }

  uploadImageProducto(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Debe existir una imagen');
    }
    const hostApi = process.env.HOST_API;
    const secureUrl = `${hostApi}/api/files/image_producto/${file.filename}`;
    console.log(secureUrl);
    return { secureUrl };
  }
}
