import { Transform } from 'class-transformer';
import { IsDate, IsNumber, IsOptional } from 'class-validator';
import * as moment from 'moment-timezone';

export class OrderListQueryDto {
  @Transform(({ value }) => moment(value).toDate())
  @IsDate()
  startDate: Date;

  @Transform(({ value }) => moment(value).toDate())
  @IsDate()
  endDate: Date;

  @IsNumber()
  orderType = 2;

  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsNumber()
  pageSize = 50;

  @IsNumber()
  pageNo = 1;
}
