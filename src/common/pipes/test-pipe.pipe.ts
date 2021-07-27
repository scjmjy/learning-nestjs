import {
    BadRequestException,
    PipeTransform,
    Injectable,
    ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class TestPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata) {
        console.log('----TestPipe---');
        console.log(value);
        console.log(metadata);

        return value;
    }
}
