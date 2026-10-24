// Gera legendas .srt a partir do timing alinhado: node scripts/gera-srt.mjs src/epNN/timing.json out/epNN/legendas.srt
import { readFileSync, writeFileSync } from 'node:fs';
const [entrada, saida] = process.argv.slice(2);
const { palavras } = JSON.parse(readFileSync(entrada, 'utf-8'));

// mesmas regras da Legenda: até 4 palavras, quebra após pontuação e entre blocos
const grupos = [];
let atual = [];
const fecha = () => { if (atual.length) grupos.push(atual); atual = []; };
palavras.forEach((p, i) => {
  if (atual.length && (atual[0].b !== p.b || atual.length >= 4)) fecha();
  atual.push(p);
  const prox = palavras[i + 1];
  if (/[.?!:]["”]?$/.test(p.t) || p.t.endsWith('...') || /,["”]?$/.test(p.t) || (prox && prox.b !== p.b)) fecha();
});
fecha();

const ts = (s) => {
  const ms = Math.max(0, Math.round(s * 1000));
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
  const sec = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
  return `${h}:${m}:${sec},${String(ms % 1000).padStart(3, '0')}`;
};
const srt = grupos.map((g, i) => {
  const ini = g[0].s;
  const prox = grupos[i + 1];
  const fim = prox ? Math.min(prox[0].s, g[g.length - 1].e + 0.6) : g[g.length - 1].e + 0.6;
  return `${i + 1}\n${ts(ini)} --> ${ts(fim)}\n${g.map((p) => p.t.replace(/["“”]/g, '')).join(' ')}\n`;
}).join('\n');
writeFileSync(saida, srt, 'utf-8');
console.log(`${grupos.length} legendas -> ${saida}`);
