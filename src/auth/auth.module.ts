import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RoleModule } from './role/role.module';
import { RoleSubscriber } from './role/role.subscriber';

@Module({
    imports: [RoleModule],
    providers: [AuthService, RoleSubscriber],
    exports: [RoleModule],
})
export class AuthModule {}
