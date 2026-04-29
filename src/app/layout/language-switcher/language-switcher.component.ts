import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule } from '@jsverse/transloco';

import { Language, AVAILABLE_LANGUAGES } from '@core/constants';
import { LanguageService } from '@core/services';

@Component({
  selector: 'app-language-switcher',
  imports: [UpperCasePipe, MatButtonModule, MatIconModule, MatMenuModule, TranslocoModule],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent {
  protected readonly languageService = inject(LanguageService);
  protected readonly languages = AVAILABLE_LANGUAGES;

  protected readonly currentLang = computed(() =>
    this.languages.find((l) => l.code === this.languageService.activeLang()),
  );

  selectLanguage(lang: Language) {
    this.languageService.setLanguage(lang);
  }
}
