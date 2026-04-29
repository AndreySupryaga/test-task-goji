export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  bought: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GroceryItemCreatePayload = Omit<GroceryItem, 'id' | 'createdAt' | 'updatedAt'>;
export type GroceryItemTogglePayload = Pick<GroceryItem, 'id' | 'bought'>;
export type GroceryItemUpdatePayload = Partial<GroceryItemCreatePayload> & { id: string };
