import { Injectable } from '@nestjs/common';
import { ProductosService } from 'src/productos/productos.service';
import { initialData } from './data/seedData';

@Injectable()
export class SeedService {
  // Para inyectarlo en la base de datos
  // debemos crearlo con el constructor
  constructor(private readonly productoService: ProductosService) {}

  private async insertNewProducts() {
    await this.productoService.removeAllProductos();
    const seedProductos = initialData.products;

    const insertPromises = [];
    seedProductos.forEach((producto) => {
      insertPromises.push(this.productoService.create(producto));
    });

    await Promise.allSettled(insertPromises);
  }

  async runSeed() {
    await this.insertNewProducts();

    return `Servicio seed funcionando`;
  }
}
