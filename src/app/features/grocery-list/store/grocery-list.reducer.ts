import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { GroceryItem } from '@features/grocery-list/entities/models';

import { GroceryListActions } from './grocery-list.actions';

export interface GroceryListState extends EntityState<GroceryItem> {
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<GroceryItem> = createEntityAdapter<GroceryItem>({
  sortComparer: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
});

const initialState: GroceryListState = adapter.getInitialState({
  loading: false,
  submitting: false,
  error: null,
});

const reducer = createReducer(
  initialState,

  on(GroceryListActions.loadItems, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(GroceryListActions.loadItemsSuccess, (state, { items }) =>
    adapter.setAll(items, { ...state, loading: false }),
  ),
  on(GroceryListActions.loadItemsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(GroceryListActions.addItem, (state) => ({ ...state, submitting: true, error: null })),
  on(GroceryListActions.addItemSuccess, (state, { item }) =>
    adapter.addOne(item, { ...state, submitting: false }),
  ),
  on(GroceryListActions.addItemFailure, (state, { error }) => ({
    ...state,
    submitting: false,
    error,
  })),

  on(GroceryListActions.updateItem, (state) => ({ ...state, submitting: true, error: null })),
  on(GroceryListActions.updateItemSuccess, (state, { item }) =>
    adapter.updateOne({ id: item.id, changes: item }, { ...state, submitting: false }),
  ),
  on(GroceryListActions.updateItemFailure, (state, { error }) => ({
    ...state,
    submitting: false,
    error,
  })),

  on(GroceryListActions.deleteItem, (state) => ({ ...state, submitting: true, error: null })),
  on(GroceryListActions.deleteItemSuccess, (state, { id }) =>
    adapter.removeOne(id, { ...state, submitting: false }),
  ),
  on(GroceryListActions.deleteItemFailure, (state, { error }) => ({
    ...state,
    submitting: false,
    error,
  })),

  on(GroceryListActions.toggleBought, (state, { id, bought }) =>
    adapter.updateOne({ id, changes: { bought } }, state),
  ),
  on(GroceryListActions.toggleBoughtSuccess, (state, { item }) =>
    adapter.updateOne({ id: item.id, changes: item }, state),
  ),
  on(GroceryListActions.toggleBoughtFailure, (state, { id, previousBought, error }) =>
    adapter.updateOne({ id, changes: { bought: previousBought } }, { ...state, error }),
  ),
);

export const groceryListFeature = createFeature({
  name: 'groceryList',
  reducer,
  extraSelectors: ({ selectGroceryListState }) => ({
    ...adapter.getSelectors(selectGroceryListState),
    selectPendingItems: createSelector(
      adapter.getSelectors(selectGroceryListState).selectAll,
      (items) => items.filter((item) => !item.bought),
    ),
    selectBoughtItems: createSelector(
      adapter.getSelectors(selectGroceryListState).selectAll,
      (items) =>
        items
          .filter((item) => item.bought)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    ),
    selectTotalCount: createSelector(
      adapter.getSelectors(selectGroceryListState).selectAll,
      (items) => items.length,
    ),
    selectBoughtCount: createSelector(
      adapter.getSelectors(selectGroceryListState).selectAll,
      (items) => items.filter((item) => item.bought).length,
    ),
  }),
});
