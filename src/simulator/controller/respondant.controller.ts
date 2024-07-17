import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RespondantService } from '../service/respondant.service';
import { Respondant } from '../../entities/respondant.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly findService: RespondantService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Respondant[]> {
    // return 'This action returns all posts.';
    return this.findService.findAll(); 
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number): Promise<Respondant> {
    return this.findService.findOne(id);
  }
}