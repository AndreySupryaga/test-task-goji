import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';

import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '@shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';

import {
  GroceryItem,
  GroceryItemCreatePayload,
  GroceryItemTogglePayload,
} from '@features/grocery-list/entities/models';
import { GroceryTab } from '@features/grocery-list/entities/constants';
import { GroceryListActions } from '@features/grocery-list/store/grocery-list.actions';
import { groceryListFeature } from '@features/grocery-list/store/grocery-list.reducer';
import { GroceryItemComponent } from '@features/grocery-list/components/grocery-item/grocery-item.component';
import {
  GroceryFormComponent,
  GroceryFormDialogData,
} from '@features/grocery-list/components/grocery-form/grocery-form.component';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { form, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-grocery-list-container',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    TranslocoModule,
    GroceryItemComponent,
    LoaderComponent,
    EmptyStateComponent,
    MatFormField,
    MatInput,
    MatLabel,
    FormField,
  ],
  templateUrl: './grocery-list-container.component.html',
  styleUrl: './grocery-list-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroceryListContainerComponent {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);

  readonly items = this.store.selectSignal(groceryListFeature.selectAll);
  readonly loading = this.store.selectSignal(groceryListFeature.selectLoading);
  readonly error = this.store.selectSignal(groceryListFeature.selectError);
  readonly activeTab = this.store.selectSignal(groceryListFeature.selectActiveTab);

  protected readonly model = signal({ search: '' });
  protected readonly form = form(this.model);

  constructor() {
    effect(() => {
      this.store.dispatch(GroceryListActions.search({ value: this.model().search }));
    });
  }

  onTabChange(index: number) {
    const tab = index === 0 ? GroceryTab.PENDING : GroceryTab.BOUGHT;
    this.store.dispatch(GroceryListActions.setTab({ tab }));
  }

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
      .pipe(filter(Boolean))
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
    return this.dialog
      .open<GroceryFormComponent, GroceryFormDialogData, GroceryItemCreatePayload | null>(
        GroceryFormComponent,
        { data: { item: item || null } },
      )
      .afterClosed()
      .pipe(filter(Boolean));
  }
}
