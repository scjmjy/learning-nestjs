import {
    Connection,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent,
} from 'typeorm';
import { CatEntity } from './cat.entity';

@EventSubscriber()
export class CatSubscriber implements EntitySubscriberInterface {
    constructor(conn: Connection) {
        conn.subscribers.push(this);
    }

    listenTo() {
        return CatEntity;
    }

    beforeInsert(event: InsertEvent<CatEntity>) {
        console.log('[DB] Cat-beforeInsert:', event.entity);
    }

    async beforeUpdate(event: UpdateEvent<CatEntity>) {
        console.log('[DB] Cat-beforeUpdate:', event.entity);
    }
}
