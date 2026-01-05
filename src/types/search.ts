export type SearchCategory = "resources" | "users" | "pages";

export type UniversalSearchResult = {
  id: string;
  label: string;
  description?: string | null;
  href: string;
  type: SearchCategory;
  external?: boolean;
};
