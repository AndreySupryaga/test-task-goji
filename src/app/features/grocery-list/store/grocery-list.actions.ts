import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  GroceryItem,
  GroceryItemCreatePayload,
  GroceryItemTogglePayload,
  GroceryItemUpdatePayload,
} from '@features/grocery-list/entities/models';

export const GroceryListActions = createActionGroup({
  source: 'Grocery List',
  events: {
    'Load Items': emptyProps(),
    'Load Items Success': props<{ items: GroceryItem[] }>(),
    'Load Items Failure': props<{ error: string }>(),

    'Add Item': props<{ payload: GroceryItemCreatePayload }>(),
    'Add Item Success': props<{ item: GroceryItem }>(),
    'Add Item Failure': props<{ error: string }>(),

    'Update Item': props<{ payload: GroceryItemUpdatePayload }>(),
    'Update Item Success': props<{ item: GroceryItem }>(),
    'Update Item Failure': props<{ error: string }>(),

    'Delete Item': props<{ id: string }>(),
    'Delete Item Success': props<{ id: string }>(),
    'Delete Item Failure': props<{ error: string }>(),

    'Toggle Bought': props<GroceryItemTogglePayload>(),
    'Toggle Bought Success': props<{ item: GroceryItem }>(),
    'Toggle Bought Failure': props<{ id: string; previousBought: boolean; error: string }>(),
  },
});
