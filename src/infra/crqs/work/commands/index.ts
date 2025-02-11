import {CreateWorkHandler} from "@infra/crqs/work/commands/create-work.command";
import {MarkWorkReadCommandHandler} from "@infra/crqs/work/commands/mark-work-read.command";
import {MarkWorkUnreadCommandHandler} from "@infra/crqs/work/commands/mark-work-unread.command";
import {UpdateWorkChapterCommandHandler} from "@infra/crqs/work/commands/update-work-chapter.command";
import {UpdateWorkCommandHandler} from "@infra/crqs/work/commands/update-work.command";
import {MarkWorkFinishedCommandHandler} from "@infra/crqs/work/commands/mark-work-finished.command";
import {UploadWorkImageCommandHandler} from "@infra/crqs/work/commands/upload-work-image.command";
import {UpdateWorkRefreshStatusCommandHandler} from "@infra/crqs/work/commands/update-work-refresh-status.command";
import {MarkWorkAsDroppedCommandHandler} from "@infra/crqs/work/commands/mark-work-as-dropped.command";
import {DeleteWorkCommandHandler} from "@infra/crqs/work/commands/delete-work.command";
import {CreateTagCommandHandler} from "@infra/crqs/work/commands/create-tag.command";
import {CreateSearchTokenCommandHandler} from "@infra/crqs/work/commands/create-search-token.command";
import {CreateManySearchTokensCommandHandler} from "@infra/crqs/work/commands/create-many-search-tokens.command";
import {DeleteSearchTokenCommandHandler} from "@infra/crqs/work/commands/delete-search-token.command";
import {UpdateTagCommandHandler} from "@infra/crqs/work/commands/update-tag-command";
import {DeleteTagCommandHandler} from "@infra/crqs/work/commands/delete-tag.command";
import {ToggleFavoriteCommandHandler} from "@infra/crqs/work/commands/toggle-favorite.command";
import {
    GenerateWorkImageUploadUrlCommandHandler
} from "@infra/crqs/work/commands/generate-work-image-upload-url.command";

export const commandHandlers = [
    CreateWorkHandler,
    MarkWorkReadCommandHandler,
    MarkWorkUnreadCommandHandler,
    UpdateWorkChapterCommandHandler,
    UpdateWorkCommandHandler,
    MarkWorkFinishedCommandHandler,
    UploadWorkImageCommandHandler,
    UpdateWorkRefreshStatusCommandHandler,
    MarkWorkAsDroppedCommandHandler,
    DeleteWorkCommandHandler,
    CreateTagCommandHandler,
    CreateSearchTokenCommandHandler,
    CreateManySearchTokensCommandHandler,
    DeleteSearchTokenCommandHandler,
    UpdateTagCommandHandler,
    DeleteTagCommandHandler,
    ToggleFavoriteCommandHandler,
    GenerateWorkImageUploadUrlCommandHandler,
]
