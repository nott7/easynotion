# EasyNotion

A simple TypeScript wrapper for the Notion API, designed to make fetching databases and pages easier, with built-in caching.

## ✨ Features

*   Fetch Notion database metadata.
*   Fetch all items (pages) from a database.
*   Fetch a single page and its content converted to Markdown.
*   Built-in LRU caching for improved performance.
*   Type-safe, built with TypeScript.

## 🚀 Installation

```bash
npm install easynotion
# or
yarn add easynotion
# or
bun add easynotion
```

## 💡 Usage

First, you need to get your Notion API key (Integration Token). You can find instructions [here](https://developers.notion.com/docs/getting-started#step-1-create-an-integration).

```typescript
import { EasyNotion } from 'easynotion';

// Initialize the client with your API key
const notion = new EasyNotion({
  apiKey: process.env.NOTION_API_KEY, // Recommended to use environment variables
  // Optional caching options (defaults shown)
  // cacheTTL: 3600, // Cache time-to-live in seconds (1 hour)
  // maxCacheEntries: 500 // Maximum number of items in cache
});

// --- Examples ---

// Get Database Metadata
async function getDbInfo(databaseId: string) {
  try {
    const dbInfo = await notion.getDatabase(databaseId);
    console.log('Database Info:', dbInfo);
    return dbInfo;
  } catch (error) {
    console.error('Error fetching database info:', error);
  }
}

// Get All Items (Pages) from a Database
async function getAllDbItems(databaseId: string) {
  try {
    // Returns transformed pages with simplified properties
    const items = await notion.getDatabaseItems(databaseId);
    console.log(`Fetched ${items.length} items from database ${databaseId}`);
    items.forEach(item => {
      console.log(`- Page ID: ${item.id}, Title: ${item.title}`);
      // Access other transformed properties as needed
      // console.log(item.properties);
    });
    return items;
  } catch (error) {
    console.error('Error fetching database items:', error);
  }
}

// Get a Single Page with Markdown Content
async function getPageContent(pageId: string) {
  try {
    const { page, markdown } = await notion.getSinglePage(pageId);
    console.log('Page Details:', page);
    console.log('--- Markdown Content ---');
    console.log(markdown);
    console.log('--- End Markdown ---');
    return { page, markdown };
  } catch (error) {
    console.error('Error fetching page:', error);
  }
}

```

## 📚 API

### `EasyNotion(options: EasyNotionOptions)`

*   `options.apiKey`: Your Notion integration token (required).
*   `options.cacheTTL`: Cache time-to-live in seconds (optional, default: 3600).
*   `options.maxCacheEntries`: Maximum number of entries in the cache (optional, default: 500).

### `async getDatabase(databaseId: string): Promise<GetDatabaseResponse>`

Retrieves the metadata for a specific database.

### `async getDatabaseItems(databaseId: string): Promise<TransformedPage[]>`

Retrieves all pages from a database, transforming them into a simpler `TransformedPage` structure.

### `async getSinglePage(pageId: string): Promise<SinglePageResponse>`

Retrieves a single page (`TransformedPage`) and its content converted to a Markdown string.

### `async getDatabasePaginatedItems(databaseId: string, pageNumber: number, pageSize: number)`

*(Note: This method is currently under development )*

## 🛠️ Development

*   **Clone the repository:** `git clone https://github.com/nott7/easynotion`
*   **Install dependencies:** `npm install` (or `bun install`)
*   **Build:** `npm run build`
*   **Run tests:** `npm run test`
*   **Run tests in watch mode:** `npm run test:watch`
*   **Lint:** `npm run lint`
*   **Check test coverage:** `npm run coverage`

## 🙌 Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## 📄 License

[MIT](./LICENSE)
