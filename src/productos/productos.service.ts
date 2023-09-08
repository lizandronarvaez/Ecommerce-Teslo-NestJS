/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate as uuidIsValidate } from 'uuid';
import { Producto, ProductoImage } from './entities';
import { Users } from 'src/auth/entities/users.entity';
@Injectable()
export class ProductosService {
  // Busca los errores y muestra el error no todo el log de informacion
  private readonly logger = new Logger('ProductosService');
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,

    @InjectRepository(ProductoImage)
    private readonly productoImageRepository: Repository<ProductoImage>,

    private readonly dataSource: DataSource,
  ) {}
  async create(createProductoDto: CreateProductoDto, user: Users) {
    createProductoDto.title = createProductoDto.title.toLowerCase().trim();

    try {
      // extrae las imagenes y demas propiedades al crear el producto
      const { images = [], ...productoDetails } = createProductoDto;
      // Metodo create recibe los datos con los que el elemento entity se tiene que construir, pero no los almacena, solo crea una plantilla
      const product = this.productoRepository.create({
        // Agregar los productos
        ...productoDetails,
        // Agrega las imagenes y realiza un mapeo de cada una y crear un url
        images: images.map((image) =>
          this.productoImageRepository.create({ url: image }),
        ),
        user,
      });
      // Guarda los datos del producto enviados desde el body en la base de datos
      await this.productoRepository.save(product);
      // Regresamos el produto creado
      return { ...product, images };
    } catch (error) {
      // Si existe un error
      this.handleDatabaseExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;
    const productos = await this.productoRepository.find({
      //  el típico "limit" de SQL con la opción "take", indicando cuántos elementos queremos que nos retornen
      take: limit,
      // Saltate las cantidades que te mande
      skip: offset,
      // Ordena los elementos por orden ascendente
      // order: { title: 'ASC' },
      // Activa las relaciones para que cuando se soliciten por getAll aparescan
      relations: {
        images: true,
      },
    });
    return productos.map(({ images, ...details }) => ({
      ...details,
      images: images.map(({ url }) => url),
    }));
  }

  async findOne(word: string) {
    let producto: Producto;

    if (uuidIsValidate(word)) {
      producto = await this.productoRepository.findOneBy({ id: word });
    } else {
      const queryBuilder = this.productoRepository.createQueryBuilder('prod');
      producto = await queryBuilder
        .where('UPPER(title)=:title or slug=:slug', {
          title: word.toUpperCase(),
          slug: word.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }
    if (!producto) {
      throw new NotFoundException(`El producto con ${word} no existe`);
    }
    return producto;
  }
  // TODO: METODO ESPECIAL QUE REGRESA AL BUSCAR UNO SOLO
  async findOneplain(word: string) {
    const { images = [], ...restProduct } = await this.findOne(word);

    return {
      ...restProduct,
      images: images.map((image) => image.url),
    };
  }
  async update(id: string, updateProductoDto: UpdateProductoDto, user) {
    // Extaemos los productos de el body
    const { images, ...restUpdate } = updateProductoDto;
    // Creamos un objecto de los datos a actualizar
    const newProductoUpdate = {
      id,
      ...restUpdate,
    };
    // Para actualizar buscar el producto por el id, lo prepara y lo actualiza
    const producto = await this.productoRepository.preload(newProductoUpdate);
    // Sino existe el producto nos envia un error al cliente
    if (!producto)
      throw new NotFoundException(
        `No se encuentra el producto con el id ${id}`,
      );
    //
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        // Elimina las imagenes anteriores
        await queryRunner.manager.delete(ProductoImage, { producto: id });
        //Actualiza y Almacena la nuevas imagenes
        producto.images = images.map((img) =>
          this.productoImageRepository.create({ url: img }),
        );
      }
      producto.user = user;
      await queryRunner.manager.save(producto);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      // Si el producto existe lo guarda con los nuevos datos actualizados
      // await this.productoRepository.save(producto);
      // retorna el producto actualizado
      return this.findOneplain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDatabaseExceptions(error);
    }
  }

  async remove(id: string) {
    const producto = await this.findOne(id);
    await this.productoRepository.remove(producto);
    return `Producto eliminado correctamente`;
  }

  private handleDatabaseExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Error Interno');
  }

  // ELIMINAR TODOS LOS PRODUCTOS DE LA TABLA
  async removeAllProductos() {
    const productos = this.productoRepository.createQueryBuilder('producto');

    try {
      await productos.delete().where({}).execute();
    } catch (error) {
      this.handleDatabaseExceptions(error);
    }
  }
}
