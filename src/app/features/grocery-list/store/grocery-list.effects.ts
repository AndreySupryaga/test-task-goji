import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap, tap } from 'rxjs';

import { GroceryApiService } from '@features/grocery-list/services';

import { GroceryListActions } from './grocery-list.actions';

@Injectable()
export class GroceryListEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(GroceryApiService);
  private readonly snackBar = inject(MatSnackBar);

  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroceryListActions.loadItems),
      switchMap(() =>
        this.api.getAll().pipe(
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
      exhaustMap(({ id, bought }) =>
        this.api.update({ id, bought }).pipe(
          map((item) => GroceryListActions.toggleBoughtSuccess({ item })),
          catchError((error: Error) =>
            of(GroceryListActions.toggleBoughtFailure({ error: error.message })),
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
