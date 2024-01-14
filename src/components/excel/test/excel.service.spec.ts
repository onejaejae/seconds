import { type MockProxy, mock } from 'jest-mock-extended';
import { ICustomerRepository } from 'src/components/customer/interface/customer.repository.interface';
import { IExcelService } from '../interface/excel.service.interface';
import { ExcelService } from '../excel.service';
import { IExcelHelperProvider } from '../interface/excel.helper.provider.interface';
import { IOrderRepository } from 'src/components/order/interface/order.repository.interface';
import * as XLSX from 'xlsx';
import { FileType } from 'src/types/common';

describe('excel service', () => {
  let orderRepository: MockProxy<IOrderRepository>;
  let customerRepository: MockProxy<ICustomerRepository>;
  let excelHelperProvider: MockProxy<IExcelHelperProvider>;
  let service: IExcelService;

  beforeAll(async () => {
    orderRepository = mock<IOrderRepository>();
    customerRepository = mock<ICustomerRepository>();
    excelHelperProvider = mock<IExcelHelperProvider>();
    service = new ExcelService(
      excelHelperProvider,
      customerRepository,
      orderRepository,
    );
  });

  describe('processAndSaveExcelData', () => {
    it('should save customer entities', async () => {
      // given
      const mockJson = [
        {
          고객Id: 73,
          주문일자: new Date(),
          주문타입: 'order',
          주문금액: 384000,
        },
      ];
      const mockWorkbook: XLSX.WorkBook = {
        SheetNames: ['order'],
        Sheets: {},
      };
      excelHelperProvider.createWorkbook.mockReturnValue(mockWorkbook);
      excelHelperProvider.excelToJson.mockReturnValue(mockJson);

      // when
      await service.processAndSaveExcelData({} as FileType);

      // then
      expect(excelHelperProvider.createWorkbook).toHaveBeenCalled();
      expect(excelHelperProvider.excelToJson).toHaveBeenCalled();
      expect(customerRepository.bulkInsert).not.toHaveBeenCalled();
      expect(orderRepository.bulkInsert).toHaveBeenCalledWith([
        expect.objectContaining({
          customerId: 73,
          orderedAt: expect.any(Date),
          orderType: 'order',
          amount: 384000,
        }),
      ]);
    });
  });
});
