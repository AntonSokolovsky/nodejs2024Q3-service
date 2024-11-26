import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingService } from './modules/logging/logging.service';
import { HttpExceptionFilter } from './modules/logging/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const logger = app.get(LoggingService);
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.useLogger(logger);

  process.on('uncaughtException', (error: Error) => {
    console.error('Uncaught Exception:', error);
  });

  process.on('unhandledRejection', (reason: any) => {
    console.error('Unhandled Rejection:', reason);
  });

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home Library Service API description')
    .setVersion('1.0')
    .addTag('Users')
    .addTag('Albums')
    .addTag('Artists')
    .addTag('Favorites')
    .addTag('Tracks')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, documentFactory());

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
