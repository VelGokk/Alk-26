export type VoiceConfig = {
  tone: string;
  glossary: string[];
  doNotTranslate: string[];
  examples: string[];
};

export const VOICE: VoiceConfig = {
  tone: "",
  glossary: [],
  doNotTranslate: [],
  examples: [],
};
