import { LanguageOption } from '@core/models';

export enum Language {
  ENGLISH = 'en',
  GERMAN = 'de',
  UKRAINIAN = 'uk',
}

export enum LanguageLabel {
  ENGLISH = 'English',
  GERMAN = 'Deutsch',
  UKRAINIAN = 'Українська',
}

export const DEFAULT_LANGUAGE = Language.ENGLISH;

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: Language.ENGLISH, label: LanguageLabel.ENGLISH, flag: '🇬🇧' },
  { code: Language.GERMAN, label: LanguageLabel.GERMAN, flag: '🇩🇪' },
  { code: Language.UKRAINIAN, label: LanguageLabel.UKRAINIAN, flag: '🇺🇦' },
];
