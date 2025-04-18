import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.use(helmet());
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
