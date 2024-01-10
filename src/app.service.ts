import { Injectable } from '@nestjs/common';
import { FileType } from './types/common';
import { ExcelService } from './components/excel/excel.service';

@Injectable()
export class AppService {
  constructor(private readonly excelService: ExcelService) {}

  getHello(file: FileType): any {
    const test = this.excelService.excelToEntity(file);
    console.log('test', test);
  }
}
