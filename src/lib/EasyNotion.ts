import type {
  DatabaseObjectResponse,
  GetDatabaseResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { NotionClientWrapper } from "./notionClient";
import { transformPage, type TransformedPage } from "./transformer";
import { CacheManager } from "./cacheManager";
import type {
  EasyNotionOptions,
  SinglePageResponse,
} from "@/types/easyNotionTypes";

/**
 * EasyNotion is a wrapper for the Notion API that provides a simple interface
 * for retrieving pages and databases from Notion.
 *
 * @example
 * const notion = new EasyNotion({ apiKey: process.env.NOTION_API_KEY });
 * const database = await notion.getDatabase("databaseId");
 *
 * @example
 * const notion = new EasyNotion({ apiKey: process.env.NOTION_API_KEY });
 * const database = await notion.getDatabaseItems("databaseId");
 *
 * @example
 * const notion = new EasyNotion({ apiKey: process.env.NOTION_API_KEY });
 * const database = await notion.getDatabasePaginatedItems("databaseId", 0, 1);
 *
 * @example
 * const notion = new EasyNotion({ apiKey: process.env.NOTION_API_KEY });
 * const page = await notion.getSinglePage("pageId");
 *
 */

export class EasyNotion {
  private notionClient: NotionClientWrapper;
  private cache: CacheManager;

  /**
   * Create a new EasyNotion instance.
   *
   * @param apiKey - The Notion API key
   * @param cacheTTL - The TTL for the cache in seconds
   * @param maxCacheEntries - The maximum number of entries in the cache
   */

  constructor(options: EasyNotionOptions) {
    const { apiKey, cacheTTL = 3600, maxCacheEntries = 500 } = options;
    if (!apiKey) {
      throw new Error(
        "No Notion API key provided. Please set the apiKey option."
      );
    }
    this.notionClient = new NotionClientWrapper({ apiKey });
    this.cache = new CacheManager({
      ttlSeconds: cacheTTL,
      maxEntries: maxCacheEntries,
    });
  }

  /**
   * Get a database from Notion.
   *
   * @param databaseId - The ID of the database to retrieve
   * @returns Database
   */

  async getDatabase(databaseId: string): Promise<GetDatabaseResponse> {
    const cacheKey = `database-${databaseId}`;
    const cachedDatabase = this.cache.get(cacheKey);
    if (cachedDatabase) return cachedDatabase;

    const database = await this.notionClient.notion.databases.retrieve({
      database_id: databaseId,
    });
    this.cache.set(cacheKey, database);
    return database;
  }

  /**
   * Get database items from Notion.
   *
   * @param databaseId - The ID of the database to retrieve
   * @returns Database items
   */

  async getDatabaseItems(databaseId: string): Promise<TransformedPage[]> {
    const cacheKey = `database-items-${databaseId}`;
    const cachedDatabaseItems = this.cache.get(cacheKey);
    if (cachedDatabaseItems) return cachedDatabaseItems;

    const databaseItems = await this.notionClient.notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          timestamp: "created_time",
          direction: "descending",
        },
      ],
    });

    const transformedDatabaseItems = databaseItems.results.map((item) => {
      return transformPage(item as PageObjectResponse);
    });

    this.cache.set(cacheKey, transformedDatabaseItems);

    return transformedDatabaseItems;
  }

  /**
   * Get all items from a database from Notion, paginated.
   *
   * @param databaseId - The ID of the database to retrieve
   * @param pageNumber - The page number to retrieve
   * @param pageSize - The number of items to retrieve per page
   * @returns Paginated database items
   */

  // TODO:
  // - NotionHQ doesn't support filtering by page number, only by start_cursor
  // - I want to be able to use the page number, because it's more user friendly
  // - I've to probably have to make a request for each page, and return the
  //   correct page
  // - Or to fetch all items, and then return the correct page

  async getDatabasePaginatedItems(
    databaseId: string,
    pageNumber: number,
    pageSize: number
  ) {
    const databaseItems = await this.notionClient.notion.databases.query({
      database_id: databaseId,
      page_size: pageSize,
    });
    return databaseItems;
  }

  /**
   * Get a single page from Notion.
   *
   * @param pageId - The ID of the page to retrieve
   * @returns Page
   */

  async getSinglePage(pageId: string): Promise<SinglePageResponse> {
    const cacheKey = `page-${pageId}`;
    const cachedPage = this.cache.get(cacheKey);
    if (cachedPage) return cachedPage;

    let page, markdown;

    const response = await this.notionClient.notion.pages.retrieve({
      page_id: pageId,
    });

    if (!response) {
      throw "No results available";
    }

    const mdBlocks = await this.notionClient.n2m.pageToMarkdown(pageId);
    markdown = this.notionClient.n2m.toMarkdownString(mdBlocks).parent;
    page = transformPage(response as PageObjectResponse);

    this.cache.set(cacheKey, {
      page,
      markdown,
    });

    return {
      page,
      markdown,
    };
  }
}
