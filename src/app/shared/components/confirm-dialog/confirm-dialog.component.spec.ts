import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/angular';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslocoTestingModule } from '@jsverse/transloco';

import { Language, DEFAULT_LANGUAGE } from '@core/constants';
import en from '@assets/i18n/en.json';

import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  const translocoOptions = {
    langs: { [Language.ENGLISH]: en },
    translocoConfig: { availableLangs: [Language.ENGLISH], defaultLang: DEFAULT_LANGUAGE },
  };

  const mockData: ConfirmDialogData = {
    titleKey: 'grocery.deleteItem',
    messageKey: 'grocery.confirmDelete',
  };

  it('renders title and message from keys', async () => {
    await render(ConfirmDialogComponent, {
      imports: [TranslocoTestingModule.forRoot(translocoOptions)],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: mockData }],
    });

    expect(screen.getByText('Delete Item')).toBeTruthy();
    expect(screen.getByText('Are you sure you want to delete this item?')).toBeTruthy();
  });
});
