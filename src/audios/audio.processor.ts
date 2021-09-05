import { Logger } from '@nestjs/common';
import {
    Process,
    Processor,
    OnQueueActive,
    OnQueueProgress,
    OnQueueCompleted,
} from '@nestjs/bull';
import { Job } from 'bull';

@Processor('audio')
export class AudioProcessor {
    private readonly logger = new Logger(AudioProcessor.name);

    @OnQueueActive()
    onQueueActive(job: Job) {
        this.logger.debug(
            `onQueueActive, job id: ${job.id}, name: ${job.name}`,
        );
    }

    @OnQueueProgress()
    onQueueProgress(job: Job) {
        this.logger.debug(
            `onQueueProgress, job id: ${job.id}, name: ${
                job.name
            }, progress: ${job.progress()}`,
        );
    }

    @OnQueueCompleted()
    onQueueCompleted(job: Job, result: any) {
        this.logger.debug(
            `onQueueCompleted, job id: ${job.id}, name: ${job.name}, result: ${result}`,
        );
    }

    @Process('transcode')
    async handleTranscode(job: Job) {
        this.logger.debug('Starting transcoding for:', job.data.file);
        for (let index = 0; index < 10; index++) {
            await job.progress(index);
        }
        // this.logger.debug('Transcoding completed');
        return {
            size: 1000,
        };
    }
}
