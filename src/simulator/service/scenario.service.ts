import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Scenario } from 'src/entities/scenario.entity';
import { Repository, Not } from 'typeorm';
import { UserService } from './user.service';

@Injectable()
export class ScenarioService {
  constructor(
    @InjectRepository(Scenario)
    private ScenarioRepository: Repository<Scenario>,
    private userService: UserService,
  ) {}

  async checkTitle(scenarioTitle, userNameID): Promise<any> {
    const user = await this.userService.findUserByNameID(userNameID);
    if (!user) {
      throw new Error('User not found');
    }

    console.log('user', user);
    let scenario = await this.ScenarioRepository.findOne({
      where: { title: scenarioTitle, userId: user.id },
    });

    if (scenario == null) return { status: 'success' };

    return {
      status: 'error',
      message: 'Title already exists. Please choose another one.',
    };
  }

  async checkTitleForUpdate(id, scenarioTitle): Promise<any> {
    let res = {};

    let scenario = await this.ScenarioRepository.findOne({
      where: { title: scenarioTitle, id: Not(id) },
    });

    if (scenario == null) return { status: 'success' };

    return {
      status: 'error',
      message: 'Title already exists. Please choose another one.',
    };
  }

  async createScenario(scenarioTitle, selected, userNameID): Promise<any> {
    let scenario = new Scenario();
    scenario.title = scenarioTitle;
    scenario.creation_date = new Date().toISOString();
    scenario.last_modified = new Date().toISOString();

    const user = await this.userService.findUserByNameID(userNameID);
    if (!user) {
      throw new Error('User not found');
    }
    scenario.user = user;
    scenario.state = JSON.stringify(selected);

    return this.ScenarioRepository.save(scenario);
  }

  async updateScenario(id, scenarioTitle, selected): Promise<any> {
    let scenario = await this.ScenarioRepository.findOne({ where: { id: id } });
    if (scenario == null) return null;
    scenario.title = scenarioTitle;
    scenario.last_modified = new Date().toISOString();
    scenario.state = JSON.stringify(selected);
    return this.ScenarioRepository.save(scenario);
  }

  async deleteScenario(id) {
    try {
      return this.ScenarioRepository.delete(id);
    } catch {
      return { status: 'error', message: 'Scenario not found.' };
    }
  }

  async findAll(userNameID: string): Promise<Scenario[]> {
    const user = await this.userService.findUserByNameID(userNameID);
    if (!user) {
      throw new Error('User not found');
    }
    return this.ScenarioRepository.createQueryBuilder('scenario')
      .where('scenario.userId = :userId', { userId: user.id })
      .getMany();
  }

  async findOne(id: number): Promise<Scenario | undefined> {
    return this.ScenarioRepository.findOne({
      where: {
        id: id,
      },
    });
  }
}
