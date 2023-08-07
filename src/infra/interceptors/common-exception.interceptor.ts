import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { WorkNotFoundError } from '@domain/work/application/usecases/errors/work-not-found';
import { UserNotFound } from '@domain/auth/application/errors/UserNotFound';
import { UserAlreadyExists } from '@domain/auth/application/errors/UserAlreadyExists';

@Injectable()
export class CommonExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof WorkNotFoundError) {
          throw new BadRequestException(err.message);
        }

        if (err instanceof UserNotFound) {
          throw new BadRequestException(err.message);
        }

        if (err instanceof UserAlreadyExists) {
          throw new BadRequestException(err.message);
        }

        throw err;
      }),
    );
  }
}
