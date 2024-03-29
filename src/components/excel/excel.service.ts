import { Inject, Injectable } from '@nestjs/common';
import { SheetType } from 'src/types/excel';
import * as moment from 'moment-timezone';
import { Customer } from '../customer/entity/customer.entity';
import { Order } from '../order/entity/order.entity';
import { FileType } from 'src/types/common';
import { Transactional } from 'src/common/decorator/transaction.decorator';
import { DEPENDENCY } from 'src/common/const/dependencyKey';
import { IOrderRepository } from '../order/interface/order.repository.interface';
import { ICustomerRepository } from '../customer/interface/customer.repository.interface';
import { IExcelService } from './interface/excel.service.interface';
import { IExcelHelperProvider } from './interface/excel.helper.provider.interface';

@Injectable()
export class ExcelService implements IExcelService {
  constructor(
    @Inject(DEPENDENCY.EXCEL.EXCEL_HELPER_PROVIDER_KEY)
    private readonly excelHelperProvider: IExcelHelperProvider,
    @Inject(DEPENDENCY.CUSTOMER.CUSTOMER_REPOSITORY_KEY)
    private readonly customerRepository: ICustomerRepository,
    @Inject(DEPENDENCY.ORDER.ORDER_REPOSITORY_KEY)
    private readonly orderRepository: IOrderRepository,
  ) {}

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

  private excelToEntity(file: FileType) {
    const workbook = this.excelHelperProvider.createWorkbook(file);

    return workbook.SheetNames.map((sheetName: SheetType) => {
      const sheet = workbook.Sheets[sheetName];
      const json = this.excelHelperProvider.excelToJson(sheet);

      return this.jsonToEntity(sheetName, json);
    });
  }

  @Transactional()
  async processAndSaveExcelData(file: FileType): Promise<void> {
    const allEntities = this.excelToEntity(file);

    for (const targetEntities of allEntities) {
      const targetEntity = targetEntities[0];
      if (targetEntity instanceof Customer) {
        const customerEntities = targetEntities as Customer[];
        await this.customerRepository.bulkInsert(customerEntities);
      } else if (targetEntity instanceof Order) {
        const orderEntities = targetEntities as Order[];
        await this.orderRepository.bulkInsert(orderEntities);
      }
    }
  }
}
