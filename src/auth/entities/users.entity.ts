import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  fullName: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', select: false })
  password: string;

  @Column({ type: 'bool', default: true })
  isActive: boolean;

  @Column({ type: 'text', array: true, default: ['user'] })
  roles: string[];

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
