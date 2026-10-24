// Renderiza frames avulsos (em segundos) de uma composição: node scripts/frames.mjs Ep01 pasta 1 4.5 ...
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import { mkdirSync } from 'node:fs';
const [comp, outDir, ...secs] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const composition = await selectComposition({ serveUrl, id: comp });
for (const s of secs) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(Number(s) * composition.fps));
  await renderStill({ composition, serveUrl, frame, output: path.join(outDir, `f_${String(s).padStart(6, '0')}.png`), scale: 0.5 });
  process.stdout.write(s + ' ');
}
