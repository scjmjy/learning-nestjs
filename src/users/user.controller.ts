/*
https://docs.nestjs.com/controllers#controllers
*/

import {
    Body,
    CacheInterceptor,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseArrayPipe,
    ParseIntPipe,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common';
import { CreateOneUserDto } from './createOne.dto';
import { FindOneParams } from './findOne.validator';
import { UpdateOneUserDto } from './updateOne.dto';
import type { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
@UseInterceptors(CacheInterceptor)
export class UserController {
    constructor(private service: UserService) {}
    @Post('createOne')
    async createOne(@Body() user: CreateOneUserDto): Promise<number> {
        const savedUser = await this.service.createOne(user);
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
        return ok;
    }

    @Get('find/ids')
    async findManyByIds(
        @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
        ids: number[],
    ): Promise<User[]> {
        console.log('[UserController]-findManyByIds:', ids);
        const foundUsers = await this.service.findManyByIds(ids);
        return foundUsers;
    }

    @Get('find/:id')
    async findOne(@Param() params: FindOneParams): Promise<User> {
        console.log('[UserController]-findOne:', params.id);
        const foundUser = await this.service.findOne(params.id);
        return foundUser;
    }
    @Get('find2/:id')
    async findOne2(@Param('id', ParseIntPipe) id: number): Promise<User> {
        const foundUser = await this.service.findOne(id);
        return foundUser;
    }
}
