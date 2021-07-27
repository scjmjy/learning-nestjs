import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cat } from './cat.interface';

@Injectable()
export class CatsService {
    private readonly cats: Cat[] = [];
    findAll(query): Cat[] {
        return this.cats;
    }

    /**
     *
     * @param id
     * @returns
     *
     * @throws {RangeError}
     */
    findById(id: number): Cat {
        if (id >= this.cats.length) {
            // throw new Error('Out of Range');
            throw new HttpException('Out of Range', HttpStatus.OK);
        }
        return this.cats[id];
    }

    /**
     *
     * @param cat
     * @returns id of new created Cat
     */
    create(cat: Cat): number {
        this.cats.push(cat);
        return this.cats.length - 1;
    }
}
