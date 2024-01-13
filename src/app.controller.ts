import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileType } from './types/common';
import { OrderListDto } from './components/order/dto/request/order.list.dto';
import { OrderListResponseDto } from './components/order/dto/response/order.list.response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async getHello(@UploadedFile() file: FileType): Promise<string> {
    return await this.appService.getHello(file);
  }

  @Post('/test')
  async getHello3(
    @Body() orderListDto: OrderListDto,
  ): Promise<Array<OrderListResponseDto>> {
    return this.appService.getHello3(orderListDto);
  }

  @Get()
  async getHello2(): Promise<any> {
    return await this.appService.getHello2();
  }
}
