import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { parseCorsWhitelist } from './common/utils/parse-cors-whitelist';
import { RequestContextInterceptor } from './request-context/request-context.interceptor';
import { RequestIdInterceptor } from './request-context/request-id.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  const corsWhiteList = parseCorsWhitelist(process.env.CORS_WHITELIST ?? '');

  app.enableCors({
    origin: (
      origin: string | undefined, // Isso é do navegador e para proteger o cliente
      callback: (...args: any[]) => void,
    ) => {
      // Requisição sem origin ou que inclui uma origem conhecida
      // por corsWhiteList é permitida
      if (!origin || corsWhiteList.includes(origin)) {
        return callback(null, true); // Permitido
      }

      // Requisições com origin mas que não conhecemos
      // negamos.
      return callback(new Error('Not allowed by CORS'), false);
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const port = Number(process.env.PORT ?? process.env.APP_PORT ?? 3000);

  const requestContextInterceptor = app.get(RequestContextInterceptor);
  const requestIdInterceptor = app.get(RequestIdInterceptor);

  app.useGlobalInterceptors(requestIdInterceptor, requestContextInterceptor);

  // Swagger

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('The Blog API')
    .setDescription('The blog API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on port ${port}`);
}
void bootstrap();
