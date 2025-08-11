#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const workspaceRoot = process.cwd();
const assetsDirs = [
  path.join(workspaceRoot, 'assets'),
  path.join(workspaceRoot, 'assets', 'photos'),
];

const imageExts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.svg']);

function listImagesRecursive(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      results.push(...listImagesRecursive(full));
    } else if (ent.isFile()) {
      const ext = path.extname(ent.name).toLowerCase();
      if (imageExts.has(ext)) {
        const rel = path.relative(workspaceRoot, full).replace(/\\/g, '/');
        // Ensure leading slash for absolute path on Netlify
        results.push('/' + rel);
      }
    }
  }
  return results;
}

function unique(arr) { return Array.from(new Set(arr)); }

function main() {
  const images = unique(assetsDirs.flatMap(listImagesRecursive));
  const manifestPath = path.join(workspaceRoot, 'assets', 'manifest.json');
  if (!fs.existsSync(path.dirname(manifestPath))) {
    fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  }
  fs.writeFileSync(manifestPath, JSON.stringify({ images }, null, 2));
  console.log(`Wrote manifest with ${images.length} images at assets/manifest.json`);
}

main();