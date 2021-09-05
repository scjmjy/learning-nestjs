/*
https://docs.nestjs.com/controllers#controllers
*/

import { Cookies } from '@/common/decorators/cookies.decorator';
import { SetCookiesInterceptor } from '@/common/interceptors/set-cookies.interceptor';
import {
    CACHE_MANAGER,
    Body,
    Session,
    CacheInterceptor,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    ParseArrayPipe,
    ParseIntPipe,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';
import { CreateOneUserDto } from './createOne.dto';
import { FindOneParams } from './findOne.validator';
import { UpdateOneUserDto } from './updateOne.dto';
import type { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
@UseInterceptors(CacheInterceptor)
export class UserController {
    constructor(
        private service: UserService,
        @Inject(CACHE_MANAGER) private cache: Cache,
        private eventEmitter: EventEmitter2,
    ) {}
    @Post('createOne')
    async createOne(
        @Body() user: CreateOneUserDto,
        @Session() session: Record<string, any>,
    ): Promise<number> {
        session.createCount = session.createCount ? session.createCount + 1 : 1;
        const savedUser = await this.service.createOne(user);
        this.eventEmitter.emit('user.create', savedUser);
        return savedUser.id;
    }
    @Post('createMany')
    async createMany(@Body() users: CreateOneUserDto[]): Promise<number[]> {
        const savedUsers = await this.service.createMany(users);
        return savedUsers.map((user) => user.id);
    }

    @Post('updateOne')
    async updateOne(@Body() user: UpdateOneUserDto): Promise<boolean> {
        const ok = await this.service.updateOne(user);
        this.cache.del('/user/find/' + user.id);
        return ok;
    }

    @Get('find/ids')
    async findManyByIds(
        @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
        ids: number[],
    ): Promise<UserEntity[]> {
        console.log('[UserController]-findManyByIds:', ids);
        const foundUsers = await this.service.findManyByIds(ids);
        return foundUsers;
    }

    @Get('find/:id')
    async findOne(
        @Param() params: FindOneParams,
        @Session() session: Record<string, any>,
    ): Promise<UserEntity> {
        session.findCount = session.findCount ? session.findCount + 1 : 1;
        console.log('[UserController]-findOne:', params.id);
        const foundUser = await this.service.findOne(params.id);
        this.eventEmitter.emit('user.read', foundUser);
        return foundUser;
    }

    @Get('findHttp/:id')
    async findOneHttp(@Param() params: FindOneParams): Promise<UserEntity> {
        console.log('[UserController]-findOneHttp:', params.id);
        return new Promise<UserEntity>((resolve, reject) => {
            const foundUser = this.service.findOneHttp(params.id);
            foundUser.subscribe({
                next: (val) => {
                    resolve(val.data);
                },
                error: (err) => {
                    reject(err);
                },
            });
        });
    }
    @Get('find2/:id')
    async findOne2(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
        const foundUser = await this.service.findOne(id);
        return foundUser;
    }
    @Get('find3')
    async findOne3(
        @Cookies('userIdToFind', ParseIntPipe) id: number,
    ): Promise<UserEntity> {
        const foundUser = await this.service.findOne(id);
        return foundUser;
    }

    @Get('test-set-cookie')
    @UseInterceptors(
        new SetCookiesInterceptor([
            { name: 'test-cookie-1', value: '11', httpOnly: true },
            { name: 'test-cookie-2', value: '22', httpOnly: true },
        ]),
    )
    textSetCookie() {
        return 'Hello';
    }

    // listeners
    @OnEvent('user.create')
    onUserCreate(user: UserEntity) {
        console.log('[onUserCreate]', user);
    }
}
