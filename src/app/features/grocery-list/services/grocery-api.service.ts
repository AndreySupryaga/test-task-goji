import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  GroceryItem,
  GroceryItemCreatePayload,
  GroceryItemUpdatePayload,
} from '@features/grocery-list/entities/models';
import { API_BASE, GROCERY_ITEMS_ENDPOINT } from '@core/constants';

@Injectable({ providedIn: 'root' })
export class GroceryApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${API_BASE}/${GROCERY_ITEMS_ENDPOINT}`;

  getAll(): Observable<GroceryItem[]> {
    return this.http.get<GroceryItem[]>(this.endpoint);
  }

  create(payload: GroceryItemCreatePayload): Observable<GroceryItem> {
    const now = new Date().toISOString();
    return this.http.post<GroceryItem>(this.endpoint, {
      ...payload,
      createdAt: now,
      updatedAt: now,
    });
  }

  update(payload: GroceryItemUpdatePayload): Observable<GroceryItem> {
    const { id, ...changes } = payload;
    return this.http.patch<GroceryItem>(`${this.endpoint}/${id}`, {
      ...changes,
      updatedAt: new Date().toISOString(),
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
