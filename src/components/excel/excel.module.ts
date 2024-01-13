import { Module } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { ExcelHelperProvider } from './excel.helper.provider';
import { OrderModule } from '../order/order.module';
import { CustomerModule } from '../customer/customer.module';
import { ExcelController } from './excel.controller';

@Module({
  imports: [OrderModule, CustomerModule],
  controllers: [ExcelController],
  providers: [ExcelService, ExcelHelperProvider],
  exports: [ExcelService],
})
export class ExcelModule {}
