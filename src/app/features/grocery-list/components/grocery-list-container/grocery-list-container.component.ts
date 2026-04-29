import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '@shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';

import { GroceryItem, GroceryItemTogglePayload } from '@features/grocery-list/entities/models';
import { GroceryListActions } from '@features/grocery-list/store/grocery-list.actions';
import { groceryListFeature } from '@features/grocery-list/store/grocery-list.reducer';
import { GroceryItemComponent } from '@features/grocery-list/components/grocery-item/grocery-item.component';
import { GroceryFormComponent } from '@features/grocery-list/components/grocery-form/grocery-form.component';

@Component({
  selector: 'app-grocery-list-container',
  imports: [
    MatButtonModule,
    MatIconModule,
    TranslocoModule,
    GroceryItemComponent,
    LoaderComponent,
    EmptyStateComponent,
  ],
  templateUrl: './grocery-list-container.component.html',
  styleUrl: './grocery-list-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroceryListContainerComponent {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);

  readonly allItems = this.store.selectSignal(groceryListFeature.selectAll);
  readonly loading = this.store.selectSignal(groceryListFeature.selectLoading);
  readonly error = this.store.selectSignal(groceryListFeature.selectError);
  readonly pendingItems = this.store.selectSignal(groceryListFeature.selectPendingItems);
  readonly boughtItems = this.store.selectSignal(groceryListFeature.selectBoughtItems);
  readonly totalCount = this.store.selectSignal(groceryListFeature.selectTotalCount);
  readonly boughtCount = this.store.selectSignal(groceryListFeature.selectBoughtCount);

  onOpenAddForm() {
    this.openFormDialog().subscribe((payload) => {
      payload && this.store.dispatch(GroceryListActions.addItem({ payload }));
    });
  }

  onOpenEditForm(item: GroceryItem) {
    this.openFormDialog(item).subscribe((payload) => {
      payload &&
        this.store.dispatch(
          GroceryListActions.updateItem({ payload: { id: item.id, ...payload } }),
        );
    });
  }

  onDeleteItem(id: string) {
    const data: ConfirmDialogData = {
      titleKey: 'grocery.confirmDelete',
      messageKey: 'grocery.confirmDeleteDescription',
    };
    this.dialog
      .open<ConfirmDialogComponent, ConfirmDialogData, boolean>(ConfirmDialogComponent, { data })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) this.store.dispatch(GroceryListActions.deleteItem({ id }));
      });
  }

  onToggleBought(event: GroceryItemTogglePayload) {
    this.store.dispatch(GroceryListActions.toggleBought({ id: event.id, bought: event.bought }));
  }

  onRetryLoad() {
    this.store.dispatch(GroceryListActions.loadItems());
  }

  private openFormDialog(item?: GroceryItem) {
    return this.dialog.open(GroceryFormComponent, { data: { item: item || null } }).afterClosed();
  }
}
