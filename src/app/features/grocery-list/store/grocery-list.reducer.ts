import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { GroceryItem } from '@features/grocery-list/entities/models';
import { GroceryTab } from '@features/grocery-list/entities/constants';

import { GroceryListActions } from './grocery-list.actions';

export interface GroceryListState extends EntityState<GroceryItem> {
  loading: boolean;
  submitting: boolean;
  error: string | null;
  activeTab: GroceryTab;
  search: string;
}

export const adapter: EntityAdapter<GroceryItem> = createEntityAdapter<GroceryItem>({
  sortComparer: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
});

const initialState: GroceryListState = adapter.getInitialState({
  loading: false,
  submitting: false,
  error: null,
  activeTab: GroceryTab.PENDING,
  search: '',
});

const itemBelongsToTab = (item: GroceryItem, tab: GroceryTab): boolean =>
  tab === GroceryTab.BOUGHT ? item.bought : !item.bought;

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

  on(GroceryListActions.search, (state, { value }) => ({
    ...state,
    search: value,
  })),

  on(GroceryListActions.setTab, (state, { tab }) => ({
    ...state,
    activeTab: tab,
  })),

  on(GroceryListActions.addItem, (state) => ({ ...state, submitting: true, error: null })),
  on(GroceryListActions.addItemSuccess, (state, { item }) => {
    if (!itemBelongsToTab(item, state.activeTab)) {
      return { ...state, submitting: false };
    }
    return adapter.addOne(item, { ...state, submitting: false });
  }),
  on(GroceryListActions.addItemFailure, (state, { error }) => ({
    ...state,
    submitting: false,
    error,
  })),

  on(GroceryListActions.updateItem, (state) => ({ ...state, submitting: true, error: null })),
  on(GroceryListActions.updateItemSuccess, (state, { item }) => {
    if (!itemBelongsToTab(item, state.activeTab)) {
      return adapter.removeOne(item.id, { ...state, submitting: false });
    }
    return adapter.updateOne({ id: item.id, changes: item }, { ...state, submitting: false });
  }),
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
  on(GroceryListActions.toggleBoughtSuccess, (state, { item }) => {
    if (!itemBelongsToTab(item, state.activeTab)) {
      return adapter.removeOne(item.id, state);
    }
    return adapter.updateOne({ id: item.id, changes: item }, state);
  }),
  on(GroceryListActions.toggleBoughtFailure, (state, { id, previousBought, error }) =>
    adapter.updateOne({ id, changes: { bought: previousBought } }, { ...state, error }),
  ),
);

export const groceryListFeature = createFeature({
  name: 'groceryList',
  reducer,
  extraSelectors: ({ selectGroceryListState }) => ({
    ...adapter.getSelectors(selectGroceryListState),
    selectActiveTab: createSelector(selectGroceryListState, (state) => state.activeTab),
    selectSearch: createSelector(selectGroceryListState, (state) => state.search),
  }),
});
