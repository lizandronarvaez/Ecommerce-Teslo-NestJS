import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    default: 10,
    description: 'Devuelve la cantidad de productos que solicitamos',
  })
  @IsOptional()
  @IsPositive()
  // Esto realiza la conversion del query que estamos recibiendo como parametros
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    default: 0,
    description:
      'Devuelve cantidad de productos saltandose el valor que introduzcamos',
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}
