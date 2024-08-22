import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AllowAnonymous } from './guards/allowAnonymousKey.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppInfo } from './dtos/AppInfo';

@Controller()
@ApiTags('App')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('about')
  @AllowAnonymous()
  @ApiOperation({
    summary: '关于 App 信息',
    description: '返回 AppInfo',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully.',
    type: AppInfo,
  })
  getAbout() {
    return this.appService.getAppInfo();
  }
}
