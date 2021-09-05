import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RoleService {
    create(createRoleDto: CreateRoleDto) {
        const role = new RoleEntity();
        Object.assign(role, createRoleDto);
        return role.save();
    }

    findAll() {
        return RoleEntity.find();
        // return `This action returns all role`;
    }

    findOne(id: number) {
        return RoleEntity.findOne(id);
        // return `This action returns a #${id} role`;
    }

    async update(id: number, updateRoleDto: UpdateRoleDto) {
        const role = await RoleEntity.findOne(id);
        if (role) {
            Object.assign(role, updateRoleDto);
            return role.save();
        }
        return false;
        // return `This action updates a #${id} role`;
    }

    remove(id: number) {
        return RoleEntity.delete(id);
        // return `This action removes a #${id} role`;
    }
}
