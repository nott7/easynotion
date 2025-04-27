import type { TransformedPage } from "../lib/transformer";

/**
 * Options for initializing EasyNotion
 */
export interface EasyNotionOptions {
  apiKey: string;
  cacheTTL?: number; // seconds
  maxCacheEntries?: number;
}

/**
 * Response of fetching a single page
 */
export interface SinglePageResponse {
  page: TransformedPage;
  markdown: string | undefined;
}
