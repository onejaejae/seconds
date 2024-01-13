import { Injectable } from '@nestjs/common';
import { SheetType } from 'src/types/excel';
import * as moment from 'moment-timezone';
import { Customer } from '../customer/entity/customer.entity';
import { Order } from '../order/entity/order.entity';
import { FileType } from 'src/types/common';
import { ExcelHelperProvider } from './excel.helper.provider';

@Injectable()
export class ExcelService {
  constructor(private readonly excelHelperProvider: ExcelHelperProvider) {}

  private jsonToEntity(
    sheetName: SheetType,
    json: Array<any>,
  ): Array<Customer | Order> {
    const result = [];
    switch (sheetName) {
      case SheetType.CUSTOMER:
        for (const row of json) {
          const values = Object.keys(row).map((key) => row[key]);
          const [customerId, name, grade] = values;
          result.push(new Customer(customerId, name, grade));
        }
        break;

      case SheetType.ORDER:
        for (const row of json) {
          const values = Object.keys(row).map((key) => row[key]);
          const [customerId, orderedAt, orderType, amount] = values;
          result.push(
            new Order(
              customerId,
              this.abjustTime(orderedAt),
              orderType,
              amount,
            ),
          );
        }
        break;
      default:
        break;
    }
    return result;
  }

  private abjustTime(orderedAt: Date) {
    const utcDate = moment.utc(orderedAt);
    const adjustedDate = utcDate.set({
      hour: 15,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    return adjustedDate.toDate();
  }

  excelToEntity(file: FileType) {
    const workbook = this.excelHelperProvider.createWorkbook(file);

    return workbook.SheetNames.map((sheetName: SheetType) => {
      const sheet = workbook.Sheets[sheetName];
      const json = this.excelHelperProvider.excelToJson(sheet);
      return this.jsonToEntity(sheetName, json);
    });
  }
}
