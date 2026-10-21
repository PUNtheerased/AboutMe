/**
 * Handwritten Google Fonts for the hero particle greetings.
 * Approach 1: 5 families — Latin (×6) share Kalam (upright hand).
 */

export type GreetingEntry = {
  text: string;
  /** CSS variable set on <body> by next/font */
  fontVar:
    | "--font-hand-latin"
    | "--font-hand-thai"
    | "--font-hand-zh"
    | "--font-hand-ja"
    | "--font-hand-ko";
  lang: string;
};

export const GREETINGS: readonly GreetingEntry[] = [
  { text: "Hello", fontVar: "--font-hand-latin", lang: "en" },
  { text: "สวัสดี", fontVar: "--font-hand-thai", lang: "th" },
  { text: "你好", fontVar: "--font-hand-zh", lang: "zh" },
  { text: "こんにちは", fontVar: "--font-hand-ja", lang: "ja" },
  { text: "안녕하세요", fontVar: "--font-hand-ko", lang: "ko" },
  { text: "Hola", fontVar: "--font-hand-latin", lang: "es" },
  { text: "Bonjour", fontVar: "--font-hand-latin", lang: "fr" },
  { text: "Hallo", fontVar: "--font-hand-latin", lang: "de" },
  { text: "Ciao", fontVar: "--font-hand-latin", lang: "it" },
  { text: "Olá", fontVar: "--font-hand-latin", lang: "pt" },
] as const;

export const HAND_FONT_VARS = [
  "--font-hand-latin",
  "--font-hand-thai",
  "--font-hand-zh",
  "--font-hand-ja",
  "--font-hand-ko",
] as const;
