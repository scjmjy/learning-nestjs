/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateOneUserDto } from './createOne.dto';
import { UpdateOneUserDto } from './updateOne.dto';
import { UserEntity } from './user.entity';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {
    constructor(
        private conn: Connection,
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
        private httpService: HttpService,
    ) {}

    async createOne(user: CreateOneUserDto) {
        // return this.conn.getRepository(User).save(user);
        return this.userRepo.save(user);
    }

    async createMany(users: CreateOneUserDto[]) {
        return this.userRepo.save(users);
        // await this.conn.transaction(async (manager) => {
        //     await manager.save(users[0]);
        //     await manager.save(users[1]);
        // });
        // const queryRunner = this.conn.createQueryRunner();

        // await queryRunner.connect();
        // await queryRunner.startTransaction();

        // try {
        //     await queryRunner.manager.save(users[0]);
        //     await queryRunner.manager.save(users[1]);
        //     await queryRunner.commitTransaction();
        // } catch (err) {
        //     await queryRunner.rollbackTransaction();
        // } finally {
        //     await queryRunner.release();
        // }
    }

    async updateOne(user: UpdateOneUserDto) {
        const dbUser = await this.userRepo.findOne(user.id);
        if (dbUser) {
            await this.userRepo.save(user);
            return true;
        }
        return false;
    }
    // findAll(): Promise<User[]> {
    //     return this.userRepo.find();
    // }

    findOne(id: string | number): Promise<UserEntity> {
        // return this.conn.getRepository(User).findOne(id);
        return this.userRepo.findOne(id);
    }

    findOneHttp(id: string | number): Observable<AxiosResponse<UserEntity>> {
        // return this.conn.getRepository(User).findOne(id);
        // return this.userRepo.findOne(id);
        return this.httpService.get('http://localhost:3000/user/find/' + id);
    }

    findManyByIds(ids: (string | number)[]): Promise<UserEntity[]> {
        return this.userRepo.findByIds(ids);
    }

    // async delete(id: string): Promise<void> {
    //     await this.userRepo.delete(id);
    // }
}
