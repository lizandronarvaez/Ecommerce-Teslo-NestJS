import { Injectable } from '@nestjs/common';
import { ProductosService } from 'src/productos/productos.service';
import { initialData } from './data/seedData';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/auth/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  // Para inyectarlo en la base de datos
  // debemos crearlo con el constructor
  constructor(
    private readonly productoService: ProductosService,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.insertNewProducts(adminUser);

    return `Servicio seed funcionando`;
  }

  private async deleteTables() {
    await this.productoService.removeAllProductos();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const userSeed = initialData.users;

    const users: Users[] = [];
    userSeed.forEach((user) => users.push(this.userRepository.create(user)));
    const dbUser = await this.userRepository.save(userSeed);

    return dbUser[0];
  }

  private async insertNewProducts(user: Users) {
    await this.productoService.removeAllProductos();
    const seedProductos = initialData.products;
    const insertPromises = [];

    seedProductos.forEach((producto) => {
      insertPromises.push(this.productoService.create(producto, user));
    });

    await Promise.allSettled(insertPromises);
  }
}
