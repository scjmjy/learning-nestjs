import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatEntity } from './cat.entity';
import { CatSubscriber } from './cat.subscriber';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
    imports: [TypeOrmModule.forFeature([CatEntity])],
    controllers: [CatsController],
    providers: [CatsService, CatSubscriber],
})
export class CatsModule {}
