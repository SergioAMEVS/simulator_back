import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Respondant } from '../../entities/respondant.entity';

@Injectable()
export class RespondantService {
  constructor(
    @InjectRepository(Respondant)
    private UserRepository: Repository<Respondant>,
  ) {}

  async findAll(): Promise<Respondant[]> {
    return this.UserRepository.find();
  }

  async findOne(id: number): Promise<Respondant | undefined> {
    return this.UserRepository.findOne({
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

  async getCount(temp, options): Promise<any> {
    try {
      // let temp = [{filter:1, selected: ["1","2","3"]}, {filter:2, selected: ["1","3","4"]}];

      let multiplier = 0.0;
      let pref1 = [
        [0.0, 0.0, 0.0, 0.029, -0.152, -0.16],
        [0.407, 0.259, 0.0, -0.202, 0.0, -0.052],
        [0.336, 0.0, 0.283, 0.357, 0.0, 0.232],
        [-0.284, -0.147, 0.0, 0.0, -0.17, -0.337],
        [-0.22, 0.191, -0.112, 0.0, 0.0, 0.056],
        [-0.342, -0.251, -0.275, -0.322, -0.248, -0.142],
        [0.058, 0.0, 0.0, -0.169, -0.127, 0.122],
        [0.385, 0.169, 0.471, 0.295, 0.062, 0.357],
        [0.0, 0.032, 0.289, -0.259, 0.2, 0.466],
        [0.0, , -0.251, -0.222, 0.0, 0.099, 0.334],
        [-0.202, 0.0, -0.172, 0.03, 0.284, -0.05],
      ];

      let pref2 = [
        [0.14, -0.142, 0.0, 0.0, -0.117, -0.114],
        [0.0, 0.451, 0.149, -0.189, -0.06, -0.071],
        [0.482, -0.124, 0.315, 0.474, -0.053, 0.196],
        [-0.21, -0.188, 0.053, 0.0, -0.293, -0.314],
        [-0.186, 0.216, -0.045, -0.079, 0.0, -0.059],
        [-0.181, -0.25, -0.199, -0.246, -0.234, -0.217],
        [0.353, -0.108, -0.409, -0.071, -0.117, -0.048],
        [0.305, 0.133, 0.149, 0.147, 0.107, 0.202],
        [0.0, 0.258, 0.07, -0.212, 0.067, 0.443],
        [-0.167, -0.2, -0.153, -0.079, 0.214, 0.126],
        [0.0, -0.212, -0.115, 0.253, 0.349, 0.0],
      ];

      let pref3 = [
        [-0.028, -0.055, -0.093, 0.06, -0.163, -0.048],
        [0.0, 0.43, 0.264, -0.205, 0.12, -0.043],
        [0.423, 0.019, 0.208, 0.438, 0.0, 0.314],
        [-0.185, -0.243, 0.047, 0.0, -0.245, -0.194],
        [-0.133, 0.557, 0.0, -0.057, -0.143, 0.204],
        [-0.196, -0.2, -0.241, -0.156, -0.354, -0.152],
        [0.308, 0.0, 0.0, -0.357, 0.0, -0.107],
        [0.522, 0.124, 0.514, 0.167, 0.477, 0.608],
        [0.097, 0.171, 0.203, -0.186, 0.366, 0.248],
        [0.0, 0.0, -0.034, -0.025, 0.163, 0.152],
        [0.0, -0.143, -0.143, 0.222, 0.314, -0.048],
      ];

      let pref4 = [
        [0.245, 0.427, 0.167, -0.062, -0.243, -0.193],
        [0.089, 0.246, 0.128, -0.126, 0.143, -0.184],
        [0.63, 0.056, 0.578, 0.585, -0.129, 0.45],
        [0.0, -0.031, 0.061, 0.056, 0.036, -0.095],
        [-0.197, 0.081, -0.187, -0.115, 0.0, 0.205],
        [-0.163, -0.229, -0.167, 0.0, -0.243, -0.168],
        [0.344, 0.056, 0.061, 0.0, -0.079, 0.52],
        [0.131, 0.203, 0.417, 0.287, 0.557, 0.589],
        [0.149, 0.0, 0.311, -0.153, 0.123, 0.253],
        [0.059, -0.231, -0.074, -0.051, 0.188, 0.239],
        [-0.016, 0.034, -0.128, 0.167, 0.118, 0.0],
      ];
      let min_value = '400000';
      if (
        parseInt(temp.find((element) => element.filter == 1).selected[0]) == 1
      ) {
        min_value = '400000';
        multiplier =
          pref1[
            parseInt(temp.find((element) => element.filter == 6).selected[0]) -
              1
          ][
            parseInt(temp.find((element) => element.filter == 2).selected[0]) -
              1
          ];
      } else if (
        parseInt(temp.find((element) => element.filter == 1).selected[0]) == 2
      ) {
        min_value = '335000';
        multiplier =
          pref2[
            parseInt(temp.find((element) => element.filter == 6).selected[0]) -
              1
          ][
            parseInt(temp.find((element) => element.filter == 2).selected[0]) -
              1
          ];
      } else if (
        parseInt(temp.find((element) => element.filter == 1).selected[0]) == 3
      ) {
        min_value = '335000';
        multiplier =
          pref3[
            parseInt(temp.find((element) => element.filter == 6).selected[0]) -
              1
          ][
            parseInt(temp.find((element) => element.filter == 2).selected[0]) -
              1
          ];
      } else if (
        parseInt(temp.find((element) => element.filter == 1).selected[0]) == 4
      ) {
        min_value = '310000';
        multiplier =
          pref4[
            parseInt(temp.find((element) => element.filter == 6).selected[0]) -
              1
          ][
            parseInt(temp.find((element) => element.filter == 2).selected[0]) -
              1
          ];
      }
      let lst = options.map((item) => item.question_id);

      let query = this.UserRepository.createQueryBuilder('respondant')
        .leftJoin(`respondant.description`, `description1`)
        .leftJoin(`description1.value`, `value1`, `"value1"."filterId" = 1`)
        .leftJoin(`respondant.description`, `description2`)
        .leftJoin(`description2.value`, `value2`, `"value2"."filterId" = 2`)
        .leftJoin(`respondant.description`, `description3`)
        .leftJoin(`description3.value`, `value3`, `"value3"."filterId" = 6`)

        .leftJoin(
          `value3.question`,
          `question1`,
          `"question1"."id" = ${lst[0]}`,
        )
        .leftJoin(`question1.options`, `option1`)
        .leftJoin(
          `option1.answers`,
          `answer1`,
          `answer1.respondantId = respondant.id`,
        )
        .leftJoin(
          `value3.question`,
          `question2`,
          `"question2"."id" = ${lst[1]}`,
        )
        .leftJoin(`question2.options`, `option2`)
        .leftJoin(
          `option2.answers`,
          `answer2`,
          `answer2.respondantId = respondant.id`,
        )
        .leftJoin(
          `value3.question`,
          `question3`,
          `"question3"."id" = ${lst[2]}`,
        )
        .leftJoin(`question3.options`, `option3`)
        .leftJoin(
          `option3.answers`,
          `answer3`,
          `answer3.respondantId = respondant.id`,
        )
        .leftJoin(
          `value3.question`,
          `question4`,
          `"question4"."id" = ${lst[3]}`,
        )
        .leftJoin(`question4.options`, `option4`)
        .leftJoin(
          `option4.answers`,
          `answer4`,
          `answer4.respondantId = respondant.id`,
        )

        .where(
          `answer1.value IS NOT null AND answer2.value IS NOT NULL AND answer3.value IS NOT NULL AND answer4.value IS NOT NULL`,
        )
        .andWhere(
          `CASE WHEN CAST(answer1.value as int)*(1+${multiplier}/4)<${min_value} THEN ${min_value} ELSE CAST(answer1.value as int)*(1+${multiplier}/4) END < CAST(answer2.value as int)*(1+${multiplier}/4) AND CAST(answer2.value as int)*(1+${multiplier}/4) < CAST(answer3.value as int)*(1+${multiplier}/4) AND CAST(answer3.value as int)*(1+${multiplier}/4) < CAST(answer4.value as int)*(1+${multiplier}/4)`,
        )
        .andWhere(
          `description1.id IS NOT null AND description2.id IS NOT null AND description3.id IS NOT null`,
        )
        .andWhere(
          `value1.value IN ('${temp
            .find((element) => element.filter == 1)
            .selected.join("','")}')`,
        )
        .andWhere(
          `value2.value IN ('${temp
            .find((element) => element.filter == 2)
            .selected.join("','")}')`,
        )
        .andWhere(
          `value3.value IN ('${temp
            .find((element) => element.filter == 6)
            .selected.join("','")}')`,
        );
      //   temp.forEach((element, index) => {
      //     query.orWhere(`(value.filterId = ${element.filter} AND value.value IN ('${element.selected.join("','")}'))`)
      //   })
      //   query.andWhere(`(question.id IS NULL OR (question.id IN (${lst[0]}, ${lst[1]}, ${lst[2]}, ${lst[3]}) AND answer.value IS NOT NULL))`)

      let res = await query.select(`respondant.id`).getRawMany();

      return res;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}
