import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ScenarioService } from '../service/scenario.service';
import { Scenario } from 'src/entities/scenario.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('get')
export class LoadController {
  constructor(private readonly scenarioService: ScenarioService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req): Promise<Scenario[]> {
    return this.scenarioService.findAll(req.user.userNameID);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number): Promise<Scenario | undefined> {
    return this.scenarioService.findOne(id);
  }
}

@Controller('scenario')
export class ScenarioController {
  constructor(private readonly scenarioService: ScenarioService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req): Promise<Scenario[]> {
    return this.scenarioService.findAll(req.user.userNameID);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createScenario(@Req() req, @Body() request: any): Promise<any> {
    try {
      let checkTitle = await this.scenarioService.checkTitle(
        request.title,
        req.user.userNameID,
      );

      if (checkTitle.status == 'error') {
        return checkTitle;
      }

      let scenario = await this.scenarioService.createScenario(
        request.title,
        request.selected,
        req.user.userNameID,
      );

      if (scenario == null) {
        return { status: 'error', message: 'Error creating scenario.' };
      }
      return {
        id: scenario.id,
        status: 'success',
      };
    } catch (e) {
      console.log(e);
      return { status: 'error', message: 'Error creating scenario.' };
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async loadScenario(@Param('id') id: number): Promise<any> {
    try {
      let scenario = await this.scenarioService.findOne(id);
      if (scenario == null) {
        return { status: 'error', message: 'Scenario not found.' };
      }
      return scenario;
    } catch {
      return { status: 'error', message: 'Error loading scenario.' };
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateScenario(
    @Param('id') id: number,
    @Body() request: any,
  ): Promise<any> {
    try {
      let checkTitle = await this.scenarioService.checkTitleForUpdate(
        id,
        request.title,
      );

      if (checkTitle.status == 'error') {
        return checkTitle;
      }

      let scenario = await this.scenarioService.updateScenario(
        id,
        request.title,
        request.selected,
      );

      if (scenario == null) {
        return { status: 'error', message: 'Scenario not found.' };
      }
      return {
        status: 'success',
      };
    } catch (e) {
      console.log(e);
      return { status: 'error', message: 'Error updating scenario.' };
    }
  }
}

@Controller('delete')
export class DeleteController {
  constructor(private readonly scenarioService: ScenarioService) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteScenario(@Param('id') id: number): Promise<any> {
    try {
      let scenario = await this.scenarioService.deleteScenario(id);

      return {
        status: 'success',
      };
    } catch {
      return { status: 'error', message: 'Error deleting scenario.' };
    }
  }
}
