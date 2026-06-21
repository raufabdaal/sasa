/**
 * Time-aware greeting in the teacher's preferred language.
 * Source: design-philosophy.md "if you know, you know" detail #5.
 *
 * Restraint: never an exclamation mark. Never "Hi!". Always a comma + name.
 */

export type GreetingLang = "en" | "lg" | "run" | "luo" | "ate";

const greetings: Record<GreetingLang, { morning: string; day: string; evening: string }> = {
  en:  { morning: "Good morning",       day: "Good afternoon", evening: "Good evening" },
  lg:  { morning: "Wasuze otya",        day: "Osiibye otya",   evening: "Oraire otya" },
  run: { morning: "Oraire ota",         day: "Osiibire ota",   evening: "Oraire ota" },
  luo: { morning: "Iribo nining",       day: "Iribo nining",   evening: "Iribo nining" },
  ate: { morning: "Ijaraki",            day: "Ijaraki",        evening: "Ijaraki" },
};

export function greeting(name: string, lang: GreetingLang = "en", now = new Date()): string {
  const h = now.getHours();
  const slot = h < 12 ? "morning" : h < 17 ? "day" : "evening";
  const phrase = greetings[lang][slot];
  return `${phrase}, ${name}.`;
}
