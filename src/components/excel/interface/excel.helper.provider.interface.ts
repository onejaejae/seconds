import { FileType } from 'src/types/common';

export interface IExcelHelperProvider {
  createWorkbook(file: FileType);
  excelToJson(sheet: any);
}
