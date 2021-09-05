import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleSubscriber } from './role.subscriber';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { RoleEntity } from './entities/role.entity';

@Module({
    // imports: [TypeOrmModule.forFeature([RoleEntity])],
    controllers: [RoleController],
    providers: [RoleService, RoleSubscriber],
    // exports: [TypeOrmModule],
})
export class RoleModule {}
