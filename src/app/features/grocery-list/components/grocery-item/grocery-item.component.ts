import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';

import { GroceryItem, GroceryItemTogglePayload } from '@features/grocery-list/entities/models';

@Component({
  selector: 'app-grocery-item',
  imports: [MatButtonModule, MatCheckboxModule, MatIconModule, MatTooltipModule, TranslocoModule],
  templateUrl: './grocery-item.component.html',
  styleUrl: './grocery-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroceryItemComponent {
  readonly item = input.required<GroceryItem>();

  readonly toggleBought = output<GroceryItemTogglePayload>();
  readonly edit = output<GroceryItem>();
  readonly delete = output<string>();

  onToggle() {
    this.toggleBought.emit({ id: this.item().id, bought: !this.item().bought });
  }

  onEdit() {
    this.edit.emit(this.item());
  }

  onDelete() {
    this.delete.emit(this.item().id);
  }
}
