import { Injectable } from '@nestjs/common';
import { SheetType } from 'src/types/excel';
import * as XLSX from 'xlsx';
import * as moment from 'moment-timezone';
import { Customer } from '../customer/entity/customer.entity';
import { Order } from '../order/entity/order.entity';
import { FileType } from 'src/types/common';

@Injectable()
export class ExcelService {
  private readonly xlsx: typeof XLSX;

  constructor() {
    this.xlsx = XLSX;
  }

  private jsonToEntity(sheetName: SheetType, rows: Array<any>) {
    const result = [];
    switch (sheetName) {
      case SheetType.CUSTOMER:
        for (const row of rows) {
          const values = Object.keys(row).map((key) => row[key]);
          const [customerId, name, grade] = values;
          result.push(new Customer(customerId, name, grade));
        }
        break;

      case SheetType.ORDER:
        for (const row of rows) {
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

  private excelToJson(sheet: XLSX.WorkSheet) {
    return XLSX.utils.sheet_to_json(sheet, { defval: null });
  }

  excelToEntity(file: FileType) {
    const workbook = XLSX.read(file.buffer, {
      type: 'buffer',
      cellDates: true,
    });

    return workbook.SheetNames.map((sheetName: SheetType) => {
      const sheet = workbook.Sheets[sheetName];
      const rows = this.excelToJson(sheet);
      return this.jsonToEntity(sheetName, rows);
    });
  }
}
