import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TypeORMExceptionFilter } from './common/filter/typeorm.exception.filter';

export function setNestApp<T extends INestApplication>(app: T): void {
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new TypeORMExceptionFilter());
}
