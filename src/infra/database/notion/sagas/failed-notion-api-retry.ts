import { MarkWorkUnreadCommand } from '@app/modules/work/commands/mark-work-unread.command';
import { Injectable, Logger } from '@nestjs/common';
import { ICommand, Saga } from '@nestjs/cqrs';
import { APIErrorCode, APIResponseError } from '@notionhq/client';
import { Observable, catchError } from 'rxjs';
import { WorkMarkReadNotionEventHandlerError } from '../handlers/work-mark-read';
import { WorkMarkUnreadNotionEventHandlerError } from '../handlers/work-mark-unread';

@Injectable()
export class FailedNotionApiRetrySaga {
  private logger = new Logger(FailedNotionApiRetrySaga.name);

  private static isConflictError(error: unknown): error is APIResponseError {
    return (
      error instanceof APIResponseError &&
      error.code === APIErrorCode.ConflictError
    );
  }

  @Saga()
  failedNotionApiRetry = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      catchError((error) => {
        if (error instanceof WorkMarkReadNotionEventHandlerError) {
          return new MarkWorkUnreadCommand(error.originalPayload);
        }

        if (error instanceof WorkMarkUnreadNotionEventHandlerError) {
          return new MarkWorkUnreadCommand(error.originalPayload);
        }

        return error;
      }),
    );
  };
}
