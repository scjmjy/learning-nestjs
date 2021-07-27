import {
    BadRequestException,
    PipeTransform,
    Injectable,
    ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string> {
    async transform(value: string, metadata: ArgumentMetadata) {
        console.log('-------ParseIntPipe--------');
        console.log(value);
        console.log(metadata);
        const val = parseInt(value, 10);
        if (isNaN(val)) {
            throw new BadRequestException('Validation failed');
        }
        return val;
    }
}
