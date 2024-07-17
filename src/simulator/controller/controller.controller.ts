import { Controller, Get, Param } from '@nestjs/common';
import {  YourService } from '../service/service.service';

@Controller('controller')
export class ControllerController {}



@Controller('json')
export class JsonController {
  constructor(private readonly yourService: YourService) {}

  @Get()
  async getJsonObject(): Promise<any> {
    return this.yourService.getJsonObject();
  }
}