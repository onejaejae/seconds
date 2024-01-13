import { Module } from '@nestjs/common';
import { DatabaseModule } from './common/database/database.module';
import { ExcelModule } from './components/excel/excel.module';
import { CustomerModule } from './components/customer/customer.module';
import { OrderModule } from './components/order/order.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorInterceptor } from './common/interceptor/error.interceptor';

@Module({
  imports: [DatabaseModule.forRoot(), ExcelModule, CustomerModule, OrderModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
  ],
})
export class Modules {}
