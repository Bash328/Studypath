// Local preview: serves public/ and the Worker's /api/* on one port, backed by SQLite
// loaded with the real seed. No Cloudflare account or `wrangler login` needed.
//   npm run preview            ->  http://localhost:8788
//
// This is for checking the site locally. Production is the Worker + D1 (see README).

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import worker from '../src/index.js';
import { createRealDb } from './d1-shim.mjs';

const PUBLIC = join(fileURLToPath(new URL('..', import.meta.url)), 'public');
const PORT = Number(process.env.PORT) || 8788;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.ico': 'image/x-icon',
};

const env = { DB: createRealDb() };

async function sendFile(res, file, status = 200) {
  const body = await readFile(file);
  res.writeHead(status, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
  res.end(body);
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname.startsWith('/api/')) {
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const request = new Request(url, {
        method: req.method,
        headers: req.headers,
        body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks),
      });
      const out = await worker.fetch(request, env, {});
      res.writeHead(out.status, Object.fromEntries(out.headers));
      return res.end(Buffer.from(await out.arrayBuffer()));
    }

    // Static files, with the same "/" -> index.html behaviour as the real host.
    let rel = decodeURIComponent(url.pathname).split('/').filter(Boolean).join('/');
    if (rel.includes('..')) { res.writeHead(400); return res.end('bad path'); }
    let file = join(PUBLIC, rel);
    const info = await stat(file).catch(() => null);
    if (info && info.isDirectory()) file = join(file, 'index.html');
    if (!(await stat(file).catch(() => null))) return sendFile(res, join(PUBLIC, '404.html'), 404);
    return sendFile(res, file);
  } catch (err) {
    console.error(err);
    res.writeHead(500); res.end('server error');
  }
}).listen(PORT, () => console.log(`Studypath preview on http://localhost:${PORT}  (real seed data, in-memory SQLite)`));
