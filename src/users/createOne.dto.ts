import { IsNotEmpty } from 'class-validator';

export class CreateOneUserDto {
    @IsNotEmpty()
    firstName: string;

    lastName: string;
}
