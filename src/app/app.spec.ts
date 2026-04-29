import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideRouter } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { TranslocoTestingModule, TranslocoTestingOptions } from '@jsverse/transloco';

import { Language, DEFAULT_LANGUAGE } from '@core/constants';
import en from '@assets/i18n/en.json';

import { groceryListFeature } from '@features/grocery-list/store/grocery-list.reducer';

import { App } from './app';

const translocoOptions: TranslocoTestingOptions = {
  langs: { [Language.ENGLISH]: en },
  translocoConfig: { availableLangs: [Language.ENGLISH], defaultLang: DEFAULT_LANGUAGE },
};

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        TranslocoTestingModule.forRoot(translocoOptions),
      ],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideStore({ [groceryListFeature.name]: groceryListFeature.reducer }),
        provideEffects([]),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the header', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
  });
});
