import { Module } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { ExcelHelperProvider } from './excel.helper.provider';

@Module({
  providers: [ExcelService, ExcelHelperProvider],
  exports: [ExcelService],
})
export class ExcelModule {}
