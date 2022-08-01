import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // protects all routes with a jwt token
  // In a real app better implemented in an API gateway which provides
  // authentication, authorization, routing, api composition, etc...
  app.useGlobalGuards(new JwtAuthGuard());
  app.listen(3000, () => console.log('Application is listening on port 3000.'));
}

bootstrap();
