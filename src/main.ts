import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as compression from 'compression';
import * as CookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import { AppModule } from './app.module';
import { session_secret, store } from './session';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );

    app.use(CookieParser());

    app.set('trust proxy', 1); // trust first proxy
    app.use(
        session({
            store: store,
            secret: session_secret,
            resave: false,
            saveUninitialized: false,
        }),
    );

    app.use(compression());

    app.useStaticAssets('public', {});
    app.setBaseViewsDir('src/views');
    app.setViewEngine('hbs');

    await app.listen(3000);
}
bootstrap();
