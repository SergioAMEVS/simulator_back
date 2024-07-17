import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceService {}

@Injectable()
export class YourService {
  async getJsonObject(): Promise<any> {
    let temp = [{filter:1, selected: [1,2,3,4]}, {filter:2, selected: [5,6,7,8]}];

    let result: [[string|number, string|number, string]];
    result = [['Count', 'Value','Type']];
    result.push([1,10,'A']);
    result.push([2,6,'A']);
    result.push([3,4,'A']);
    result.push([4,3,'A']);
    result.push([1,4,'B']);
    result.push([2,6,'B']);
    result.push([3,8,'B']);
    result.push([4,9,'B']);
    return result;
  }
}