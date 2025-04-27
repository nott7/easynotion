import { describe, it, expect, vi, beforeEach } from "vitest";
import { EasyNotion } from "../lib/EasyNotion";

vi.mock("@notionhq/client", () => {
  return {
    Client: class {
      databases = {
        retrieve: vi.fn().mockResolvedValue({ id: "db123", title: "Test DB" }),
        query: vi
          .fn()
          .mockResolvedValue({
            results: [{ id: "page1", properties: {} }],
            has_more: false,
          }),
      };
      pages = {
        retrieve: vi.fn().mockResolvedValue({ id: "page1", properties: {} }),
      };
    },
  };
});

vi.mock("notion-to-md", () => {
  return {
    NotionToMarkdown: class {
      pageToMarkdown = vi.fn().mockResolvedValue([{ type: "paragraph", text: "Hello" }]);
      toMarkdownString = vi.fn().mockReturnValue({
        parent: "Markdown content"
      });
    },
  };
});

describe("EasyNotion", () => {
  let notion: EasyNotion;

  beforeEach(() => {
    notion = new EasyNotion({ apiKey: "test-key", cacheTTL: 60 });
  });

  it("should fetch a database", async () => {
    const db = await notion.getDatabase("db123");
    expect(db.id).toBe("db123");
  });

  it("should fetch all database items", async () => {
    const items = await notion.getDatabaseItems("db123");
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBe(1);
  });

  it("should fetch a single page", async () => {
    const { page, markdown } = await notion.getSinglePage("page1");
    expect(page).toBeDefined();
    expect(markdown).toBe("Markdown content");
  });
});
