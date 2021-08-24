import {
    Connection,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent,
} from 'typeorm';
import { User } from './user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface {
    constructor(conn: Connection) {
        conn.subscribers.push(this);
    }

    listenTo() {
        return User;
    }

    beforeInsert(event: InsertEvent<User>) {
        console.log('[DB]-User-beforeInsert:', event.entity);
    }

    beforeUpdate(event: UpdateEvent<User>) {
        console.log('[DB]-User-beforeUpdate:', event.entity);
    }
}
