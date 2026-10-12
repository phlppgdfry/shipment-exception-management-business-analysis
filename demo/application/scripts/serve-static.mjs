#!/usr/bin/env node
// Serves the static export (out/) under the same base path GitHub Pages uses, for e2e tests and local preview.
//   BASE_PATH=/shipment-exception-management-business-analysis/control-tower npm run build && npm run serve
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../out", import.meta.url));
const base = process.env.BASE_PATH ?? "";
const port = Number(process.env.PORT ?? 4173);
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".json": "application/json", ".txt": "text/plain", ".ico": "image/x-icon", ".woff2": "font/woff2", ".png": "image/png" };

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  let path = decodeURIComponent(url.pathname);
  if (base && !path.startsWith(base)) {
    res.writeHead(302, { location: `${base}/` }).end();
    return;
  }
  path = normalize(path.slice(base.length) || "/");
  let file = join(root, path);
  if (!file.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file)) {
    res.writeHead(404, { "content-type": TYPES[".html"] });
    createReadStream(join(root, "404.html")).pipe(res);
    return;
  }
  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Serving ${root} at http://localhost:${port}${base}/`));
