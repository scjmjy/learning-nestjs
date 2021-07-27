import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
    console.log('-------LOGGER2 URL-------');
    console.log(`originalUrl: ${req.originalUrl}
url: ${req.url}
path: ${req.path}
        `);

    next();
}
