import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductoImage } from './productoImage.entity';

/**Las entidades es la forma en la que la base de datos se va a formar o como vamos a querer que luzca */
@Entity({ name: 'productos' })
export class Producto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  title: string;

  @Column({ type: 'float', default: 0 })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'text', array: true })
  sizes: string[];

  @Column('text')
  gender: string;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @OneToMany(() => ProductoImage, (productoImage) => productoImage.producto, {
    cascade: true,
    // Sirve para mostrar relaciones de productos
    eager: true,
  })
  images?: ProductoImage[];

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
