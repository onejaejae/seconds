import { Injectable } from '@nestjs/common';
import { FileType } from 'src/types/common';
import * as XLSX from 'xlsx';
import { IExcelHelperProvider } from './interface/excel.helper.provider.interface';

@Injectable()
export class ExcelHelperProvider implements IExcelHelperProvider {
  private readonly xlsx: typeof XLSX;

  constructor() {
    this.xlsx = XLSX;
  }

  createWorkbook(file: FileType) {
    return this.xlsx.read(file.buffer, {
      type: 'buffer',
      cellDates: true,
    });
  }

  excelToJson(sheet: XLSX.WorkSheet) {
    return XLSX.utils.sheet_to_json(sheet, { defval: null });
  }
}
