import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { groceryListFeature } from '@features/grocery-list/store/grocery-list.reducer';
import { GroceryListEffects } from '@features/grocery-list/store/grocery-list.effects';

export const groceryListRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/grocery-list-page/grocery-list-page.component').then(
        (m) => m.GroceryListPageComponent,
      ),
    providers: [
      provideState(groceryListFeature),
      provideEffects(GroceryListEffects),
    ],
  },
];
