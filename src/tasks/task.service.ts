import { Injectable, Logger } from '@nestjs/common';
import {
    Cron,
    CronExpression,
    SchedulerRegistry,
    Timeout,
} from '@nestjs/schedule';

@Injectable()
export class TaskService {
    private readonly logger = new Logger(TaskService.name);

    constructor(private scheduler: SchedulerRegistry) {}

    @Cron(CronExpression.EVERY_10_SECONDS, {
        name: 'MyInterval',
    })
    handleCron() {
        this.logger.debug('MyInterval: Called everty 10 seconds.');
    }

    @Timeout(30000)
    timeout() {
        this.scheduler.deleteCronJob('MyInterval');
        this.logger.debug('Deleted MyInterval');
    }
}
