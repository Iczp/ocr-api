import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AllowAnonymous } from './guards/allowAnonymousKey.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('App')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('version')
  @AllowAnonymous()
  @ApiOperation({
    summary: '版本信息',
    description: '返回 package.json 版本号',
  })
  getVersion(): string {
    return this.appService.getVersion();
  }
}
