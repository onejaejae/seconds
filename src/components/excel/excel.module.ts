import { ClassProvider, Module } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { ExcelHelperProvider } from './excel.helper.provider';
import { OrderModule } from '../order/order.module';
import { CustomerModule } from '../customer/customer.module';
import { ExcelController } from './excel.controller';
import { DEPENDENCY } from 'src/common/const/dependencyKey';

const excelService: ClassProvider = {
  provide: DEPENDENCY.EXCEL.EXCEL_SERVICE_KEY,
  useClass: ExcelService,
};

@Module({
  imports: [OrderModule, CustomerModule],
  controllers: [ExcelController],
  providers: [excelService, ExcelHelperProvider],
  exports: [excelService],
})
export class ExcelModule {}
