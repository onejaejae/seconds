import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ExcelService } from './excel.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileType } from 'src/types/common';

@Controller('/excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Post('/save')
  @UseInterceptors(FileInterceptor('file'))
  async processAndSaveExcelData(@UploadedFile() file: FileType): Promise<void> {
    return this.excelService.processAndSaveExcelData(file);
  }
}
