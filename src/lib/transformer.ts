/**
 * Transformer module
 *
 * Responsible for transforming a raw Notion page object into a
 * clean, normalized JavaScript object ready for consumption.
 *
 * It dynamically parses all property types without needing to
 * know them in advance.
 */

import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { PropertyValue } from "@/types/notionTypes";

export interface TransformedProperty {
  [key: string]: any;
}

export interface TransformedPage {
  id: string;
  createdAt: string;
  lastEditedAt: string;
  properties: TransformedProperty;
}

/**
 * Transforms a single Notion page object into a clean, flattened object.
 *
 * @param page - The raw Notion page object
 * @returns TransformedPage
 */
export function transformPage(page: PageObjectResponse): TransformedPage {
  const transformed: TransformedPage = {
    id: page.id,
    createdAt: page.created_time,
    lastEditedAt: page.last_edited_time,
    properties: {},
  };

  const properties = page.properties ?? {};

  for (const [key, prop] of Object.entries(properties)) {
    transformed.properties[key] = parseProperty(prop as PropertyValue);
  }

  return transformed;
}

/**
 * Parses a single Notion property item into a basic JavaScript type.
 *
 * @param property - The raw Notion property item
 * @returns Parsed value
 */
function parseProperty(property: PropertyValue): any {
  switch (property.type) {
    case "title":
      return property.title.map((item) => item.plain_text).join(" ");
    case "rich_text":
      return property.rich_text.map((item) => item.plain_text).join(" ");
    case "number":
      return property.number ?? null;
    case "select":
      return property.select?.name ?? null;
    case "multi_select":
      return property.multi_select.map((option) => option.name);
    case "date":
      return {
        start: property.date?.start ?? null,
        end: property.date?.end ?? null,
        timeZone: property.date?.time_zone ?? null,
      };
    case "checkbox":
      return property.checkbox;
    case "url":
      return property.url ?? null;
    case "email":
      return property.email ?? null;
    case "phone_number":
      return property.phone_number ?? null;
    case "people":
      return property.people.map((person) => person.id);
    case "files":
      return property.files
        .map((file) => {
          if (file.type === "file") {
            return file.file.url;
          } else if (file.type === "external") {
            return file.external.url;
          }
          return null;
        })
        .filter(Boolean);
    case "relation":
      return property.relation.map((rel) => rel.id);
    //TODO: Add support for formula and rollup properties
    // case "formula":
    // case "rollup":
    default:
      return null;
  }
}
