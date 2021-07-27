import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log('-------LOGGER URL-------');
        console.log(`originalUrl: ${req.originalUrl}
url: ${req.url}
path: ${req.path}
        `);

        next();
    }
}
