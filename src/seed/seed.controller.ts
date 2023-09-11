/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Authentication_Autorization } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  // @Authentication_Autorization()
  seedExecute() {
    return this.seedService.runSeed();
  }
}
