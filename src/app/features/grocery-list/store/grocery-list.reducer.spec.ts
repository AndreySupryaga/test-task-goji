import { describe, it, expect } from 'vitest';

import { GroceryItem } from '@features/grocery-list/entities/models';
import { DEFAULT_GROCERY_UNIT } from '@features/grocery-list/entities/constants';

import { GroceryListActions } from './grocery-list.actions';
import { groceryListFeature, GroceryListState, adapter } from './grocery-list.reducer';

const { reducer } = groceryListFeature;

const mockItem: GroceryItem = {
  id: '1',
  name: 'Apples',
  quantity: 6,
  unit: DEFAULT_GROCERY_UNIT,
  bought: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const initialState: GroceryListState = adapter.getInitialState({
  loading: false,
  submitting: false,
  error: null,
});

describe('GroceryList Reducer', () => {
  describe('loadItems', () => {
    it('sets loading to true and clears error', () => {
      const state = reducer({ ...initialState, error: 'prev error' }, GroceryListActions.loadItems());
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('loadItemsSuccess', () => {
    it('sets all items and loading to false', () => {
      const loadingState = { ...initialState, loading: true };
      const state = reducer(loadingState, GroceryListActions.loadItemsSuccess({ items: [mockItem] }));
      expect(state.loading).toBe(false);
      expect(state.ids).toHaveLength(1);
      expect(state.entities['1']).toEqual(mockItem);
    });
  });

  describe('loadItemsFailure', () => {
    it('sets error and clears loading', () => {
      const loadingState = { ...initialState, loading: true };
      const state = reducer(loadingState, GroceryListActions.loadItemsFailure({ error: 'Network error' }));
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
    });
  });

  describe('addItem', () => {
    it('sets submitting to true', () => {
      const state = reducer(initialState, GroceryListActions.addItem({ payload: mockItem }));
      expect(state.submitting).toBe(true);
    });
  });

  describe('addItemSuccess', () => {
    it('adds item to state', () => {
      const state = reducer(initialState, GroceryListActions.addItemSuccess({ item: mockItem }));
      expect(state.ids).toHaveLength(1);
      expect(state.entities['1']).toEqual(mockItem);
      expect(state.submitting).toBe(false);
    });
  });

  describe('addItemFailure', () => {
    it('sets error and clears submitting', () => {
      const submittingState = { ...initialState, submitting: true };
      const state = reducer(submittingState, GroceryListActions.addItemFailure({ error: 'Save failed' }));
      expect(state.submitting).toBe(false);
      expect(state.error).toBe('Save failed');
    });
  });

  describe('updateItem', () => {
    it('sets submitting to true', () => {
      const state = reducer(initialState, GroceryListActions.updateItem({ payload: mockItem }));
      expect(state.submitting).toBe(true);
    });
  });

  describe('updateItemSuccess', () => {
    it('updates existing item and clears submitting', () => {
      const stateWithItem = adapter.addOne(mockItem, { ...initialState, submitting: true });
      const updated = { ...mockItem, name: 'Green Apples', quantity: 8 };
      const state = reducer(stateWithItem, GroceryListActions.updateItemSuccess({ item: updated }));
      expect(state.entities['1']?.name).toBe('Green Apples');
      expect(state.entities['1']?.quantity).toBe(8);
      expect(state.submitting).toBe(false);
    });
  });

  describe('updateItemFailure', () => {
    it('sets error and clears submitting', () => {
      const submittingState = { ...initialState, submitting: true };
      const state = reducer(submittingState, GroceryListActions.updateItemFailure({ error: 'Update failed' }));
      expect(state.submitting).toBe(false);
      expect(state.error).toBe('Update failed');
    });
  });

  describe('deleteItem', () => {
    it('sets submitting to true', () => {
      const state = reducer(initialState, GroceryListActions.deleteItem({ id: '1' }));
      expect(state.submitting).toBe(true);
    });
  });

  describe('deleteItemSuccess', () => {
    it('removes item from state and clears submitting', () => {
      const stateWithItem = adapter.addOne(mockItem, { ...initialState, submitting: true });
      const state = reducer(stateWithItem, GroceryListActions.deleteItemSuccess({ id: '1' }));
      expect(state.ids).toHaveLength(0);
      expect(state.entities['1']).toBeUndefined();
      expect(state.submitting).toBe(false);
    });
  });

  describe('deleteItemFailure', () => {
    it('sets error and clears submitting', () => {
      const submittingState = { ...initialState, submitting: true };
      const state = reducer(submittingState, GroceryListActions.deleteItemFailure({ error: 'Delete failed' }));
      expect(state.submitting).toBe(false);
      expect(state.error).toBe('Delete failed');
    });
  });

  describe('toggleBought', () => {
    it('optimistically updates bought status', () => {
      const stateWithItem = adapter.addOne(mockItem, initialState);
      const state = reducer(stateWithItem, GroceryListActions.toggleBought({ id: '1', bought: true }));
      expect(state.entities['1']?.bought).toBe(true);
    });

    it('reverts bought status when toggled back', () => {
      const boughtItem = { ...mockItem, bought: true };
      const stateWithBought = adapter.addOne(boughtItem, initialState);
      const state = reducer(stateWithBought, GroceryListActions.toggleBought({ id: '1', bought: false }));
      expect(state.entities['1']?.bought).toBe(false);
    });
  });

  describe('toggleBoughtSuccess', () => {
    it('updates item in state', () => {
      const stateWithItem = adapter.addOne(mockItem, initialState);
      const updated = { ...mockItem, bought: true };
      const state = reducer(stateWithItem, GroceryListActions.toggleBoughtSuccess({ item: updated }));
      expect(state.entities['1']?.bought).toBe(true);
    });
  });

  describe('toggleBoughtFailure', () => {
    it('sets error but does NOT revert optimistic update in reducer (logic in effects)', () => {
      const stateWithItem = adapter.addOne(mockItem, initialState);
      // First optimistic update
      const stateAfterToggle = reducer(stateWithItem, GroceryListActions.toggleBought({ id: '1', bought: true }));
      // Then failure
      const stateAfterFailure = reducer(stateAfterToggle, GroceryListActions.toggleBoughtFailure({ error: 'Toggle failed' }));
      
      expect(stateAfterFailure.error).toBe('Toggle failed');
      // Reducer doesn't know previous state, so it stays true. Revert is handled by another toggleBought action from effects.
      expect(stateAfterFailure.entities['1']?.bought).toBe(true);
    });
  });
});

describe('GroceryList Selectors', () => {
  const boughtItem = { ...mockItem, id: '2', name: 'Milk', bought: true };
  const stateWithItems = {
    [groceryListFeature.name]: adapter.setAll([mockItem, boughtItem], initialState)
  };

  it('selectPendingItems returns only non-bought items', () => {
    const result = groceryListFeature.selectPendingItems(stateWithItems);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
    expect(result[0].bought).toBe(false);
  });

  it('selectBoughtItems returns only bought items', () => {
    const result = groceryListFeature.selectBoughtItems(stateWithItems);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
    expect(result[0].bought).toBe(true);
  });

  it('selectTotalCount returns correct count', () => {
    const result = groceryListFeature.selectTotalCount(stateWithItems);
    expect(result).toBe(2);
  });

  it('selectBoughtCount returns correct bought count', () => {
    const result = groceryListFeature.selectBoughtCount(stateWithItems);
    expect(result).toBe(1);
  });

  it('selectors handle empty state', () => {
    const emptyState = {
      [groceryListFeature.name]: initialState
    };
    const emptyResult = groceryListFeature.selectPendingItems(emptyState);
    expect(emptyResult).toHaveLength(0);
    
    const emptyBoughtResult = groceryListFeature.selectBoughtItems(emptyState);
    expect(emptyBoughtResult).toHaveLength(0);
    
    const emptyTotalResult = groceryListFeature.selectTotalCount(emptyState);
    expect(emptyTotalResult).toBe(0);
    
    const emptyBoughtCountResult = groceryListFeature.selectBoughtCount(emptyState);
    expect(emptyBoughtCountResult).toBe(0);
  });
});
