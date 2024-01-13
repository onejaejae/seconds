import { NestFactory, Reflector } from '@nestjs/core';
import { Modules } from './module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { TypeORMExceptionFilter } from './common/filter/typeorm.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(Modules);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new TypeORMExceptionFilter());
  await app.listen(3000);
}
bootstrap();
