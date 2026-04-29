import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { TranslocoHttpLoader } from './transloco-loader.service';

describe('TranslocoHttpLoader', () => {
  let httpMock: any;

  beforeEach(() => {
    httpMock = {
      get: vi.fn().mockReturnValue(of({})),
    };

    TestBed.configureTestingModule({
      providers: [
        TranslocoHttpLoader,
        { provide: HttpClient, useValue: httpMock },
      ],
    });
  });

  it('should fetch translation file', () => {
    const loader = TestBed.inject(TranslocoHttpLoader);
    loader.getTranslation('en').subscribe();

    expect(httpMock.get).toHaveBeenCalledWith('/assets/i18n/en.json');
  });
});
