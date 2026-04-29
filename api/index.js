import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const DB_PATH = path.join(process.cwd(), 'db.json');

function loadInitialItems() {
  try {
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    return Array.isArray(db.items) ? db.items : [];
  } catch (error) {
    console.error('Failed to read db.json:', error);
    return [];
  }
}

const store = globalThis.__gojiGroceryStore ?? {
  items: structuredClone(loadInitialItems()),
};

globalThis.__gojiGroceryStore = store;

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

function sendEmpty(res, statusCode) {
  res.statusCode = statusCode;
  res.setHeader('Cache-Control', 'no-store');
  res.end();
}

function normalizePath(req) {
  const requestUrl = new URL(req.url ?? '/', 'https://goji-labs-test-task.vercel.app');
  let pathname = requestUrl.pathname;

  if (pathname === '/api/index.js') {
    pathname = '/';
  } else if (pathname.startsWith('/api/')) {
    pathname = pathname.slice('/api'.length);
  } else if (pathname === '/api') {
    pathname = '/';
  }

  return pathname.replace(/\/+$/, '') || '/';
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  if (typeof req.body === 'string') {
    return req.body ? JSON.parse(req.body) : {};
  }

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString('utf-8');
  return rawBody ? JSON.parse(rawBody) : {};
}

function findItem(id) {
  return store.items.find((item) => String(item.id) === String(id));
}

function itemRoute(pathname) {
  const match = pathname.match(/^\/items(?:\/([^/]+))?$/);
  return match ? { id: match[1] } : null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    sendEmpty(res, 204);
    return;
  }

  try {
    const pathname = normalizePath(req);
    const route = itemRoute(pathname);

    if (!route) {
      sendJson(res, 404, { error: 'Not Found' });
      return;
    }

    const { id } = route;

    if (req.method === 'GET' && !id) {
      sendJson(res, 200, store.items);
      return;
    }

    if (req.method === 'GET' && id) {
      const item = findItem(id);
      sendJson(res, item ? 200 : 404, item ?? { error: 'Not Found' });
      return;
    }

    if (req.method === 'POST' && !id) {
      const body = await readBody(req);
      const item = { ...body, id: body.id ?? randomUUID() };

      store.items.push(item);
      sendJson(res, 201, item);
      return;
    }

    if ((req.method === 'PUT' || req.method === 'PATCH') && id) {
      const index = store.items.findIndex((item) => String(item.id) === String(id));

      if (index === -1) {
        sendJson(res, 404, { error: 'Not Found' });
        return;
      }

      const body = await readBody(req);
      const item =
        req.method === 'PATCH'
          ? { ...store.items[index], ...body, id }
          : { ...body, id };

      store.items.splice(index, 1, item);
      sendJson(res, 200, item);
      return;
    }

    if (req.method === 'DELETE' && id) {
      const index = store.items.findIndex((item) => String(item.id) === String(id));

      if (index === -1) {
        sendJson(res, 404, { error: 'Not Found' });
        return;
      }

      store.items.splice(index, 1);
      sendEmpty(res, 204);
      return;
    }

    sendJson(res, 405, { error: 'Method Not Allowed' });
  } catch (error) {
    console.error('API Error:', error);
    sendJson(res, 500, {
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
