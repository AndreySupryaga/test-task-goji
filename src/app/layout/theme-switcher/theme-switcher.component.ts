import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';

import { ThemeService } from '@core/services';
import { THEME_ICON } from '@core/constants';

@Component({
  selector: 'app-theme-switcher',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, TranslocoModule],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitcherComponent {
  protected readonly themeService = inject(ThemeService);

  get themeIcon() {
    return THEME_ICON[this.themeService.theme()];
  }
}
