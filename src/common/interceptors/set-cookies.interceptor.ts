import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Cookie {
    name: string;
    value: string;
    httpOnly?: boolean;
}

@Injectable()
export class SetCookiesInterceptor implements NestInterceptor {
    constructor(private cookies: Cookie[]) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const res = context.switchToHttp().getResponse<Response>();
        return next.handle().pipe(
            tap(() => {
                for (const cookie of this.cookies) {
                    res.cookie(cookie.name, cookie.value, {
                        httpOnly: cookie.httpOnly,
                    });
                }
            }),
        );
    }
}
