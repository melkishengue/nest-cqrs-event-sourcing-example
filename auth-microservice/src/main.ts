import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  
  app.listen(4000, () => console.log('Application is listening on port 4000.'));
}

bootstrap();
