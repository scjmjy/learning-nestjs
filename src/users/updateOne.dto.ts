import { BaseUpdateDto } from '@/common/dto/update.dto';
import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateOneUserDto } from './createOne.dto';

export class UpdateOneUserDto extends IntersectionType(
    BaseUpdateDto,
    PartialType(CreateOneUserDto),
) {}
