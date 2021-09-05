import { RoleEntity } from '@/auth/role/entities/role.entity';
import { CatEntity } from '@/cats/cat.entity';
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    ManyToMany,
    JoinTable,
    OneToMany,
    RelationId,
} from 'typeorm';

@Entity()
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    // @IsEmail()
    @Column({ default: '' })
    email: string;

    @Exclude()
    @Column({ default: '' })
    password: string;

    @Column({ default: '' })
    firstName: string;

    @Column({ default: '' })
    lastName: string;

    @ManyToMany(() => RoleEntity, (role) => role.users)
    @JoinTable()
    roles: RoleEntity[];

    @Column('int', { array: true, default: [] })
    @RelationId('roles')
    roleIds: number[];

    @OneToMany(() => CatEntity, (cat) => cat.user, {
        cascade: true,
    })
    cats: CatEntity[];

    @Column('int', { array: true, default: [] })
    @RelationId('cats')
    catIds: number[];

    @Exclude()
    @Column({ default: true })
    isActive: boolean;
}
