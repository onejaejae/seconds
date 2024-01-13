import { NestFactory } from '@nestjs/core';
import { Modules } from './module';
import { setNestApp } from './setNest.app';

async function bootstrap() {
  const app = await NestFactory.create(Modules);

  setNestApp(app);
  await app.listen(3000);
}
bootstrap();
