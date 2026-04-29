import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { ThemeService } from '@core/services';

function createService(): ThemeService {
  TestBed.configureTestingModule({
    providers: [ThemeService, provideZonelessChangeDetection()],
  });
  return TestBed.inject(ThemeService);
}

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('defaults to light theme when no localStorage entry', () => {
    const service = createService();
    expect(service.theme()).toBe('light');
  });

  it('loads dark theme from localStorage', () => {
    localStorage.setItem('grocery-theme', 'dark');
    const service = createService();
    expect(service.theme()).toBe('dark');
  });

  it('loads light theme from localStorage', () => {
    localStorage.setItem('grocery-theme', 'light');
    const service = createService();
    expect(service.theme()).toBe('light');
  });

  it('toggle switches light to dark', () => {
    localStorage.setItem('grocery-theme', 'light');
    const service = createService();
    service.toggle();
    expect(service.theme()).toBe('dark');
  });

  it('toggle switches dark to light', () => {
    localStorage.setItem('grocery-theme', 'dark');
    const service = createService();
    service.toggle();
    expect(service.theme()).toBe('light');
  });

  it('persists toggled theme to localStorage', () => {
    localStorage.setItem('grocery-theme', 'light');
    const service = createService();
    service.toggle();
    TestBed.flushEffects();
    expect(localStorage.getItem('grocery-theme')).toBe('dark');
  });

  it('applies data-theme attribute to documentElement', () => {
    localStorage.setItem('grocery-theme', 'dark');
    createService();
    TestBed.flushEffects();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
