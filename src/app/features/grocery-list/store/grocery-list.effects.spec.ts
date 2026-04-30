import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';

import { DEFAULT_GROCERY_UNIT } from '@features/grocery-list/entities/constants';
import { GroceryItem } from '@features/grocery-list/entities/models';

import { GroceryApiService } from '@features/grocery-list/services';

import { GroceryListActions } from './grocery-list.actions';
import { GroceryListEffects } from './grocery-list.effects';

const mockItem: GroceryItem = {
  id: '1',
  name: 'Apples',
  quantity: 6,
  unit: DEFAULT_GROCERY_UNIT,
  bought: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('GroceryListEffects', () => {
  let effects: GroceryListEffects;
  let actions$: Observable<Action>;
  let apiService: GroceryApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GroceryListEffects,
        GroceryApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(GroceryListEffects);
    apiService = TestBed.inject(GroceryApiService);
  });

  describe('loadItems$', () => {
    it('dispatches loadItemsSuccess on success', () => {
      vi.spyOn(apiService, 'getAll').mockReturnValue(of([mockItem]));
      actions$ = of(GroceryListActions.loadItems());

      effects.loadItems$.subscribe((action) => {
        expect(action).toEqual(GroceryListActions.loadItemsSuccess({ items: [mockItem] }));
      });
    });

    it('dispatches loadItemsFailure on error', () => {
      vi.spyOn(apiService, 'getAll').mockReturnValue(throwError(() => new Error('Network error')));
      actions$ = of(GroceryListActions.loadItems());

      effects.loadItems$.subscribe((action) => {
        expect(action).toEqual(GroceryListActions.loadItemsFailure({ error: 'Network error' }));
      });
    });
  });

  describe('addItem$', () => {
    it('dispatches addItemSuccess on success', () => {
      vi.spyOn(apiService, 'create').mockReturnValue(of(mockItem));
      const payload = { name: 'Apples', quantity: 6, unit: DEFAULT_GROCERY_UNIT, bought: false };
      actions$ = of(GroceryListActions.addItem({ payload }));

      effects.addItem$.subscribe((action) => {
        expect(action).toEqual(GroceryListActions.addItemSuccess({ item: mockItem }));
      });
    });

    it('dispatches addItemFailure on error', () => {
      vi.spyOn(apiService, 'create').mockReturnValue(throwError(() => new Error('Save failed')));
      const payload = { name: 'Apples', quantity: 6, unit: DEFAULT_GROCERY_UNIT, bought: false };
      actions$ = of(GroceryListActions.addItem({ payload }));

      effects.addItem$.subscribe((action) => {
        expect(action).toEqual(GroceryListActions.addItemFailure({ error: 'Save failed' }));
      });
    });
  });

  describe('deleteItem$', () => {
    it('dispatches deleteItemSuccess with id on success', () => {
      vi.spyOn(apiService, 'delete').mockReturnValue(of(undefined as unknown as void));
      actions$ = of(GroceryListActions.deleteItem({ id: '1' }));

      effects.deleteItem$.subscribe((action) => {
        expect(action).toEqual(GroceryListActions.deleteItemSuccess({ id: '1' }));
      });
    });
  });

  describe('updateItem$', () => {
    it('dispatches updateItemSuccess on success', () => {
      const updated = { ...mockItem, name: 'Bananas' };
      vi.spyOn(apiService, 'update').mockReturnValue(of(updated));
      const payload = { id: '1', name: 'Bananas' };
      actions$ = of(GroceryListActions.updateItem({ payload }));

      effects.updateItem$.subscribe((action) => {
        expect(action).toEqual(GroceryListActions.updateItemSuccess({ item: updated }));
      });
    });
  });

  describe('toggleBought$', () => {
    it('dispatches toggleBoughtSuccess on success', () => {
      const toggled = { ...mockItem, bought: true };
      vi.spyOn(apiService, 'update').mockReturnValue(of(toggled));
      actions$ = of(GroceryListActions.toggleBought({ id: '1', bought: true }));

      effects.toggleBought$.subscribe((action) => {
        expect(action).toEqual(GroceryListActions.toggleBoughtSuccess({ item: toggled }));
      });
    });

    it('dispatches toggleBoughtFailure with rollback data on error', () => {
      vi.spyOn(apiService, 'update').mockReturnValue(throwError(() => new Error('Toggle failed')));
      actions$ = of(GroceryListActions.toggleBought({ id: '1', bought: true }));

      effects.toggleBought$.subscribe((action) => {
        expect(action).toEqual(
          GroceryListActions.toggleBoughtFailure({
            id: '1',
            previousBought: false,
            error: 'Toggle failed',
          }),
        );
      });
    });
  });
});
