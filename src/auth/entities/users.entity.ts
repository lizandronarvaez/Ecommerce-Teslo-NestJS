import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Producto } from 'src/productos/entities';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class Users {
  @ApiProperty({
    example: 'e27545de-88b8-4dee-b729-4d8a143f99aa',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'lizandro narvaez',
  })
  @Column({ type: 'text', unique: true })
  fullName: string;

  @ApiProperty({
    example: 'lizandrojesus13@hotmail.com',
  })
  @Column({ type: 'text', unique: true })
  email: string;

  @ApiProperty({
    example: '$2b$10$6LilGqajKwyKFofr0cODXeq1957NcYXyR/4SNfpa4qP3hj8EfIT9S',
  })
  @Column({ type: 'text', select: false })
  password: string;

  @ApiProperty({
    example: true,
    required: false,
  })
  @Column({ type: 'bool', default: true })
  isActive: boolean;

  @ApiProperty({
    example: ['user'],
    required: false,
    default: ['user'],
  })
  @Column({ type: 'text', array: true, default: ['user'] })
  roles: string[];

  @OneToMany(() => Producto, (producto) => producto.user)
  productos: Producto;
  // Comprobar que los datos se graban en minisculas
  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
    this.fullName = this.fullName.toLowerCase().trim();
  }
  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
    this.hashPassword();
  }
  // FIn de datos de grabacion en minuscula
  // Antes de insertar hashear la password
  @BeforeInsert()
  // Metodo para hashear la password
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  // Metodo para comprobar la password
  comparePassword(password: string, passwordHash: string) {
    return bcrypt.compareSync(password, passwordHash);
  }
}
