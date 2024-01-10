import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configurations } from './configuration';
import { SecondConfigService } from './config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`dotenv/.env.${process.env.NODE_ENV}`],
      load: [configurations],
    }),
  ],
  providers: [SecondConfigService],
  exports: [SecondConfigService],
})
export class SecondConfigModule {}
