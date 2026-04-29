import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, min, minLength, required, submit } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@jsverse/transloco';

import { GroceryItem, GroceryItemCreatePayload } from '@features/grocery-list/entities/models';
import { DEFAULT_GROCERY_UNIT, GROCERY_UNITS } from '@features/grocery-list/entities/constants';

export interface GroceryFormDialogData {
  item: GroceryItem | null;
}

@Component({
  selector: 'app-grocery-form',
  imports: [
    FormField,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    TranslocoModule,
  ],
  templateUrl: './grocery-form.component.html',
  styleUrl: './grocery-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroceryFormComponent {
  protected readonly dialogRef = inject(MatDialogRef<GroceryFormComponent>);
  private readonly data = inject<GroceryFormDialogData>(MAT_DIALOG_DATA);

  protected readonly units = GROCERY_UNITS;

  get titleText(): string {
    return !!this.data.item ? 'grocery.editItem' : 'grocery.addItem';
  }

  get buttonText(): string {
    return !!this.data.item ? 'form.save' : 'form.add';
  }

  protected readonly model = signal({
    name: this.data.item?.name ?? '',
    quantity: this.data.item?.quantity ?? 1,
    unit: this.data.item?.unit ?? DEFAULT_GROCERY_UNIT,
    bought: this.data.item?.bought ?? false,
  });

  protected readonly groceryForm = form<GroceryItemCreatePayload>(this.model, (s) => {
    required(s.name, { message: 'form.validation.nameRequired' });
    minLength(s.name, 2, { message: 'form.validation.nameMinLength' });
    required(s.quantity, { message: 'form.validation.quantityRequired' });
    min(s.quantity, 0.1, { message: 'form.validation.quantityMin' });
    required(s.unit, { message: 'form.validation.unitRequired' });
  });

  onSubmit(): boolean {
    submit(this.groceryForm, async () => {
      this.dialogRef.close(this.model());
    });
    return false;
  }
}
