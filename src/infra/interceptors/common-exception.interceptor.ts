import { BadRequestException, CallHandler, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { WorkNotFoundError } from '@domain/work/application/usecases/errors/work-not-found';
import { UserNotFound } from '@domain/auth/application/errors/UserNotFound';
import { UserAlreadyExists } from '@domain/auth/application/errors/UserAlreadyExists';
import { InvalidCodeKey } from '@domain/auth/application/errors/InvalidCodeKey';
import { InvalidWorkOperationError } from '@domain/work/application/usecases/errors/invalid-work-operation';

@Injectable()
export class CommonExceptionInterceptor implements NestInterceptor {
  intercept(_, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
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

        if (err instanceof InvalidCodeKey) {
          throw new BadRequestException(err.message);
        }

        if (err instanceof InvalidWorkOperationError) {
          throw new BadRequestException(err.message);
        }

        throw err;
      }),
    );
  }
}
