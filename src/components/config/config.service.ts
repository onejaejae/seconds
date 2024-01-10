import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configurations, DBConfig } from '.';

@Injectable()
export class SecondConfigService {
  constructor(private readonly configService: ConfigService<Configurations>) {}

  getDBConfig(): DBConfig {
    return this.configService.getOrThrow('DB');
  }
}
