import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from '../../entities/answer.entity';
import { Question } from '../../entities/question.entity';
import { Chart } from '../../entities/chart.entity';
import { Respondant } from 'src/entities/respondant.entity';
import { Filter } from 'src/entities/filter.entity';
import { rmSync } from 'fs';
import { config } from 'process';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Respondant)
    private RespondantRepository: Repository<Respondant>,

    @InjectRepository(Answer)
    private AnswerRepository: Repository<Answer>,

    @InjectRepository(Question)
    private QuestionRepository: Repository<Question>,

    @InjectRepository(Chart)
    private ChartRepository: Repository<Chart>,

    @InjectRepository(Filter)
    private FilterRepository: Repository<Filter>,
  ) {}

  async findAll(): Promise<Answer[]> {
    return this.AnswerRepository.find();
  }

  async profile(temp, respondant, options): Promise<any> {
    let count = respondant.length;
    let response = [];

    let filter_config = await this.FilterRepository.createQueryBuilder('filter')
      .where('filter.id <> 6')
      .getRawMany();

    for (let element in filter_config) {
      let item = {
        filter_id: filter_config[element].filter_id,
        filter_name: filter_config[element].filter_name,
        filter_type: filter_config[element].filter_category,
        filter_values: [],
      };
      let query_search = this.RespondantRepository.createQueryBuilder(
        'respondant',
      )
        .select(
          `value.label, CAST(COUNT(*) AS float)/ CAST(${count} AS float) as percentage`,
        )
        .leftJoin(`respondant.description`, `description`)
        .leftJoin(`description.value`, `value`)
        .leftJoin(`value.filter`, `filter`)
        .where(`respondant.id IN (${respondant.join(',')})`)
        .andWhere(`value.filterId = ${filter_config[element].filter_id}`)
        .groupBy(`value.label`);

      item.filter_values = await query_search.getRawMany();

      response.push(item);
    }

    return response;
  }

  async barChart(temp, respondant, options): Promise<any> {
    let count = respondant.length;

    let query = this.RespondantRepository.createQueryBuilder('respondant')
      .select('CAST(option.value AS int), CAST(COUNT(*) as int)')
      .leftJoin(`respondant.answers`, `answer`)
      .leftJoin(`answer.option`, `option`)
      .where('option.questionId = ' + options[6].question_id)
      .andWhere(`respondant.id IN (${respondant.join(',')})`)
      .groupBy(`option.value`);

    function func(total, num) {
      return total + num;
    }
    let res = await query.getRawMany();

    let total = res.map((a) => a.count).reduce(func);

    let technology = {
      size: total,
      xAxis: { data: ['Highly Valueable', 'Neutral', 'Limited Value'] },
      series: {
        data: [
          res.filter((a) => a.value > 7).length > 0
            ? res
                .filter((a) => a.value > 7)
                .map((a) => a.count)
                .reduce(func) / total
            : 0,
          res.filter((a) => a.value > 4 && a.value < 8).length > 0
            ? res
                .filter((a) => a.value > 4 && a.value < 8)
                .map((a) => a.count)
                .reduce(func) / total
            : 0,
          res.filter((a) => a.value < 5).length > 0
            ? res
                .filter((a) => a.value < 5)
                .map((a) => a.count)
                .reduce(func) / total
            : 0,
        ],
      },
    };

    query = this.RespondantRepository.createQueryBuilder('respondant').select(
      'CAST(option.value AS int), CAST(COUNT(*) as int)',
    );
    temp.forEach((element, index) => {
      query
        .leftJoin(`respondant.description`, `description${index}`)
        .leftJoin(
          `description${index}.value`,
          `value${index}`,
          `value${index}.filterId = ${element.filter}`,
        );
    });
    query
      .leftJoin(`respondant.answers`, `answer`)
      .leftJoin(`answer.option`, `option`)
      .where('option.questionId = ' + options[7].question_id);
    temp.forEach((element, index) => {
      query.andWhere(
        `value${index}.value IN ('${element.selected.join("','")}')`,
      );
    });
    query.groupBy(`option.value`);
    res = await query.getRawMany();
    total = res.map((a) => a.count).reduce(func);

    let business = {
      size: total,
      xAxis: { data: ['Highly Valueable', 'Neutral', 'Limited Value'] },
      series: {
        data: [
          res.filter((a) => a.value > 7).length > 0
            ? res
                .filter((a) => a.value > 7)
                .map((a) => a.count)
                .reduce(func) / total
            : 0,
          res.filter((a) => a.value > 4 && a.value < 8).length > 0
            ? res
                .filter((a) => a.value > 4 && a.value < 8)
                .map((a) => a.count)
                .reduce(func) / total
            : 0,
          res.filter((a) => a.value < 5).length > 0
            ? res
                .filter((a) => a.value < 5)
                .map((a) => a.count)
                .reduce(func) / total
            : 0,
        ],
      },
    };

    res = await query.getRawMany();
    return {
      technology: technology,
      business: business,
    };
  }

  async lineChart(temp, respondant, options): Promise<any> {
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

    let filter1 = parseInt(
      temp.find((element) => element.filter == 1).selected[0],
    );
    let index1 =
      parseInt(temp.find((element) => element.filter == 6).selected[0]) - 1;
    let index2 =
      parseInt(temp.find((element) => element.filter == 2).selected[0]) - 1;

    let pref = {
      1: pref1,
      2: pref2,
      3: pref3,
      4: pref4,
    };

    if (pref[filter1]) {
      multiplier = pref[filter1][index1][index2];
    }

    let res = { xAxisData: [], series: { data: [] } };

    let legends = [];

    let config_query = await this.ChartRepository.createQueryBuilder('chart')
      .leftJoinAndSelect('chart.config', 'config')
      .leftJoinAndSelect('config.question', 'question')
      .where('chart.id = 2')
      .execute();
    legends = config_query.map(function (element) {
      return element.question_Text;
    });

    let count = respondant.length;

    let xAxisDataOptions = {
      1: [
        400000, 425000, 450000, 475000, 500000, 525000, 550000, 575000, 600000,
        625000, 650000,
      ],
      2: [
        335000, 355000, 375000, 395000, 415000, 435000, 455000, 475000, 495000,
        515000, 535000,
      ],
      3: [
        335000, 355000, 375000, 395000, 415000, 435000, 455000, 475000, 495000,
        515000, 535000,
      ],
      4: [
        310000, 330000, 350000, 370000, 390000, 410000, 430000, 450000, 470000,
        490000, 510000,
      ],
      default: [
        310000, 330000, 335000, 350000, 355000, 370000, 375000, 390000, 395000,
        400000, 410000, 415000, 425000, 430000, 435000, 450000, 455000, 470000,
        475000, 490000, 495000, 500000, 510000, 515000, 525000, 535000, 550000,
        575000, 600000, 625000, 650000,
      ],
    };

    let xAxisData = xAxisDataOptions[filter1] || xAxisDataOptions.default;

    res.xAxisData = xAxisData;

    let query2 = this.RespondantRepository.createQueryBuilder('respondant')
      .leftJoinAndSelect('respondant.answers', 'tooCheapVal')
      .leftJoin(`tooCheapVal.option`, `optionTooCheap`)
      .leftJoinAndSelect('respondant.answers', 'cheapVal')
      .leftJoin(`cheapVal.option`, `optionCheap`)
      .leftJoinAndSelect('respondant.answers', 'expensiveVal')
      .leftJoin(`expensiveVal.option`, `optionExpensive`)
      .leftJoinAndSelect('respondant.answers', 'tooExpensiveVal')
      .leftJoin(`tooExpensiveVal.option`, `optionTooExpensive`)
      .leftJoin('respondant.answers', 'cheap')
      .leftJoinAndSelect('cheap.option', 'optionCheapAcceptance')
      .leftJoin('respondant.answers', 'expensive')
      .leftJoinAndSelect('expensive.option', 'optionExpensiveAcceptance')
      .where('optionCheapAcceptance.questionId IS NOT null')
      .andWhere('optionExpensiveAcceptance.questionId IS NOT null')
      .andWhere('optionTooCheap.questionId = :optionTooCheapId', {
        optionTooCheapId: options[0].question_id,
      })
      .andWhere('optionCheap.questionId = :optionCheapId', {
        optionCheapId: options[1].question_id,
      })
      .andWhere('optionExpensive.questionId = :optionExpensiveId', {
        optionExpensiveId: options[2].question_id,
      })
      .andWhere('optionTooExpensive.questionId = :optionTooExpensiveId', {
        optionTooExpensiveId: options[3].question_id,
      })
      .andWhere('optionCheapAcceptance.questionId = :optionCheapAcceptanceId', {
        optionCheapAcceptanceId: options[4].question_id,
      })
      .andWhere(
        'optionExpensiveAcceptance.questionId = :optionExpensiveAcceptanceId',
        { optionExpensiveAcceptanceId: options[5].question_id },
      )
      .andWhere('respondant.id IN (:...respondantIds)', {
        respondantIds: respondant,
      });

    let data_calc1 = await query2.getRawMany();

    let pivot_table = [];

    const calculateOptValue = (value) => {
      switch (parseFloat(value)) {
        case 0.3:
          return 0.5;
        case 0.5:
          return 0.7;
        case 0.7:
          return 0.9;
        default:
          return parseFloat(value);
      }
    };

    for (let c in data_calc1) {
      let optcheap = calculateOptValue(
        data_calc1[c].optionCheapAcceptance_value,
      );
      let optExpsv = calculateOptValue(
        data_calc1[c].optionExpensiveAcceptance_value,
      );

      pivot_table.push({
        tooCheapVal: data_calc1[c].tooCheapVal_value * (1 + multiplier / 4),
        cheapVal: data_calc1[c].cheapVal_value * (1 + multiplier / 4),
        expensiveVal: data_calc1[c].expensiveVal_value * (1 + multiplier / 4),
        tooExpensiveVal:
          data_calc1[c].tooExpensiveVal_value * (1 + multiplier / 4),
        tooCheap: optcheap,
        cheap: optcheap,
        expensive: optExpsv,
        tooExpensive: optExpsv,
      });
    }

    function calculateSum(xValue, pivot) {
      if (xValue < parseInt(pivot.tooCheapVal)) {
        return parseFloat(pivot.cheap);
      }

      if (xValue >= pivot.tooCheapVal && xValue <= pivot.cheapVal) {
        let p1p2 =
          (xValue - pivot.tooCheapVal) / (pivot.cheapVal - pivot.tooCheapVal);
        return pivot.tooCheap * (1 - p1p2) + pivot.cheap * p1p2;
      }

      if (xValue > pivot.cheapVal && xValue <= pivot.expensiveVal) {
        let p2p3 =
          (xValue - pivot.cheapVal) / (pivot.expensiveVal - pivot.cheapVal);
        return pivot.cheap * (1 - p2p3) + pivot.expensive * p2p3;
      }

      if (xValue > pivot.expensiveVal && xValue <= pivot.tooExpensiveVal) {
        let p3p4 =
          (xValue - pivot.expensiveVal) /
          (pivot.tooExpensiveVal - pivot.expensiveVal);
        return pivot.expensive * (1 - p3p4) + pivot.tooExpensive * p3p4;
      }

      return 0;
    }

    let result_temp = [];
    for (let val of xAxisData) {
      let suma = 0;
      for (let pivot of pivot_table) {
        suma += calculateSum(val, pivot);
      }
      result_temp.push(suma / count);
    }
    res.series.data = result_temp;

    return res;
  }

  async multiLineChart(temp, size, options): Promise<any> {
    let res = {};
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

    if (parseInt(temp.find((element) => element.filter == 1).selected[0]) == 1)
      multiplier =
        pref1[
          parseInt(temp.find((element) => element.filter == 6).selected[0]) - 1
        ][
          parseInt(temp.find((element) => element.filter == 2).selected[0]) - 1
        ];
    if (parseInt(temp.find((element) => element.filter == 1).selected[0]) == 2)
      multiplier =
        pref2[
          parseInt(temp.find((element) => element.filter == 6).selected[0]) - 1
        ][
          parseInt(temp.find((element) => element.filter == 2).selected[0]) - 1
        ];
    if (parseInt(temp.find((element) => element.filter == 1).selected[0]) == 3)
      multiplier =
        pref3[
          parseInt(temp.find((element) => element.filter == 6).selected[0]) - 1
        ][
          parseInt(temp.find((element) => element.filter == 2).selected[0]) - 1
        ];
    if (parseInt(temp.find((element) => element.filter == 1).selected[0]) == 4)
      multiplier =
        pref4[
          parseInt(temp.find((element) => element.filter == 6).selected[0]) - 1
        ][
          parseInt(temp.find((element) => element.filter == 2).selected[0]) - 1
        ];

    let legends = [];

    let config_query = await this.ChartRepository.createQueryBuilder('chart')
      .leftJoinAndSelect('chart.config', 'config')
      .leftJoinAndSelect('config.question', 'question')
      .where('chart.id = 1')
      .andWhere(
        'question.id IN (' +
          options
            .map(function (element) {
              return element.question_id;
            })
            .join(',') +
          ')',
      )
      .execute();

    legends = config_query.map(function (element) {
      return element.question_Text;
    });
    let seriesData = [];

    let xAxisData = [
      310000, 330000, 335000, 350000, 355000, 370000, 375000, 390000, 395000,
      400000, 410000, 415000, 425000, 430000, 435000, 450000, 455000, 470000,
      475000, 490000, 495000, 500000, 510000, 515000, 525000, 535000, 550000,
      575000, 600000, 625000, 650000,
    ];
    if (temp.find((element) => element.filter == 1).selected[0] == 1) {
      xAxisData = [
        400000, 410000, 415000, 425000, 430000, 435000, 450000, 455000, 470000,
        475000, 490000, 495000, 500000, 510000, 515000, 525000, 535000, 550000,
        575000, 600000, 625000, 650000,
      ];
    } else if (
      temp.find((element) => element.filter == 1).selected[0] == 2 ||
      temp.find((element) => element.filter == 1).selected[0] == 3
    ) {
      xAxisData = [
        335000, 350000, 355000, 370000, 375000, 390000, 395000, 400000, 410000,
        415000, 425000, 430000, 435000, 450000, 455000, 470000, 475000, 490000,
        495000, 500000, 510000, 515000, 525000, 535000,
      ];
    } else if (temp.find((element) => element.filter == 1).selected[0] == 4) {
      xAxisData = [
        310000, 330000, 335000, 350000, 355000, 370000, 375000, 390000, 395000,
        400000, 410000, 415000, 425000, 430000, 435000, 450000, 455000, 470000,
        475000, 490000, 495000, 500000, 510000,
      ];
    }
    //Perfect!
    let max_value = xAxisData.length - 1;
    let baseQuery = this.AnswerRepository.createQueryBuilder('answer')
      .leftJoin(`answer.option`, `option`)
      .leftJoin(`option.question`, `question`)
      .leftJoin(`answer.respondant`, `respondant`)
      .where(`respondant.id IN (${size.join(',')})`);

    for (let conf in config_query) {
      let results = [];
      let promises = [];

      for (let val in xAxisData) {
        let query = baseQuery
          .clone()
          .andWhere(`question.id = ${config_query[conf].question_id}`)
          .andWhere(
            `CASE WHEN CAST("answer"."value" AS integer) * (${
              multiplier / 4
            } + 1) > ${xAxisData[max_value]} THEN CAST(${
              xAxisData[max_value]
            } AS integer) ELSE CAST(answer.value AS integer) * (${
              multiplier / 4
            } + 1) END ${config_query[conf].config_condition}= ${
              xAxisData[val]
            }; `,
          );

        promises.push(query.getCount());
      }

      let counts = await Promise.all(promises);
      results = counts.map((count) => Math.round((count / size.length) * 100));
      seriesData.push(results);
    }

    let premium_query = this.RespondantRepository.createQueryBuilder(
      'respondant',
    )
      .select(`AVG(CAST(answer.value AS int))`)
      .leftJoin(`respondant.answers`, `answer`)
      .leftJoin(`answer.option`, `option`)
      .leftJoin(`option.question`, `question`)
      .where(`respondant.id IN (${size.join(',')})`)
      .andWhere(`question.id = ${options[8].question_id}`);

    function getLower() {
      for (let val in xAxisData) {
        if (seriesData[0][val] <= seriesData[2][val]) {
          return xAxisData[val];
        }
      }
      return xAxisData[0];
    }
    function getUpper() {
      for (let val in xAxisData) {
        if (seriesData[1][val] <= seriesData[3][val]) {
          return xAxisData[val];
        }
      }
      return xAxisData[xAxisData.length - 1];
    }
    function getOptimal() {
      for (let val in xAxisData) {
        if (seriesData[0][val] <= seriesData[3][val]) {
          return xAxisData[val];
        }
      }
      return xAxisData[0];
    }
    let p =
      (parseFloat((await premium_query.getRawOne()).avg) +
        parseFloat((await premium_query.getRawOne()).avg) * (1 + multiplier)) /
      2;
    res = {
      legends: legends,
      xAxisData: xAxisData,
      seriesData: seriesData,
      kpi: {
        lower: getLower(),
        upper: getUpper(),
        optimal: getOptimal(),
        premium: p,
      },
    };

    return res;
  }
}
