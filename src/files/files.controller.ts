import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, filterFile } from './helpers';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Productos_Images')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('images_productos/:imageName')
  findImageProducto(
    // Rest es para enviar una respuesta personalizada como en express
    @Res() res: Response,
    @Param('imageName')
    imageName: string,
  ) {
    const pathImage = this.filesService.getImageProduct(imageName);
    // SendFile devuelve el archivo como respuesta
    res.sendFile(pathImage);
  }

  // Para subir archivos se sube con un endpoint post como siempre
  @Post('images_productos')
  // Se usa un interceptor que busca el nombre del input que utilizamos apra subir el archivo
  @UseInterceptors(
    FileInterceptor('file', {
      // Esto permite filtrar o validar el archivo que se va a subir
      fileFilter: filterFile,
      storage: diskStorage({
        destination: './static/productos',
        filename: editFileName,
      }),
    }),
  )
  // creamos un metodo para subir el archivo, este metodo utiliza un decorador @UploadFIle()
  // file es el nombre del archivo y pones express.multer.file
  uploadedFileImage(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadImageProducto(file);
  }
}
