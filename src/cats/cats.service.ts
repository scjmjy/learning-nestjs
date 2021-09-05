import { Injectable } from '@nestjs/common';
import { CreateCatDto } from './cat.dto';
import { CatEntity } from './cat.entity';

@Injectable()
export class CatsService {
    findAll() {
        return CatEntity.find();
    }

    /**
     *
     * @param id
     * @returns
     *
     */
    findById(id: number) {
        return CatEntity.findOne(id);
    }

    /**
     *
     * @param cat
     * @returns new created Cat
     */
    create(cat: CreateCatDto) {
        const newCat = new CatEntity();
        Object.assign(newCat, cat);
        return newCat.save();
    }
}
