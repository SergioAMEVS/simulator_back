import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Filter } from '../../entities/filter.entity';

@Injectable()
export class FilterService {
  constructor(
    @InjectRepository(Filter)
    private FilterRepository: Repository<Filter>,
  ) {}

  async findAll(): Promise<Filter[]> {
    return this.FilterRepository.find({ 
      where: { active: true }, 
      relations: ['filterValues'],
      order: {
        order: 'ASC'
      } 
    });
  }
}
