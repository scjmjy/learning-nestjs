import { Module, CacheInterceptor, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserSubscriber } from './user.subscriber';

@Module({
    imports: [TypeOrmModule.forFeature([User]), CacheModule.register()],
    controllers: [UserController],
    providers: [
        UserService,
        UserSubscriber,

        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        },
    ],
    exports: [TypeOrmModule],
})
export class UserModule {}
