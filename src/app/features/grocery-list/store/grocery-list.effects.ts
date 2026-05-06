import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  concatMap,
  debounceTime,
  exhaustMap,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';

import { GroceryApiService } from '@features/grocery-list/services';

import { GroceryListActions } from './grocery-list.actions';
import { groceryListFeature } from './grocery-list.reducer';

@Injectable()
export class GroceryListEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(GroceryApiService);
  private readonly store = inject(Store);
  private readonly snackBar = inject(MatSnackBar);

  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroceryListActions.loadItems),
      withLatestFrom(
        this.store.select(groceryListFeature.selectSearch),
        this.store.select(groceryListFeature.selectActiveTab),
      ),
      switchMap(([, search, activeTab]) =>
        this.api.searchItems(search, activeTab === 'bought').pipe(
          map((items) => GroceryListActions.loadItemsSuccess({ items })),
          catchError((error: Error) =>
            of(GroceryListActions.loadItemsFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  searchItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroceryListActions.search),
      debounceTime(300),
      withLatestFrom(this.store.select(groceryListFeature.selectActiveTab)),
      switchMap(([{ value }, activeTab]) =>
        this.api.searchItems(value, activeTab === 'bought').pipe(
          map((items) => GroceryListActions.loadItemsSuccess({ items })),
          catchError((error: Error) =>
            of(GroceryListActions.loadItemsFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  setTab$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroceryListActions.setTab),
      withLatestFrom(this.store.select(groceryListFeature.selectSearch)),
      switchMap(([{ tab }, search]) =>
        this.api.searchItems(search, tab === 'bought').pipe(
          map((items) => GroceryListActions.loadItemsSuccess({ items })),
          catchError((error: Error) =>
            of(GroceryListActions.loadItemsFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  addItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroceryListActions.addItem),
      exhaustMap(({ payload }) =>
        this.api.create(payload).pipe(
          map((item) => GroceryListActions.addItemSuccess({ item })),
          catchError((error: Error) =>
            of(GroceryListActions.addItemFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  updateItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroceryListActions.updateItem),
      exhaustMap(({ payload }) =>
        this.api.update(payload).pipe(
          map((item) => GroceryListActions.updateItemSuccess({ item })),
          catchError((error: Error) =>
            of(GroceryListActions.updateItemFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  deleteItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroceryListActions.deleteItem),
      exhaustMap(({ id }) =>
        this.api.delete(id).pipe(
          map(() => GroceryListActions.deleteItemSuccess({ id })),
          catchError((error: Error) =>
            of(GroceryListActions.deleteItemFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  toggleBought$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroceryListActions.toggleBought),
      concatMap(({ id, bought }) =>
        this.api.update({ id, bought }).pipe(
          map((item) => GroceryListActions.toggleBoughtSuccess({ item })),
          catchError((error: Error) =>
            of(
              GroceryListActions.toggleBoughtFailure({
                id,
                previousBought: !bought,
                error: error.message,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  notifyMutationError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          GroceryListActions.addItemFailure,
          GroceryListActions.updateItemFailure,
          GroceryListActions.deleteItemFailure,
          GroceryListActions.toggleBoughtFailure,
        ),
        tap(({ error }) => {
          this.snackBar.open(error, '✕', { duration: 4000 });
        }),
      ),
    { dispatch: false },
  );
}
