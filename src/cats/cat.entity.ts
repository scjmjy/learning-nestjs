import { UserEntity } from '@/users/user.entity';
import { Exclude } from 'class-transformer';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    ManyToOne,
    RelationId,
} from 'typeorm';

@Entity()
export class CatEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '' })
    name: string;

    @Column({ default: '' })
    color: string;

    @ManyToOne(() => UserEntity, (user) => user.cats, {})
    user: UserEntity;

    @Column({ nullable: true })
    @RelationId('user')
    userId: number;

    @Exclude()
    @Column({ default: true })
    isActive: boolean;
}
