import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosModule } from './productos/productos.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      /*Acordarse siempre de poner el + por delante
       Significa que es un numero y no un string*/
      port: +process.env.DB_PORT,
      database: process.env.POSTGRES_DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      autoLoadEntities: true,
      retryDelay: 3000,
      synchronize: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    ProductosModule,

    CommonModule,

    SeedModule,

    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
