import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/grocery-list/grocery-list.routes').then((m) => m.groceryListRoutes),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
