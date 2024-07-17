import { Controller, Post, Body, UseGuards, Inject, Get } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { RespondantService } from '../service/respondant.service';
import { AnswerService } from '../service/answer.service';
import { OptionService } from '../service/option.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

function generateCacheKey(data) {
  return data
    .map((item) => {
      const sorted = Object.keys(item)
        .sort()
        .reduce((obj, key) => {
          obj[key] = item[key];
          return obj;
        }, {});
      return JSON.stringify(sorted);
    })
    .join('|');
}

@Controller('apply')
export class ApplyController {
  constructor(
    private readonly findService: RespondantService,
    private readonly dataService: AnswerService,
    private readonly optionService: OptionService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('cache-keys')
  async getCacheKeys(): Promise<any> {
    const keys = await this.cacheManager.get('cache-keys');
    return keys;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async applyfiltes(@Body() request: any): Promise<any> {
    let selected = request.selected;
    console.log('selected', selected);
    const cacheKey = generateCacheKey(selected);
    console.log('cachekey', cacheKey);
    const cacheData = await this.cacheManager.get(cacheKey);
    if (cacheData) {
      console.log('cacheData return', cacheData);
      return cacheData;
    } else {
      console.log('no cache');
      try {
        selected.forEach((f) => {
          if (f.filter == 2) {
            f.selected.forEach((s, i) => {
              console.log(s);
              switch (s) {
                case '2':
                  f.selected[i] = '3';
                  break;
                case '3':
                  f.selected[i] = '2';
                  break;
                default:
                  break;
              }
            });
          }
        });
        let options = await this.optionService.getOptions(selected);
        let respondant = (
          await this.findService.getCount(selected, options)
        ).map((item) => item.respondant_id);

        let result = {
          last_update: '2024-03-15',
          // , title: request.title
          // , id: request.id
          size: respondant.length,
          multiLineChart: await this.dataService.multiLineChart(
            selected,
            respondant,
            options,
          ),
          lineChart: await this.dataService.lineChart(
            selected,
            respondant,
            options,
          ),
          barChart: await this.dataService.barChart(
            selected,
            respondant,
            options,
          ),
          profiling: await this.dataService.profile(
            selected,
            respondant,
            options,
          ),
          selected: request.selected,
          status: 'success',
        };

        await this.cacheManager.set(cacheKey, result);

        // Get the current list of cache keys
        let cacheKeys =
          ((await this.cacheManager.get('cache-keys')) as string[]) || [];
        // Add the new cache key to the list
        cacheKeys.push(cacheKey);
        // Store the updated list of cache keys
        await this.cacheManager.set('cache-keys', cacheKeys);
        return result;
      } catch (e) {
        console.log(e);
        return { status: 'error', message: 'Error applying filters.' };
      }
    }
  }
}
