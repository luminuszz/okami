import { UseCaseError } from '@core/entities/use-case-error';
import { InvalidOperation } from '@core/errors/invalid-operation';
import { InvalidCodeKey } from '@domain/auth/application/errors/InvalidCodeKey';
import { UserAlreadyExists } from '@domain/auth/application/errors/UserAlreadyExists';
import { UserNotFound } from '@domain/auth/application/errors/UserNotFound';
import { InvalidWorkOperationError } from '@domain/work/application/usecases/errors/invalid-work-operation';
import { WorkNotFoundError } from '@domain/work/application/usecases/errors/work-not-found';
import { BadRequestException, CallHandler, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { ZodError } from 'zod';
import { SentryService } from '../logs/sentry/sentry.service';

@Injectable()
export class CommonExceptionInterceptor implements NestInterceptor {
  constructor(private readonly sentryService: SentryService) { }

  private isZodError(error: any): error is ZodError {
    return (
      (error as ZodError).issues !== undefined && (error as ZodError).issues.length > 0 && error?.name == 'ZodError'
    );
  }

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

        if (this.isZodError(err)) {
          throw new BadRequestException({
            message: 'Validation error',
            errors: err.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
          });
        }

        if (err instanceof UseCaseError) {
          throw new BadRequestException(err.message);
        }

        if (err instanceof InvalidOperation) {
          throw new BadRequestException(err.message);
        }

        this.sentryService.captureException(err);

        throw err;
      }),
    );
  }
}
