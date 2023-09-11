import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductoDto {
  @ApiProperty({
    example: 'Título Producto',
    nullable: false,
  })
  @MinLength(1)
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Precio Producto',
    nullable: true,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    example: 'Descripción Producto',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'Slug Producto',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    example: 'Stock Producto',
    nullable: true,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    example: ['Sizes Producto'],
    nullable: false,
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  /**Este decorador obliga a que solo se introduzca estos datos cuando se crea el producto */
  @ApiProperty({
    example: 'Categoria Producto',
    nullable: false,
  })
  @IsIn(['men', 'women', 'kids', 'unisex'])
  gender: string;

  @ApiProperty({
    example: ['Tags Producto'],
    nullable: false,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @ApiProperty({
    example: ['Imagenes Producto'],
    nullable: true,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
