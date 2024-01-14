import {
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileType } from 'src/types/common';
import { DEPENDENCY } from 'src/common/const/dependencyKey';
import { IExcelService } from './interface/excel.service.interface';

@Controller('/excel')
export class ExcelController {
  constructor(
    @Inject(DEPENDENCY.EXCEL.EXCEL_SERVICE_KEY)
    private readonly excelService: IExcelService,
  ) {}

  @Post('/save')
  @UseInterceptors(FileInterceptor('file'))
  async processAndSaveExcelData(@UploadedFile() file: FileType): Promise<void> {
    return this.excelService.processAndSaveExcelData(file);
  }
}
