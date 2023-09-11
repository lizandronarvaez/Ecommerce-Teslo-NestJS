import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductoImage } from './productoImage.entity';
import { Users } from 'src/auth/entities/users.entity';
import { ApiProperty } from '@nestjs/swagger';

/**Las entidades es la forma en la que la base de datos se va a formar o como vamos a querer que luzca */
@Entity({ name: 'productos' })
export class Producto {
  @ApiProperty({
    example: '28c46f69-09a2-43d5-b8fe-4e08d90e258d',
    description: 'Id producto',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Camiseta Manga Corta',
    description: 'Titulo del producto',
    uniqueItems: true,
  })
  @Column({ type: 'text', unique: true })
  title: string;

  @ApiProperty({
    example: 10.99,
    description: 'Precio del producto',
  })
  @Column({ type: 'float', default: 0 })
  price: number;

  @ApiProperty({
    example:
      'Camiseta fabricada especialmente para recorridos frios, y maratones',
    description: 'Descripción del producto',
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    example: 'camiseta_manga_corta',
  })
  @Column({ type: 'text', unique: true })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Stock Producto',
    default: 0,
  })
  @Column({ type: 'int', default: 0 })
  stock: number;

  @ApiProperty({
    example: ['M', 'L', 'XL', 'XXL'],
    description: 'Tallas del producto',
  })
  @Column({ type: 'text', array: true })
  sizes: string[];

  @ApiProperty({
    example: 'men',
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    example: 'correr running frio trails',
  })
  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @ApiProperty({
    example: 'http://1740176-00-A_0_2000.jpg"',
  })
  @OneToMany(() => ProductoImage, (productoImage) => productoImage.producto, {
    cascade: true,
    // Sirve para mostrar relaciones de productos
    eager: true,
  })
  images?: ProductoImage[];

  @ManyToOne(() => Users, (users) => users.productos, {
    // Carga las relaciones en la tabla
    eager: true,
  })
  user: Users;
  // Metodos antes de insertar
  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  // Metodo para actualizar en la BD
  @BeforeUpdate()
  checkSlugUpdate() {
    if (!this.slug) {
      this.slug = this.slug;
    }
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
