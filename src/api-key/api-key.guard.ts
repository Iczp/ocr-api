import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    console.log('request.query', request.query['api-key']);
    console.log('request.params', request.params);
    const apiKey = request.headers['x-api-key'] || request.query['api-key']; // 从请求头中获取 API Key
    const validApiKey = this.configService.get<string>('API_KEY'); // 从环境变量中获取有效的 API Key

    if (apiKey && apiKey === validApiKey) {
      return true;
    } else {
      throw new UnauthorizedException(`Invalid API key: ${apiKey}`);
    }
  }
}
