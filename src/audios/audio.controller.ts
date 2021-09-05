import { Controller, Post, Query } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job } from 'bull';

@Controller('audio')
export class AudioController {
    constructor(
        @InjectQueue('audio') private queue: Queue,
        @InjectQueue('separate') private queueSeparate: Queue,
    ) {
        queueSeparate.on('completed', (job: Job, result: any) => {
            console.log(
                `[Separate Processor Completed]-pid:${
                    process.pid
                }-${JSON.stringify(result)}`,
            );
        });
    }

    @Post('transcode')
    transcode(@Query('file') file: string) {
        return this.queue
            .add('transcode', {
                file: file,
            })
            .then((job: Job) => {
                console.log('[transcode] sending response to user');

                return {
                    jobId: job.id,
                };
            });
    }

    @Post('transcode2')
    transcodeInWorker(@Query('file') file: string) {
        // TODO separate process queue does not support named job ??
        return this.queueSeparate
            .add('', {
                file: file,
            })
            .then((job: Job) => {
                console.log('[transcode2] sending response to user');

                return {
                    jobId: job.id,
                };
            });
    }
}
