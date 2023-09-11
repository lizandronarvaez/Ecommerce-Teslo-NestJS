import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Authentication_Autorization, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { Users } from 'src/auth/entities/users.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Producto } from './entities';

@ApiTags('Productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @Authentication_Autorization()
  @ApiResponse({
    status: 201,
    description: 'Producto creado correctamente',
    type: Producto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createProductoDto: CreateProductoDto, @GetUser() user: Users) {
    return this.productosService.create(createProductoDto, user);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Listado de productos',
    type: Producto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productosService.findAll(paginationDto);
  }

  @Get(':word')
  findOne(@Param('word') word: string) {
    return this.productosService.findOneplain(word);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductoDto: UpdateProductoDto,
    @GetUser() user: Users,
  ) {
    return this.productosService.update(id, updateProductoDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productosService.remove(id);
  }
}
