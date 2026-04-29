import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { GroceryListActions } from '@features/grocery-list/store/grocery-list.actions';
import {
  GroceryListContainerComponent
} from '@features/grocery-list/components/grocery-list-container/grocery-list-container.component';

@Component({
  selector: 'app-grocery-list-page',
  imports: [GroceryListContainerComponent],
  templateUrl: './grocery-list-page.component.html',
  styleUrl: './grocery-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroceryListPageComponent {
  private readonly store = inject(Store);

  constructor() {
    this.store.dispatch(GroceryListActions.loadItems());
  }
}
