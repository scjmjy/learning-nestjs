import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import { RolesGuard } from '@/common/guards/roles.guard';
import { ParseIntPipe } from '@/common/pipes/parse-int.pipe';
import { TestPipe } from '@/common/pipes/test-pipe.pipe';
import { CreateCatDto } from './cat.dto';
import { CatsService } from './cats.service';

@UseGuards(RolesGuard)
@UsePipes(TestPipe)
@Controller('cats')
export class CatsController {
    constructor(private catsService: CatsService) {}

    @Post('find/all')
    @HttpCode(HttpStatus.OK)
    async findAll(@Body() query: any) {
        return this.catsService.findAll();
    }
    @Get('find/:id')
    findById(@Param('id', ParseIntPipe) id: number) {
        return this.catsService.findById(id);
    }

    @Post('create')
    create(@Body() createCatDto: CreateCatDto) {
        return this.catsService.create(createCatDto);
    }
}
