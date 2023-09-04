import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Producto } from './producto.entity';

@Entity({
  name: 'productos_imagenes',
})
export class ProductoImage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  url: string;

  @ManyToOne(() => Producto, (producto) => producto.images, {
    onDelete: 'CASCADE',
  })
  producto: Producto;
}
