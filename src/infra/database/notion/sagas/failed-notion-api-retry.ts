import { Injectable } from '@nestjs/common';
import { ICommand, Saga } from '@nestjs/cqrs';
import { Observable, catchError } from 'rxjs';
import { WorkMarkReadNotionEventHandlerError } from '../handlers/work-mark-read';
import { WorkMarkUnreadNotionEventHandlerError } from '../handlers/work-mark-unread';
import { NotionWorkRepository } from '../notion-work.repository';
import { WorkMarkFinishedNotionEventHandlerError } from '@infra/database/notion/handlers/work-marked-finished';

@Injectable()
export class FailedNotionApiRetrySaga {
  constructor(private notionWorkerRepository: NotionWorkRepository) {}

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
          await this.notionWorkerRepository.updateForNewChapter(error.originalEvent.payload.id);
        }

        if (error instanceof WorkMarkFinishedNotionEventHandlerError) {
          await this.notionWorkerRepository.moveWorkToFinishedStatus(error.originalEvent.payload.id);
        }
      }),
    );
  };
}
