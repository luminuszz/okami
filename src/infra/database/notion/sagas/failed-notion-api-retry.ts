import { Injectable, Logger } from '@nestjs/common';
import { ICommand, Saga } from '@nestjs/cqrs';
import { APIErrorCode, APIResponseError } from '@notionhq/client';
import { Observable, catchError } from 'rxjs';
import { WorkMarkReadNotionEventHandlerError } from '../handlers/work-mark-read';
import { WorkMarkUnreadNotionEventHandlerError } from '../handlers/work-mark-unread';
import { NotionWorkRepository } from '../notion-work.repository';

@Injectable()
export class FailedNotionApiRetrySaga {
  constructor(private notionWorkerRepository: NotionWorkRepository) {}

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
      catchError(async (error) => {
        if (error instanceof WorkMarkReadNotionEventHandlerError) {
          await this.notionWorkerRepository.updateForNewChapterFalse(
            error.originalEvent.payload.id,
            error.originalEvent.payload.chapter.getChapter(),
          );
        }

        if (error instanceof WorkMarkUnreadNotionEventHandlerError) {
          await this.notionWorkerRepository.updateForNewChapter(
            error.originalEvent.payload.id,
          );
        }

        return error;
      }),
    );
  };
}
