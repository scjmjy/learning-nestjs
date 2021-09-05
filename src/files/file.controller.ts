import {
    Controller,
    Get,
    Header,
    Post,
    Res,
    StreamableFile,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import {
    FileFieldsInterceptor,
    FileInterceptor,
    FilesInterceptor,
} from '@nestjs/platform-express';
import { FileSize } from '@/utils/file';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Response } from 'express';

@Controller('/file')
export class FileController {
    @Post('/upload')
    @UseInterceptors(
        FileInterceptor('file', {
            dest: '/tmp/learning_nestjs/uploads/single',
            limits: {
                fileSize: 10 * FileSize.MB,
            },
        }),
    )
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log('[uploadFile]', file);
    }

    @Post('/upload/array')
    @UseInterceptors(
        FilesInterceptor('files', 2, {
            dest: '/tmp/learning_nestjs/uploads/array',
            limits: {
                fileSize: 10 * FileSize.MB,
            },
        }),
    )
    uploadFileArray(@UploadedFiles() files: Express.Multer.File[]) {
        console.log('[uploadFileArray]', files);
    }

    @Post('/upload/multi')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'avatar', maxCount: 1 },
                { name: 'gallery', maxCount: 2 },
            ],
            {
                dest: '/tmp/learning_nestjs/uploads/multi',
                limits: {
                    fileSize: 10 * FileSize.MB,
                },
            },
        ),
    )
    uploadFileMulti(
        @UploadedFiles()
        files: {
            avatar?: Express.Multer.File[];
            gallery?: Express.Multer.File[];
        },
    ) {
        console.log('[uploadFileMulti]', files);
    }

    @Get('/download')
    @Header('Content-Type', 'image/jpeg')
    getFile(@Res() res: Response) {
        // const file = createReadStream(join(process.cwd(), 'package.json'));
        const file = createReadStream(
            '/tmp/learning_nestjs/uploads/multi/0e0b477dd4834d6c4ff031412af2e0f7',
        );
        file.pipe(res);
        // new StreamableFile(file).getStream().pipe(res);
    }

    @Get('/download2')
    getFile2(): StreamableFile {
        // const file = createReadStream(join(process.cwd(), 'package.json'));
        const file = createReadStream(
            '/tmp/learning_nestjs/uploads/multi/0e0b477dd4834d6c4ff031412af2e0f7',
        );
        return new StreamableFile(file);
    }
}
