import { UserEntity } from '@/users/user.entity';
import { Exclude } from 'class-transformer';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    ManyToMany,
    RelationId,
    JoinTable,
} from 'typeorm';

@Entity()
export class RoleEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => UserEntity, (user) => user.roles)
    users: UserEntity[];

    @Column('int', { array: true, default: [] })
    @RelationId('users')
    userIds: number[];

    @Exclude()
    @Column({ default: true })
    isActive: boolean;
}
