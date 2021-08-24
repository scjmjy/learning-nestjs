import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { UserModule } from './users/user.module';
import { LoggerMiddleware } from './cats/logger.middleware';
import { logger } from './cats/logger2.middleware';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            useFactory(cfgService: ConfigService) {
                return {
                    type: 'postgres',
                    // type: cfgService.get('DB_TYPE') as any,
                    host: cfgService.get('DB_HOST', 'localhost'),
                    port: cfgService.get('DB_PORT', 5432),
                    username: cfgService.get('DB_USERNAME', 'postgres'),
                    password: cfgService.get('DB_PASSWORD', 'postgres'),
                    database: cfgService.get('DB_DATABASE', 'learning_nestjs'),
                    entities: [],
                    synchronize: true,
                    autoLoadEntities: true,
                };
            },
            inject: [ConfigService],
        }),
        // TypeOrmModule.forRoot({
        //     type: 'postgres',
        //     host: 'localhost',
        //     port: 5432,
        //     username: 'postgres',
        //     password: 'postgres',
        //     database: 'learning_nestjs',
        //     synchronize: true,
        //     autoLoadEntities: true,
        // }),
        UserModule,
        CatsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('cats');
        consumer.apply(logger).forRoutes('cats');
    }
}
