import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { WorkNotFoundError } from '@domain/work/application/usecases/errors/work-not-found';
import { UserNotFound } from '@domain/auth/application/errors/UserNotFound';
import { UserAlreadyExists } from '@domain/auth/application/errors/UserAlreadyExists';

@Injectable()
export class CommonExceptionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CommonExceptionInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next
      .handle()
      .pipe(
        tap((value) => {
          this.logger.debug(`value: ${JSON.stringify(value)}`);
        }),
      )
      .pipe(
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
