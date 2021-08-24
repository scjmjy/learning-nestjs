import { Cat } from './cat.interface';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

describe('CatsController', () => {
    let catsController: CatsController;
    let catsService: CatsService;

    beforeEach(() => {
        catsService = new CatsService();
        catsController = new CatsController(catsService);
    });

    describe('findAll', () => {
        it('should return an array of cats', async () => {
            const result: Cat[] = [
                {
                    name: 'miaomiao',
                    color: 'red',
                },
            ];
            const spy = jest.spyOn(catsService, 'findAll');
            spy.mockImplementation(() => result);

            expect(await catsController.findAll({})).toBe(result);
        });
    });
});
