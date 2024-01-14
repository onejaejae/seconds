import { FileType } from 'src/types/common';

export interface IExcelService {
  processAndSaveExcelData(file: FileType): Promise<void>;
}
