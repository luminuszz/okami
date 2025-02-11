import {FetchForWorkersReadQueryHandler} from "@infra/crqs/work/queries/fetch-for-works-read";
import {FetchForWorkersUnreadQueryHandler} from "@infra/crqs/work/queries/fetch-for-works-unread";
import {FindOneWorkQueryHandler} from "@infra/crqs/work/queries/find-one-work";
import {
    FetchWorksScrapingPaginatedReportQueryHandler
} from "@infra/crqs/work/queries/fetch-for-works-scraping-report-paginated";
import {FetchUserWorksWithFilterQueryHandler} from "@infra/crqs/work/queries/fetch-user-works-with-filter.query";
import {FetchPagedTagsQueryHandler} from "@infra/crqs/work/queries/fetch-paged-tags";
import {FetchForSearchTokensByTypeQueryHandler} from "@infra/crqs/work/queries/fetch-for-search-tokens-by-type";
import {FilterTagBySearchQueryHandler} from "@infra/crqs/work/queries/filter-tag-by-search";
import {FetchFavoritesWorksQueryHandler} from "@infra/crqs/work/queries/fetch-favorites-works";
import {
    FetchUserWorksWithFilterAndPagedQueryHandler
} from "@infra/crqs/work/queries/fetch-user-works-with-filter-and-paged";
import {IQueryHandler} from "@nestjs/cqrs";


export const queryHandlers = [
    FetchForWorkersReadQueryHandler,
    FetchForWorkersUnreadQueryHandler,
    FindOneWorkQueryHandler,
    FetchWorksScrapingPaginatedReportQueryHandler,
    FetchUserWorksWithFilterQueryHandler,
    FetchPagedTagsQueryHandler,
    FetchForSearchTokensByTypeQueryHandler,
    FilterTagBySearchQueryHandler,
    FetchFavoritesWorksQueryHandler,
    FetchUserWorksWithFilterAndPagedQueryHandler,
]