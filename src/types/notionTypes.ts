interface TitleProperty {
  id: string;
  type: "title";
  title: {
    plain_text: string;
    href: string | null;
  }[];
}

interface RichTextProperty {
  id: string;
  type: "rich_text";
  rich_text: {
    plain_text: string;
    href: string | null;
  }[];
}

interface NumberProperty {
  id: string;
  type: "number";
  number: number | null;
}

interface SelectProperty {
  id: string;
  type: "select";
  select: {
    name: string;
    color: string;
  } | null;
}

interface MultiSelectProperty {
  id: string;
  type: "multi_select";
  multi_select: {
    name: string;
    color: string;
  }[];
}

interface DateProperty {
  id: string;
  type: "date";
  date: {
    start: string;
    end: string | null;
    time_zone: string | null;
  } | null;
}

interface CheckboxProperty {
  id: string;
  type: "checkbox";
  checkbox: boolean;
}

interface URLProperty {
  id: string;
  type: "url";
  url: string | null;
}

interface EmailProperty {
  id: string;
  type: "email";
  email: string | null;
}

interface PhoneNumberProperty {
  id: string;
  type: "phone_number";
  phone_number: string | null;
}

interface PeopleProperty {
  id: string;
  type: "people";
  people: {
    object: string;
    id: string;
    name: string;
    avatar_url: string | null;
    type: string;
    person: {
      email: string;
    };
  }[];
}

interface FileProperty {
  id: string;
  type: "files";
  files: (
    | {
        name: string;
        type: "file";
        file: {
          url: string;
          expiry_time?: string;
        };
      }
    | {
        name: string;
        type: "external";
        external: {
          url: string;
        };
      }
  )[];
}

interface RelationProperty {
  id: string;
  type: "relation";
  relation: {
    id: string;
  }[];
  has_more: boolean;
}

export type PropertyValue =
  | TitleProperty
  | RichTextProperty
  | NumberProperty
  | SelectProperty
  | MultiSelectProperty
  | DateProperty
  | CheckboxProperty
  | URLProperty
  | EmailProperty
  | PhoneNumberProperty
  | PeopleProperty
  | FileProperty
  | RelationProperty;
