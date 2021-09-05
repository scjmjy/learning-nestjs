import {
    Connection,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './user.entity';
import { CatEntity } from '@/cats/cat.entity';
import { RoleEntity } from '@/auth/role/entities/role.entity';

// async function hashUserPassword(user: UserEntity) {
//     const { password } = user;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     user.password = hashedPassword;
// }

function hashPassword(password: string) {
    return bcrypt.hashSync(password, 10);
}
@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface {
    constructor(conn: Connection) {
        conn.subscribers.push(this);
    }

    listenTo() {
        return UserEntity;
    }

    beforeInsert(event: InsertEvent<UserEntity>) {
        console.log('[DB] User-beforeInsert:', event.entity);
        event.entity.password = hashPassword(event.entity.password);
    }

    async beforeUpdate(event: UpdateEvent<UserEntity>) {
        console.log('[DB] User-beforeUpdate:', event.entity);
        const { entity, databaseEntity } = event;
        const { catIds, roleIds, password } = entity;
        if (entity.save) {
            let doSave = false;
            if (Array.isArray(catIds)) {
                doSave = true;
                entity.cats = catIds.map((id) => {
                    const c = new CatEntity();
                    c.id = id;
                    return c;
                });
            }
            if (Array.isArray(roleIds)) {
                doSave = true;
                entity.roles = roleIds.map((id) => {
                    const r = new RoleEntity();
                    r.id = id;
                    return r;
                });
            }
            if (doSave) {
                await entity.save({ listeners: false }).catch();
            }
        }

        if (password && password !== databaseEntity.password) {
            entity.password = hashPassword(password);
        }
    }
}
