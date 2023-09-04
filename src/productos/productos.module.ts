import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto, ProductoImage } from './entities';

@Module({
  // Cuando se crea una entity se debe agregarlo al modulo
  imports: [TypeOrmModule.forFeature([Producto, ProductoImage])],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService],
})
export class ProductosModule {}
