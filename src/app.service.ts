import { Injectable } from '@nestjs/common';
import { FileType } from './types/common';
import { ExcelService } from './components/excel/excel.service';
import { CustomerRepository } from './components/customer/repository/customer.repository';

@Injectable()
export class AppService {
  constructor(
    private readonly excelService: ExcelService,
    private readonly customerRepository: CustomerRepository,
  ) {}

  async getHello(file: FileType): Promise<any> {
    const test = this.excelService.excelToEntity(file);
    // console.log('test', test);

    console.log(test[0][0]);
    return this.customerRepository.createEntity(test[0][0]);
  }
}
