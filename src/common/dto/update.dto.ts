import { IsNumber, IsNumberString } from 'class-validator';

export class BaseUpdateDto {
    @IsNumber()
    id: number;
}
