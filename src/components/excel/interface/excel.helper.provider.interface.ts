import { FileType } from 'src/types/common';
import * as XLSX from 'xlsx';

export interface IExcelHelperProvider {
  createWorkbook(file: FileType): XLSX.WorkBook;
  excelToJson(sheet: XLSX.WorkSheet);
}
