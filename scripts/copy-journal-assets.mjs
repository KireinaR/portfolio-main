// Copies every non-markdown file (images, etc.) that lives alongside a
// journal post's index.md into public/journal/, mirroring the source
// folder structure, so posts can reference them with a plain relative
// path (e.g. ![Alt text](photo.jpg)) and have it resolve at /journal/<slug>/photo.jpg.
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.join(process.cwd(), 'journal');
const DEST = path.join(process.cwd(), 'public', 'journal');

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (!entry.name.endsWith('.md')) {
      fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(SRC, DEST);
console.log('Copied journal post images to public/journal/');
