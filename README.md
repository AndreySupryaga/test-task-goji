# Grocery List - Goji Labs Technical Assessment

A grocery list application built with Angular 21, NgRx, Angular Material, Transloco, JSON-server, and Vitest.

## Live Project

**The deployed project is available here: [https://test-task-goji.vercel.app/](https://test-task-goji.vercel.app/)**

## Tech Stack

| Concern | Technology |
|---|---|
| Framework | Angular 21 standalone components |
| Change detection | Zoneless Angular with `OnPush` components |
| State management | NgRx Store, Effects, Entity, Store Devtools |
| UI components | Angular Material |
| Forms | Angular signal forms |
| Internationalization | Transloco with English, German, and Ukrainian translations |
| Mock API | JSON-server |
| Testing | Vitest, jsdom, and Testing Library Angular |
| Styling | SCSS with CSS custom properties |

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer

The project is configured with `npm@11.11.0` in `package.json`.

## Setup

```bash
npm install
```

## Running The App

Start the Angular app and mock API together:

```bash
npm run dev
```

This runs:

- Angular dev server at `http://localhost:4200`
- JSON-server at `http://localhost:3000`

You can also run them separately:

```bash
npm run api
npm start
```

The API endpoint used by the app is `http://localhost:3000/items`.

## Available Scripts

| Script | Description |
|---|---|
| `npm start` | Starts the Angular dev server |
| `npm run api` | Starts JSON-server with `db.json` on port 3000 |
| `npm run dev` | Starts the API and Angular app together |
| `npm run build` | Builds the production app |
| `npm run watch` | Builds in watch mode with the development configuration |
| `npm test` | Runs unit tests |
| `npm run test:coverage` | Runs unit tests with coverage |

## Features

- **View** all grocery items
- **Add** new items (name, quantity, unit)
- **Edit** existing items via modal dialog
- **Delete** items with confirmation
- **Toggle bought** — checkbox marks items with strikethrough
- **Progress indicator** — "N of M items bought"
- **Empty state** when the list is empty
- **Light / Dark theme** switcher with localStorage persistence
- **Language switcher** — English, German, Ukrainian with localStorage persistence
- **Error state** with retry action
- **Loading indicators** with accessible ARIA live regions


## Architecture

### Angular App Configuration

The application is bootstrapped with `bootstrapApplication` and configured in `src/app/app.config.ts`.

Core providers include:

- `provideZonelessChangeDetection()`
- Angular Router with component input binding and view transitions
- `provideHttpClient()` with `apiErrorInterceptor`
- NgRx Store, Effects, and Store Devtools
- Transloco runtime translation loading

### Routing

The root route lazy-loads the grocery-list route configuration:

```txt
src/app/app.routes.ts
src/app/features/grocery-list/grocery-list.routes.ts
```

The grocery-list route lazy-loads `GroceryListPageComponent`.

### State Management

The grocery list state lives in:

```txt
src/app/features/grocery-list/store/
```

NgRx Entity stores the item collection and keeps CRUD reducers concise. The feature exposes adapter selectors plus computed selectors for:

- all items
- pending items
- bought items
- total count
- bought count
- loading state
- submitting state
- error state

Components read state with `store.selectSignal(...)` and dispatch typed actions from `GroceryListActions`.

### Effects And API

`GroceryListEffects` handles all API side effects:

- `loadItems`
- `addItem`
- `updateItem`
- `deleteItem`
- `toggleBought`

`switchMap` is used for loading so stale load requests can be cancelled. `exhaustMap` is used for mutations to avoid duplicate submissions while a request is in flight.

`GroceryApiService` talks to JSON-server with:

- `GET /items`
- `POST /items`
- `PATCH /items/:id`
- `DELETE /items/:id`

### UI Composition

`GroceryListPageComponent` dispatches the initial load. `GroceryListContainerComponent` owns the feature workflow, selects state from the store, opens dialogs, and dispatches actions.

Presentation and shared components are kept small:

- `GroceryItemComponent`
- `GroceryFormComponent`
- `ConfirmDialogComponent`
- `EmptyStateComponent`
- `LoaderComponent`

### Internationalization

Transloco loads translation JSON files from:

```txt
src/assets/i18n/en.json
src/assets/i18n/de.json
src/assets/i18n/uk.json
```

`LanguageService` initializes the active language from `localStorage`, falls back to English, and updates Transloco when the user changes languages.

### Theming

`ThemeService` stores the selected theme in `localStorage` and applies it with the `data-theme` attribute on `<html>`.

Global design tokens and theme values are defined in:

```txt
src/styles.scss
```

## Folder Structure

```txt
src/
  app/
    core/
      constants/       Shared constants for API, language, and theme
      interceptors/    API error normalization
      models/          Core shared models
      services/        Theme, language, and Transloco loader services
    features/
      grocery-list/
        components/    Grocery item, form, and list container components
        entities/      Grocery item models and constants
        pages/         Route-level grocery list page
        services/      Grocery API service
        store/         NgRx actions, reducer, selectors, and effects
    layout/
      header/          App header
      language-switcher/
      theme-switcher/
    shared/
      components/      Confirm dialog, empty state, and loader
  assets/
    i18n/              Transloco translation files
  styles.scss          Global styles and theme tokens
```

## Notes

- The app uses Angular Material for dialogs, form fields, buttons, icons, checkboxes, menus, toolbars, tooltips, and snackbars.
- Toggle bought is optimistic in the reducer. A failed toggle records an error and shows a snackbar, but it does not currently revert the previous local state.
- The API base URL is currently `http://localhost:3000` in `src/app/core/constants/api.constants.ts`.
- The JSON-server database is local development data and may change while testing the app.
