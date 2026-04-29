import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/angular';
import { TranslocoTestingModule } from '@jsverse/transloco';

import { Language, DEFAULT_LANGUAGE } from '@core/constants';
import en from '@assets/i18n/en.json';

import { LoaderComponent } from './loader.component';

describe('LoaderComponent', () => {
  const translocoOptions = {
    langs: { [Language.ENGLISH]: en },
    translocoConfig: { availableLangs: [Language.ENGLISH], defaultLang: DEFAULT_LANGUAGE },
  };

  it('renders loading text', async () => {
    await render(LoaderComponent, {
      imports: [TranslocoTestingModule.forRoot(translocoOptions)],
    });

    expect(screen.getByText('Loading...')).toBeTruthy();
  });
});
