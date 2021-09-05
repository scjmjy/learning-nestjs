import {
    Connection,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent,
} from 'typeorm';
import { RoleEntity } from './entities/role.entity';
import { UserEntity } from '@/users/user.entity';

@EventSubscriber()
export class RoleSubscriber implements EntitySubscriberInterface {
    constructor(conn: Connection) {
        conn.subscribers.push(this);
    }

    listenTo() {
        return RoleEntity;
    }

    beforeInsert(event: InsertEvent<RoleEntity>) {
        console.log('[DB] Role-beforeInsert:', event.entity);
    }

    async beforeUpdate(event: UpdateEvent<RoleEntity>) {
        console.log('[DB] Role-beforeUpdate:', event.entity);
        const { entity } = event;
        const { userIds } = entity;
        if (entity.save && Array.isArray(userIds)) {
            entity.users = userIds.map((id) => {
                const u = new UserEntity();
                u.id = id;
                return u;
            });
            await entity.save({ listeners: false });
        }
    }
}
