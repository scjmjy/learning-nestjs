import { Module, CacheInterceptor, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpModule } from '@nestjs/axios';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserSubscriber } from './user.subscriber';
import { RoleEntity } from '@/auth/role/entities/role.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, RoleEntity]),
        CacheModule.register(),
        HttpModule,
    ],
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
