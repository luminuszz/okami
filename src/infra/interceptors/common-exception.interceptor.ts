import { InvalidCodeKey } from '@domain/auth/application/errors/InvalidCodeKey';
import { UserAlreadyExists } from '@domain/auth/application/errors/UserAlreadyExists';
import { UserNotFound } from '@domain/auth/application/errors/UserNotFound';
import { InvalidWorkOperationError } from '@domain/work/application/usecases/errors/invalid-work-operation';
import { WorkNotFoundError } from '@domain/work/application/usecases/errors/work-not-found';
import { BadRequestException, CallHandler, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { SentryService } from '../logs/sentry/sentry.service';

@Injectable()
export class CommonExceptionInterceptor implements NestInterceptor {
  constructor(private readonly sentryService: SentryService) {}

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

        this.sentryService.captureException(err);

        throw err;
      }),
    );
  }
}
