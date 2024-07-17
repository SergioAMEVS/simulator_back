import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Option } from '../../entities/option.entity';
import { Question } from 'src/entities/question.entity';
import { FilterValue } from 'src/entities/filtervalue.entity';

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(Option)
    private OptionRepository: Repository<Option>,

    @InjectRepository(Question)
    private QuestionRepository: Repository<Question>,

    @InjectRepository(FilterValue)
    private FilterValueRepository: Repository<FilterValue>,
  ) {}

  async findAll(): Promise<Option[]> {
    return this.OptionRepository.find();
  }

  async findOne(id: number): Promise<Option | undefined> {
    return this.OptionRepository.findOne({
      relations: [
        'description',
        'description.value',
        'description.value.filter',
      ],
      where: {
        id: id,
      },
    });
  }

  async getOptions(temp): Promise<any> {
    try {
      // let temp = [{filter:1, selected: ["1","2","3"]}, {filter:2, selected: ["1","3","4"]}];
      let filterVal = temp.find((element) => element.filter == 6).selected[0];

      let queryFilter = this.FilterValueRepository.createQueryBuilder(
        'filtervalue',
      )
        .select(`filtervalue.id`)
        .where(
          `filtervalue.value = '${filterVal}' AND filtervalue.filterId = 6`,
        );
      let questionToFind = (await queryFilter.getRawOne()).filtervalue_id;

      let queryQuestion = this.QuestionRepository.createQueryBuilder('question')
        .select(`question.id`)
        .where(`question.filterId = ${questionToFind}`);

      let res = await queryQuestion.getRawMany();

      //   let res = await query.select(`respondant.id`).groupBy(`respondant.id`)
      //   .having(`COUNT(*) = ${temp.length}`).getRawMany()

      //   console.log(questionToFind)

      return res;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}
