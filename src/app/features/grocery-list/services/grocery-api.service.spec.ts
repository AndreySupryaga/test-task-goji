import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { API_BASE, GROCERY_ITEMS_ENDPOINT } from '@core/constants';

import { GroceryItem } from '@features/grocery-list/entities/models';
import { DEFAULT_GROCERY_UNIT } from '@features/grocery-list/entities/constants';

import { GroceryApiService } from './grocery-api.service';

const mockItem: GroceryItem = {
  id: '1',
  name: 'Apples',
  quantity: 6,
  unit: DEFAULT_GROCERY_UNIT,
  bought: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('GroceryApiService', () => {
  let service: GroceryApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GroceryApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(GroceryApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAll', () => {
    it('makes GET request to /items and returns items', () => {
      service.getAll().subscribe((items) => {
        expect(items).toEqual([mockItem]);
      });

      const req = httpMock.expectOne(`${API_BASE}/${GROCERY_ITEMS_ENDPOINT}`);
      expect(req.request.method).toBe('GET');
      req.flush([mockItem]);
    });
  });

  describe('create', () => {
    it('makes POST request to /items with timestamps', () => {
      const payload = { name: 'Apples', quantity: 6, unit: DEFAULT_GROCERY_UNIT, bought: false };

      service.create(payload).subscribe((item) => {
        expect(item.name).toBe('Apples');
        expect(item.createdAt).toBeDefined();
        expect(item.updatedAt).toBeDefined();
      });

      const req = httpMock.expectOne(`${API_BASE}/${GROCERY_ITEMS_ENDPOINT}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.name).toBe('Apples');
      expect(req.request.body.createdAt).toBeDefined();
      req.flush(mockItem);
    });
  });

  describe('update', () => {
    it('makes PATCH request to /items/:id', () => {
      const payload = { id: '1', name: 'Green Apples' };

      service.update(payload).subscribe((item) => {
        expect(item.name).toBe('Green Apples');
      });

      const req = httpMock.expectOne(`${API_BASE}/${GROCERY_ITEMS_ENDPOINT}/1`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body.name).toBe('Green Apples');
      expect(req.request.body.updatedAt).toBeDefined();
      req.flush({ ...mockItem, name: 'Green Apples' });
    });
  });

  describe('delete', () => {
    it('makes DELETE request to /items/:id', () => {
      service.delete('1').subscribe();

      const req = httpMock.expectOne(`${API_BASE}/${GROCERY_ITEMS_ENDPOINT}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
