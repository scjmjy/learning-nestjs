import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { AudioController } from './audio.controller';
import { AudioProcessor } from './audio.processor';
import { join } from 'path';

@Module({
    imports: [
        BullModule.registerQueue(
            {
                name: 'audio',
            },
            {
                name: 'separate',
                processors: [
                    join(__dirname, 'processor'),
                    // {
                    //     concurrency: 2,
                    //     path: join(__dirname, 'processor'),
                    // },
                ],
            },
        ),
    ],
    controllers: [AudioController],
    providers: [AudioProcessor],
})
export class AudioModule {}
