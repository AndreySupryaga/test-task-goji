import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { TranslocoTestingModule, TranslocoTestingOptions } from '@jsverse/transloco';

import { Language, DEFAULT_LANGUAGE } from '@core/constants';
import en from '@assets/i18n/en.json';

import { GroceryItem } from '@features/grocery-list/entities/models';
import { DEFAULT_GROCERY_UNIT } from '@features/grocery-list/entities/constants';

import { GroceryItemComponent } from './grocery-item.component';

const translocoOptions: TranslocoTestingOptions = {
  langs: { [Language.ENGLISH]: en },
  translocoConfig: { availableLangs: [Language.ENGLISH], defaultLang: DEFAULT_LANGUAGE },
};

const mockItem: GroceryItem = {
  id: '1',
  name: 'Apples',
  quantity: 6,
  unit: DEFAULT_GROCERY_UNIT,
  bought: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

async function setup(item: GroceryItem = mockItem) {
  return render(GroceryItemComponent, {
    inputs: { item },
    imports: [TranslocoTestingModule.forRoot(translocoOptions)],
    providers: [provideZonelessChangeDetection()],
  });
}

describe('GroceryItemComponent', () => {
  it('renders item name', async () => {
    await setup();
    expect(screen.getByText('Apples')).toBeTruthy();
  });

  it('renders item quantity and unit', async () => {
    await setup();
    expect(screen.getByText(`6 ${DEFAULT_GROCERY_UNIT}`)).toBeTruthy();
  });

  it('shows checkbox unchecked for non-bought item', async () => {
    await setup();
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it('shows checkbox checked for bought item', async () => {
    const boughtItem = { ...mockItem, bought: true };
    await setup(boughtItem);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('applies bought class when item is bought', async () => {
    const boughtItem = { ...mockItem, bought: true };
    const { container } = await setup(boughtItem);
    const listItem = container.querySelector('.grocery-item');
    expect(listItem?.classList.contains('grocery-item--bought')).toBe(true);
  });

  it('does not apply bought class when item is not bought', async () => {
    const { container } = await setup();
    const listItem = container.querySelector('.grocery-item');
    expect(listItem?.classList.contains('grocery-item--bought')).toBe(false);
  });

  it('emits toggleBought when checkbox is clicked', async () => {
    const { fixture } = await setup();
    const toggleSpy = vi.fn();
    fixture.componentInstance.toggleBought.subscribe(toggleSpy);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(toggleSpy).toHaveBeenCalledWith({ id: '1', bought: true });
  });

  it('emits edit event when edit button is clicked', async () => {
    const { fixture } = await setup();
    const editSpy = vi.fn();
    fixture.componentInstance.edit.subscribe(editSpy);

    const buttons = screen.getAllByRole('button');
    const editBtn = buttons.find((b) => b.getAttribute('aria-label') === 'Edit Item');
    if (editBtn) {
      fireEvent.click(editBtn);
      expect(editSpy).toHaveBeenCalledWith(mockItem);
    }
  });

  it('emits delete event when delete button is clicked', async () => {
    const { fixture } = await setup();
    const deleteSpy = vi.fn();
    fixture.componentInstance.delete.subscribe(deleteSpy);

    const buttons = screen.getAllByRole('button');
    const deleteBtn = buttons.find((b) => b.getAttribute('aria-label') === 'Delete Item');
    if (deleteBtn) {
      fireEvent.click(deleteBtn);
      expect(deleteSpy).toHaveBeenCalledWith('1');
    }
  });
});
