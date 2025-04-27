import { describe, it, expect } from "vitest";
import { transformPage } from "../lib/transformer";

const mockPage: any = {
  id: "page_123",
  created_time: "2024-04-01T10:00:00.000Z",
  last_edited_time: "2024-04-02T11:00:00.000Z",
  properties: {
    title: {
      type: "title",
      title: [{ plain_text: "Hello World" }],
    },
    views: {
      type: "number",
      number: 123,
    },
    published: {
      type: "checkbox",
      checkbox: true,
    },
    tags: {
      type: "multi_select",
      multi_select: [{ name: "Tag 1" }, { name: "Tag 2" }],
    },
    author: {
      type: "people",
      people: [{ object: "user", id: "user_123" }],
    },
    cover: {
      type: "files",
      files: [
        {
          name: "cover.jpg",
          type: "external",
          external: { url: "URL_ADDRESS.com/cover.jpg" },
        },
      ],
    },
    phone: {
      type: "phone_number",
      phone_number: "+1234567890",
    },
    url: {
      type: "url",
      url: "www.example.com",
    },
    date: {
      type: "date",
      date: { start: "2024-04-03T12:00:00.000Z", end: null, time_zone: null },
    },
    email: {
      type: "email",
      email: "test@gmail.com",
    },
    relation: {
      type: "relation",
      relation: [{ id: "relation_123"}, { id: "relation_456" }],
    },
  },
};

describe("transformPage", () => {
  it("should transform a page correctly", () => {
    const transformed = transformPage(mockPage);

    expect(transformed).toEqual({
      id: "page_123",
      createdAt: "2024-04-01T10:00:00.000Z",
      lastEditedAt: "2024-04-02T11:00:00.000Z",

      properties: {
        title: "Hello World",
        views: 123,
        tags: ["Tag 1", "Tag 2"],
        author: ["user_123"],
        cover: ["URL_ADDRESS.com/cover.jpg"],
        published: true,
        phone: "+1234567890",
        url: "www.example.com",
        date: {
          start: "2024-04-03T12:00:00.000Z",
          end: null,
          timeZone: null,
        },
        email: "test@gmail.com",
        relation: ["relation_123", "relation_456"],
      },
    });
  });
});
