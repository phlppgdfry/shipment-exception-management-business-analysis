#!/usr/bin/env node
// Serves the static site (repository /site) under the GitHub Pages base path, for the site tests.
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../../site", import.meta.url));
const base = "/shipment-exception-management-business-analysis";
const port = Number(process.env.PORT ?? 4176);
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".json": "application/json", ".png": "image/png", ".mp4": "video/mp4" };

createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url ?? "/", "http://localhost").pathname);
  if (!path.startsWith(base)) return void res.writeHead(404).end();
  let file = join(root, normalize(path.slice(base.length) || "/"));
  if (!file.startsWith(root)) return void res.writeHead(403).end();
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file)) return void res.writeHead(404, { "content-type": TYPES[".html"] }).end("<!doctype html><title>404</title><h1>Not found</h1>");
  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Serving ${root} at http://localhost:${port}${base}/`));
