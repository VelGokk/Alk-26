// Config contract (future SSOT):
// 1) add new config here
// 2) migrate usage to config
// 3) delete legacy sources
export * from "./tokens";
export * from "./fonts";
export * from "./paths";
export * from "./pages";
export * from "./sections";
export * from "./roles";
export * from "./permissions";
export * from "./review";
export * from "./navigation";
export * from "./feature-flags";
export * from "./i18n";
export * from "./seo";
export * from "./voice";
export * from "./ai";

export { default as dictionaryEsAr } from "./dictionaries/es-ar";
export { default as dictionaryEsMx } from "./dictionaries/es-mx";
export { default as dictionaryEn } from "./dictionaries/en";
export { default as dictionaryPt } from "./dictionaries/pt";
