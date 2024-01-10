import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { ExcelModule } from './components/excel/excel.module';
import { CustomerModule } from './components/customer/customer.modul';

@Module({
  imports: [DatabaseModule.forRoot(), ExcelModule, CustomerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
