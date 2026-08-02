// Copies the pdf.js worker build into public/ so it can be served as a
// plain static asset at /pdf.worker.min.mjs (avoids bundler-specific
// worker-loading configuration for pdfjs-dist).
import fs from 'node:fs';
import path from 'node:path';

const src = path.join(process.cwd(), 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs');
const dest = path.join(process.cwd(), 'public', 'pdf.worker.min.mjs');

fs.copyFileSync(src, dest);
console.log('Copied pdfjs-dist worker to public/pdf.worker.min.mjs');
