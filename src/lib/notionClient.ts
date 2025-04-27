import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

interface NotionClientOptions {
  apiKey: string;
}

export class NotionClientWrapper {
  private client: Client;
  private n2mClient: NotionToMarkdown;

  constructor({ apiKey }: NotionClientOptions) {
    if (!apiKey) {
      throw new Error(
        "No Notion API key provided. Please set the apiKey option."
      );
    }
    this.client = new Client({ auth: apiKey });
    this.n2mClient = new NotionToMarkdown({ notionClient: this.client });
  }

  get notion() {
    return this.client;
  }

  get n2m() {
    return this.n2mClient;
  }
}
