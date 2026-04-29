export enum GroceryUnit {
  PIECES = 'pcs',
  KILOGRAMS = 'kg',
  GRAMS = 'g',
  LITERS = 'l',
  MILLILITERS = 'ml',
  PACK = 'pack',
  BUNCH = 'bunch',
  BOX = 'box',
}

export const GROCERY_UNITS: GroceryUnit[] = Object.values(GroceryUnit);

export const DEFAULT_GROCERY_UNIT = GroceryUnit.PIECES;
