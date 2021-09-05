import { UserEntity } from '@/users/user.entity';
import { Controller, Get, Render, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, interval, map, fromEvent } from 'rxjs';

@Controller('/sse')
export class SseController {
    constructor(private eventEmitter: EventEmitter2) {}
    @Get()
    @Render('sse')
    index() {
        return { title: 'Server-Send Events' };
    }
    @Sse('msg')
    sse(): Observable<Partial<MessageEvent<UserEntity>>> {
        const ob = new Observable((sub) => {
            this.eventEmitter.on('user.create', (val) => {
                sub.next(val);
            });
            this.eventEmitter.on('user.read', (val) => {
                sub.next(val);
            });
            this.eventEmitter.on('system.error', (err) => {
                sub.error(err);
            });
            this.eventEmitter.on('system.shutdown', () => {
                sub.complete();
            });
        });
        return ob.pipe(
            map((createdUser: UserEntity) => ({
                data: createdUser,
            })),
        );
        // return interval(1000).pipe(
        //     map((index) => ({ data: index + ' times' })),
        // );
    }
}
