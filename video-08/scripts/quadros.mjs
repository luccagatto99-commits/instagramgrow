// Renderiza quadros soltos para revisão: node scripts/quadros.mjs pasta t1 t2 ... (em segundos)
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition, openBrowser } from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const [pasta, ...ts] = process.argv.slice(2);
fs.mkdirSync(pasta, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
// no Linux sem GPU: GL=swangle CHROME=/caminho/do/chrome-headless-shell node scripts/quadros.mjs ...
const gl = process.env.GL ?? 'angle';
const ignoreCertificateErrors = Boolean(process.env.SEM_CERT); // só em ambiente com proxy que troca o certificado
const browser = await openBrowser('chrome', { browserExecutable: process.env.CHROME ?? null, chromiumOptions: { gl, ignoreCertificateErrors } });
const comp = await selectComposition({ serveUrl, id: 'Fechadura', puppeteerInstance: browser, chromiumOptions: { gl, ignoreCertificateErrors } });
for (const t of ts) {
  const frame = Math.min(comp.durationInFrames - 1, Math.round(parseFloat(t) * 30));
  const out = path.join(pasta, `t${String(t).replace('.', '_').padStart(5, '0')}.jpg`);
  await renderStill({ composition: comp, serveUrl, frame, output: out, imageFormat: 'jpeg', jpegQuality: 80, puppeteerInstance: browser, onBrowserLog: (l) => { if (l.text.includes('logo')) console.log(l.text); }, chromiumOptions: { gl, ignoreCertificateErrors } });
  console.log(out);
}
await browser.close({ silent: true });
