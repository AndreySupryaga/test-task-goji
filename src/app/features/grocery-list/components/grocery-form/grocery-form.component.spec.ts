import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslocoTestingModule } from '@jsverse/transloco';

import { Language, DEFAULT_LANGUAGE } from '@core/constants';
import en from '@assets/i18n/en.json';

import { DEFAULT_GROCERY_UNIT } from '@features/grocery-list/entities/constants';

import { GroceryFormComponent, GroceryFormDialogData } from './grocery-form.component';

describe('GroceryFormComponent', () => {
  const mockDialogRef = {
    close: vi.fn(),
  };

  const translocoOptions = {
    langs: { [Language.ENGLISH]: en },
    translocoConfig: { availableLangs: [Language.ENGLISH], defaultLang: DEFAULT_LANGUAGE },
  };

  async function setup(data: GroceryFormDialogData) {
    return await render(GroceryFormComponent, {
      imports: [
        NoopAnimationsModule,
        TranslocoTestingModule.forRoot(translocoOptions),
      ],
      providers: [
        provideZonelessChangeDetection(),
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
    });
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders "Add Item" title when in add mode', async () => {
    await setup({ item: null });
    expect(screen.getByText('Add Item')).toBeTruthy();
  });

  it('renders "Edit Item" title when in edit mode', async () => {
    await setup({
      item: {
        id: '1',
        name: 'Apples',
        quantity: 5,
        unit: DEFAULT_GROCERY_UNIT,
        bought: false,
        createdAt: '',
        updatedAt: '',
      },
    });
    expect(screen.getByText('Edit Item')).toBeTruthy();
  });

  it('initializes form with item data in edit mode', async () => {
    await setup({
      item: {
        id: '1',
        name: 'Apples',
        quantity: 5,
        unit: DEFAULT_GROCERY_UNIT,
        bought: false,
        createdAt: '',
        updatedAt: '',
      },
    });

    const nameInput = screen.getByPlaceholderText('e.g. Apples') as HTMLInputElement;
    const quantityInput = screen.getByLabelText('Quantity') as HTMLInputElement;

    expect(nameInput.value).toBe('Apples');
    expect(quantityInput.value).toBe('5');
  });

  it('closes dialog with form data on valid submit', async () => {
    await setup({ item: null });

    const nameInput = screen.getByPlaceholderText('e.g. Apples');
    const quantityInput = screen.getByLabelText('Quantity');
    const submitButton = screen.getByText('Add');

    fireEvent.input(nameInput, { target: { value: 'Bananas' } });
    fireEvent.input(quantityInput, { target: { value: '3' } });
    fireEvent.click(submitButton);

    expect(mockDialogRef.close).toHaveBeenCalledWith({
      name: 'Bananas',
      quantity: 3,
      unit: DEFAULT_GROCERY_UNIT,
      bought: false,
    });
  });

  it('does not close dialog if form is invalid', async () => {
    await setup({ item: null });

    const submitButton = screen.getByText('Add');
    fireEvent.click(submitButton);

    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });
});
