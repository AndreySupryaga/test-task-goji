import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';

import { Language, DEFAULT_LANGUAGE, AVAILABLE_LANGUAGES } from '@core/constants';

export const LANG_KEY = 'grocery-lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly transloco = inject(TranslocoService);

  readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang() as Language,
  });

  constructor() {
    const stored = localStorage.getItem(LANG_KEY) as Language | null;
    const lang = stored && this.isLanguageValid(stored) ? stored : DEFAULT_LANGUAGE;
    this.transloco.setActiveLang(lang);
  }

  setLanguage(lang: Language) {
    this.transloco.setActiveLang(lang);
    localStorage.setItem(LANG_KEY, lang);
  }

  private isLanguageValid(lang: string): lang is Language {
    return AVAILABLE_LANGUAGES.some((l) => l.code === lang);
  }
}
