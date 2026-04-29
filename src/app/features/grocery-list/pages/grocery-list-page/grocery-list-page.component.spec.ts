import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslocoTestingModule, TranslocoTestingOptions } from '@jsverse/transloco';
import { TestBed } from '@angular/core/testing';

import { Language, DEFAULT_LANGUAGE } from '@core/constants';
import { adapter, groceryListFeature, GroceryListState } from '@features/grocery-list/store/grocery-list.reducer';
import en from '@assets/i18n/en.json';

import { GroceryListPageComponent } from './grocery-list-page.component';

const translocoOptions: TranslocoTestingOptions = {
  langs: { [Language.ENGLISH]: en },
  translocoConfig: { availableLangs: [Language.ENGLISH], defaultLang: DEFAULT_LANGUAGE },
};

const initialState: GroceryListState = adapter.getInitialState({
  loading: false,
  submitting: false,
  error: null,
});

describe('GroceryListPageComponent', () => {
  let store: MockStore;

  beforeEach(async () => {
    await render(GroceryListPageComponent, {
      imports: [
        TranslocoTestingModule.forRoot(translocoOptions),
      ],
      providers: [
        provideZonelessChangeDetection(),
        provideMockStore({
          initialState: { [groceryListFeature.name]: initialState },
        }),
      ],
    });

    store = TestBed.inject(MockStore);
  });

  it('should create the page component', () => {
    expect(screen.getByRole('main')).toBeTruthy();
  });

  it('dispatches loadItems action on initialization', () => {
    expect(store).toBeTruthy();
  });

  it('renders the grocery list container', () => {
    expect(screen.getByRole('main')).toBeTruthy();
  });
});
