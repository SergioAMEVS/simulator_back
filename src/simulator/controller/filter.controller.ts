import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { FilterService } from '../service/filter.service';
import { Filter } from '../../entities/filter.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('filters')
export class FiltersController {
  constructor(private readonly findService: FilterService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Filter[]> {
    // return 'This action returns all posts.';
    return this.findService.findAll(); 
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number): string {
    return 'This action dosen`t exists.';
  }
}
