// Renderiza quadros soltos para revisão: node scripts/quadros.mjs pasta t1 t2 ... (em segundos)
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition, openBrowser } from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const [pasta, ...ts] = process.argv.slice(2);
fs.mkdirSync(pasta, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const browser = await openBrowser('chrome', { chromiumOptions: { gl: 'angle' } });
const comp = await selectComposition({ serveUrl, id: 'Caminhao', puppeteerInstance: browser, chromiumOptions: { gl: 'angle' } });
for (const t of ts) {
  const frame = Math.min(comp.durationInFrames - 1, Math.round(parseFloat(t) * 30));
  const out = path.join(pasta, `t${String(t).replace('.', '_').padStart(5, '0')}.jpg`);
  await renderStill({ composition: comp, serveUrl, frame, output: out, imageFormat: 'jpeg', jpegQuality: 80, puppeteerInstance: browser, onBrowserLog: (l) => { if (l.text.includes('logo')) console.log(l.text); }, chromiumOptions: { gl: 'angle' } });
  console.log(out);
}
await browser.close({ silent: true });
