import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';
import AdminJS from 'adminjs';
import { AdminModule } from '@adminjs/nestjs';
import { Database, Resource } from '@adminjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { UserModule } from './users/user.module';
import { LoggerMiddleware } from './cats/logger.middleware';
import { logger } from './cats/logger2.middleware';
import { TaskModule } from './tasks/task.module';
import { AudioModule } from './audios/audio.module';
import { FileModule } from './files/file.module';
import { UserEntity } from './users/user.entity';
import { SseModule } from './sse/sse.module';
import { RoleEntity } from './auth/role/entities/role.entity';
import { CatEntity } from './cats/cat.entity';
import { session_secret, store } from './session';
import { RoleSubscriber } from './auth/role/role.subscriber';

AdminJS.registerAdapter({
    Database,
    Resource,
});

const adminGroup = {
    name: '用户管理',
    icon: 'UserAdmin',
};

const resourceGroup = {
    name: '资源管理',
    icon: 'GroupResource',
};
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
        ScheduleModule.forRoot(),
        TaskModule,
        BullModule.forRoot({
            redis: {
                host: '127.0.0.1',
                port: 6379,
            },
        }),
        EventEmitterModule.forRoot(),
        AdminModule.createAdmin({
            adminJsOptions: {
                rootPath: '/admin',
                resources: [
                    {
                        resource: UserEntity,
                        options: {
                            navigation: adminGroup,
                            properties: {
                                catIds: {
                                    isArray: true,
                                    reference: 'CatEntity',
                                },
                                roleIds: {
                                    isArray: true,
                                    reference: 'RoleEntity',
                                },
                                isActive: {
                                    isVisible: false,
                                },
                            },
                            actions: {
                                list: {
                                    async before(request, context) {
                                        return request;
                                    },
                                    // after(originalResponse, request, context) {
                                    //     // console.log(
                                    //     //     '[list after]',
                                    //     //     originalResponse,
                                    //     //     request,
                                    //     //     context,
                                    //     // );
                                    //     return originalResponse;
                                    // },
                                },
                                myNewAction: {
                                    actionType: 'record',
                                    hander(...args) {
                                        console.log(...args);
                                    },
                                },
                            },
                        },
                    },
                    {
                        resource: RoleEntity,
                        options: {
                            navigation: adminGroup,
                            properties: {
                                userIds: {
                                    isArray: true,
                                    reference: 'UserEntity',
                                },
                            },
                        },
                    },
                    {
                        resource: CatEntity,
                        options: {
                            navigation: resourceGroup,
                            properties: {
                                // user: {
                                //     reference: 'UserEntity',
                                // },
                            },
                            actions: {
                                list: {},
                                // new: {
                                //     isAccessible: ({ currentAdmin }) =>
                                //         currentAdmin &&
                                //         currentAdmin.roles.includes('admin'),
                                // },
                            },
                        },
                    },
                ],
                locale: {
                    language: 'en',
                    translations: {
                        labels: {
                            UserEntity: '用户列表',
                            RoleEntity: '角色列表',
                            CatEntity: '猫',
                        },
                        properties: {
                            catIds: '我的猫',
                        },
                        actions: {
                            new: '新建',
                            // filter: '过滤',
                        },
                    },
                },
                branding: {
                    companyName: 'Learning NestJS',
                },
            },
            auth: {
                authenticate: async (email, password) => {
                    const user = await UserEntity.findOne({
                        where: { email: email },
                        relations: ['roles'],
                    });
                    if (user) {
                        const matched = await bcrypt.compare(
                            password,
                            user.password,
                        );
                        if (matched) {
                            return user;
                        }
                    }
                    return false as any;
                },
                cookieName: 'AdminBroAuth',
                cookiePassword: '123456',
            },
            sessionOptions: {
                secret: session_secret,
                store: store,
                resave: false,
                saveUninitialized: false,
            },
        }),

        UserModule,
        CatsModule,
        AudioModule,
        FileModule,
        SseModule,
    ],
    controllers: [AppController],
    providers: [AppService, RoleSubscriber],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('cats');
        consumer.apply(logger).forRoutes('cats');
    }
}
