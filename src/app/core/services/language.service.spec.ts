import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { of } from 'rxjs';

import { Language, DEFAULT_LANGUAGE } from '@core/constants';

import { LanguageService, LANG_KEY } from './language.service';

describe('LanguageService', () => {
  let translocoServiceMock: any;

  beforeEach(() => {
    localStorage.clear();
    translocoServiceMock = {
      langChanges$: of(DEFAULT_LANGUAGE),
      getActiveLang: vi.fn().mockReturnValue(DEFAULT_LANGUAGE),
      setActiveLang: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        LanguageService,
        { provide: TranslocoService, useValue: translocoServiceMock },
      ],
    });
  });

  it('should initialize with default language if nothing in localStorage', () => {
    TestBed.inject(LanguageService);
    expect(translocoServiceMock.setActiveLang).toHaveBeenCalledWith(DEFAULT_LANGUAGE);
  });

  it('should initialize with stored language if valid', () => {
    localStorage.setItem(LANG_KEY, Language.UKRAINIAN);
    TestBed.inject(LanguageService);
    expect(translocoServiceMock.setActiveLang).toHaveBeenCalledWith(Language.UKRAINIAN);
  });

  it('should initialize with default language if stored language is invalid', () => {
    localStorage.setItem(LANG_KEY, 'invalid' as any);
    TestBed.inject(LanguageService);
    expect(translocoServiceMock.setActiveLang).toHaveBeenCalledWith(DEFAULT_LANGUAGE);
  });

  it('should set language and update localStorage', () => {
    const service = TestBed.inject(LanguageService);
    service.setLanguage(Language.UKRAINIAN);

    expect(translocoServiceMock.setActiveLang).toHaveBeenCalledWith(Language.UKRAINIAN);
    expect(localStorage.getItem(LANG_KEY)).toBe(Language.UKRAINIAN);
  });
});
