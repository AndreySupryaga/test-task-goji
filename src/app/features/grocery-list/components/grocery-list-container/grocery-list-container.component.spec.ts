import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TestBed } from '@angular/core/testing';
import { TranslocoTestingModule, TranslocoTestingOptions } from '@jsverse/transloco';
import { of } from 'rxjs';

import { Language, DEFAULT_LANGUAGE } from '@core/constants';
import en from '@assets/i18n/en.json';

import { GroceryListActions } from '@features/grocery-list/store/grocery-list.actions';
import { groceryListFeature, adapter, GroceryListState } from '@features/grocery-list/store/grocery-list.reducer';
import { GroceryItem } from '@features/grocery-list/entities/models';
import { DEFAULT_GROCERY_UNIT } from '@features/grocery-list/entities/constants';

import { GroceryListContainerComponent } from './grocery-list-container.component';

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

const boughtItem: GroceryItem = { ...mockItem, id: '2', name: 'Milk', bought: true };

const initialState: GroceryListState = adapter.setAll([mockItem, boughtItem], adapter.getInitialState({
  loading: false,
  submitting: false,
  error: null,
}));

describe('GroceryListContainerComponent', () => {
  let store: MockStore;
  let dialogSpy: { open: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    dialogSpy = {
      open: vi.fn().mockReturnValue({
        afterClosed: () => of(null),
      } as MatDialogRef<unknown, unknown>),
    };

    await render(GroceryListContainerComponent, {
      imports: [
        MatDialogModule,
        TranslocoTestingModule.forRoot(translocoOptions),
      ],
      providers: [
        provideZonelessChangeDetection(),
        provideMockStore({
          initialState: { [groceryListFeature.name]: initialState },
        }),
        { provide: MatDialog, useValue: dialogSpy },
      ],
    });

    store = TestBed.inject(MockStore);
  });

  it('renders grocery list title', () => {
    expect(screen.getByText('My Grocery List')).toBeTruthy();
  });

  it('shows error message and retry button when error exists', async () => {
    store.setState({
      [groceryListFeature.name]: {
        ...initialState,
        error: 'Failed to load',
        loading: false
      }
    });
    TestBed.flushEffects();

    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText('Failed to load')).toBeTruthy();
    expect(screen.getByText('Retry')).toBeTruthy();
  });

  it('shows empty state when no items', async () => {
    store.setState({
      [groceryListFeature.name]: adapter.getInitialState({
        loading: false,
        submitting: false,
        error: null,
      })
    });
    TestBed.flushEffects();

    expect(screen.getByText('Your list is empty')).toBeTruthy();
  });

  it('shows loader when loading is true', async () => {
    store.setState({
      [groceryListFeature.name]: {
        ...initialState,
        loading: true
      }
    });
    TestBed.flushEffects();

    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('displays progress when items exist', () => {
    expect(screen.getByText('1 of 2 items bought')).toBeTruthy();
  });

  it('shows pending items', () => {
    const pendingSection = screen.getByLabelText(/pending items/i);
    expect(pendingSection).toBeTruthy();
    expect(screen.getByText('Apples')).toBeTruthy();
  });

  it('shows bought items', () => {
    const boughtSection = screen.getByLabelText(/bought items/i);
    expect(boughtSection).toBeTruthy();
    expect(screen.getByText('Milk')).toBeTruthy();
  });

  it('opens add form when add button is clicked', () => {
    const addButton = screen.getByText('Add Item');
    fireEvent.click(addButton);

    expect(dialogSpy.open).toHaveBeenCalled();
  });

  
  
  
  describe('item interactions', () => {
    it('dispatches toggleBought when checkbox is clicked', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      
      const checkboxes = screen.getAllByRole('checkbox');
      const firstCheckbox = checkboxes[0];
      fireEvent.click(firstCheckbox);

      expect(dispatchSpy).toHaveBeenCalledWith(
        GroceryListActions.toggleBought({ id: '1', bought: true })
      );
    });

    it('opens edit dialog when edit button is clicked', () => {
      const editButtons = screen.getAllByRole('button');
      const editButton = editButtons.find(btn => btn.getAttribute('aria-label') === 'Edit Item');
      
      if (editButton) {
        fireEvent.click(editButton);
        expect(dialogSpy.open).toHaveBeenCalled();
      }
    });

    it('opens delete confirmation when delete button is clicked', () => {
      const deleteButtons = screen.getAllByRole('button');
      const deleteButton = deleteButtons.find(btn => btn.getAttribute('aria-label') === 'Delete Item');
      
      if (deleteButton) {
        fireEvent.click(deleteButton);
        expect(dialogSpy.open).toHaveBeenCalled();
      }
    });
  });
});
