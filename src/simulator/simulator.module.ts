import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RespondantService } from './service/respondant.service';
import { AnswerService } from './service/answer.service';
import { FilterService } from './service/filter.service';
import { ScenarioService } from './service/scenario.service';
import { OptionService } from './service/option.service';

import { FiltersController } from './controller/filter.controller';
import { PostsController } from './controller/respondant.controller';
import { ApplyController } from './controller/result.controller';
import {
  ScenarioController,
  DeleteController,
  LoadController,
} from './controller/scenario.controller';

import { Respondant } from '../entities/respondant.entity';
import { Description } from '../entities/description.entity';
import { Question } from '../entities/question.entity';
import { Option } from '../entities/option.entity';
import { Answer } from '../entities/answer.entity';
import { Filter } from '../entities/filter.entity';
import { FilterValue } from '../entities/filtervalue.entity';
import { Chart } from '../entities/chart.entity';
import { ChartConfig } from '../entities/chartconfig.entity';
import { Scenario } from '../entities/scenario.entity';
import { User } from 'src/entities/user.entity';
import { UserService } from './service/user.service';

import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 0,
      max: 180,
    }),
    TypeOrmModule.forFeature([
      Respondant,
      Description,
      Question,
      Option,
      Answer,
      Filter,
      FilterValue,
      Chart,
      ChartConfig,
      Scenario,
      User,
    ]),
  ],
  providers: [
    RespondantService,
    AnswerService,
    FilterService,
    ScenarioService,
    OptionService,
    UserService,
  ],
  controllers: [
    PostsController,
    FiltersController,
    ScenarioController,
    DeleteController,
    LoadController,
    ApplyController,
  ],
})
export class SimulatorModule {}
