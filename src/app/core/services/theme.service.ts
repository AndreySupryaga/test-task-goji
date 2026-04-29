import { Injectable, signal, effect } from '@angular/core';

import { LOCAL_STORAGE_THEME_KEY, Theme } from '@core/constants';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _theme = signal<Theme>(this.loadTheme());

  readonly theme = this._theme.asReadonly();

  constructor() {
    effect(() => {
      const theme = this._theme();
      this.applyTheme(theme);
      localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
    });
  }

  toggle() {
    this._theme.update((t) => (t === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
  }

  private loadTheme(): Theme {
    const stored = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme | null;
    if (stored === Theme.LIGHT || stored === Theme.DARK) return stored;
    const prefersDark =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : false;
    return prefersDark ? Theme.DARK : Theme.LIGHT;
  }

  private applyTheme(theme: Theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
