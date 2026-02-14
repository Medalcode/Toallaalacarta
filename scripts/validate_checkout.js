#!/usr/bin/env node
const fs = require('fs');
const { URL } = require('url');

const BASE_URL = process.env.BASE_URL || process.env.STAGING_BASE_URL || process.env.VERCEL_URL || process.env.NETLIFY_URL;
const LOG_PATH = `validate-checkout-${Date.now()}.log`;

function log(...args) {
  const line = `[${new Date().toISOString()}] ${args.join(' ')}\n`;
  process.stdout.write(line);
  fs.appendFileSync(LOG_PATH, line);
}

async function fetchWithTimeout(url, opts = {}, timeout = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { signal: controller.signal, ...opts });
  } finally {
    clearTimeout(id);
  }
}

async function checkEndpoint(path) {
  const target = new URL(path, BASE_URL).toString();
  try {
    log('Checking', target);
    const res = await fetchWithTimeout(target, { method: 'GET' }, 10000);
    log('->', res.status, res.statusText);
    return res.status >= 200 && res.status < 400;
  } catch (err) {
    log('ERROR', err.message || err);
    return false;
  }
}

async function run() {
  if (!BASE_URL) {
    console.error('BASE_URL, STAGING_BASE_URL o NETLIFY_URL no está definido. Setear env var y reintentar.');
    process.exit(2);
  }

  log('Starting validate-checkout against', BASE_URL);

  // Prefer explicit health endpoints if present
  const candidates = ['/api/checkout/health', '/api/health', '/api', '/'];

  let ok = false;
  for (const p of candidates) {
    try {
      const result = await checkEndpoint(p);
      if (result) { ok = true; break; }
    } catch (e) {}
  }

  if (!ok) {
    log('No health endpoints responded successfully. Abort.');
    log('Log saved to', LOG_PATH);
    process.exit(2);
  }

  // Placeholder for a full checkout simulation. Keep minimal and safe.
  // If the project exposes a safe test checkout endpoint, set env var TEST_CHECKOUT_PATH
  const testPath = process.env.TEST_CHECKOUT_PATH || '/api/checkout/test';
  const url = new URL(testPath, BASE_URL).toString();
  try {
    log('Attempting test checkout at', url);
    const res = await fetchWithTimeout(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ test: true }) }, 15000);
    log('Test checkout status', res.status);
    if (res.ok) {
      const body = await res.text();
      log('Response body (truncated):', body.slice(0, 200));
      log('validate-checkout: OK');
      log('Log saved to', LOG_PATH);
      process.exit(0);
    } else {
      log('Test checkout failed with status', res.status);
      log('Log saved to', LOG_PATH);
      process.exit(2);
    }
  } catch (err) {
    log('Test checkout error', err.message || err);
    log('Log saved to', LOG_PATH);
    process.exit(2);
  }
}

// Node 18+ has fetch globally. If not, instruct user to run with node 18.
if (typeof fetch === 'undefined') {
  console.error('fetch no está disponible en este runtime. Usa Node 18+ o instala un polyfill.');
  process.exit(2);
}

run();
