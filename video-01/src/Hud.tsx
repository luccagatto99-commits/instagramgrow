import { AbsoluteFill, Img, staticFile } from 'remotion';
import { loadFont as archivoBlack } from '@remotion/google-fonts/ArchivoBlack';
import { loadFont as archivo } from '@remotion/google-fonts/Archivo';
import { loadFont as mono } from '@remotion/google-fonts/JetBrainsMono';
import { B, BE, BLOCOS, DURACAO, PALAVRAS, T, clamp, janela, lerp, prog, saida } from './tempo';
import { COR, DETALHE, Estado, SENSOR, X_CEL } from './estado';
import { Cam, projetar } from './camera';

const { fontFamily: TITULO } = archivoBlack('normal', { weights: ['400'], subsets: ['latin', 'latin-ext'] });
const { fontFamily: TEXTO } = archivo('normal', { weights: ['500', '700'], subsets: ['latin', 'latin-ext'] });
const { fontFamily: MONO } = mono('normal', { weights: ['500', '700'], subsets: ['latin', 'latin-ext'] });

const CARTAO = 'rgba(19,35,58,0.92)';
const BORDA = '1px solid rgba(143,184,255,0.3)';

// ---------------- marca + cronômetro ----------------
const Marca: React.FC<{ v: number }> = ({ v }) => (
  <div style={{ position: 'absolute', left: 56, top: 240, display: 'flex', alignItems: 'center', gap: 12, opacity: v, padding: '8px 18px 8px 10px', borderRadius: 16, background: 'rgba(14,26,43,0.88)', border: BORDA }}>
    <Img src={staticFile('cubo.png')} style={{ width: 58 }} />
    <div style={{ fontFamily: TITULO, fontSize: 36, color: COR.objeto, letterSpacing: -0.5 }}>
      fabriq<span style={{ color: COR.move }}>sabia?</span>
    </div>
  </div>
);

const Cronometro: React.FC<{ t: number }> = ({ t }) => {
  const fim = DURACAO - 1.2;
  const resta = Math.max(0, Math.ceil((1 - t / fim) * 90));
  const fr = clamp(1 - t / fim);
  const r = 54, c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'absolute', left: 796, top: 222, width: 140, height: 140 }}>
      <svg width={140} height={140}>
        <circle cx={70} cy={70} r={r} fill="rgba(19,35,58,0.9)" stroke="rgba(143,184,255,0.18)" strokeWidth={8} />
        <circle cx={70} cy={70} r={r} fill="none" stroke={COR.rotulo} strokeWidth={8} strokeLinecap="round"
          strokeDasharray={`${c * fr} ${c}`} transform="rotate(-90 70 70)" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 46, color: COR.objeto, lineHeight: 1 }}>{resta}</div>
        <div style={{ fontFamily: MONO, fontSize: 16, letterSpacing: 3, color: COR.rotulo, marginTop: 2 }}>SEG</div>
      </div>
    </div>
  );
};

// ---------------- legenda ----------------
type Trecho = { ws: typeof PALAVRAS; s: number; e: number };
const MAX = 27;
const LIGA = new Set(['a', 'o', 'as', 'os', 'um', 'uma', 'de', 'do', 'da', 'que', 'e', 'pelos', 'no', 'na', 'em', 'com', 'por', 'para', 'até', 'num', 'nos']);
const TRECHOS: Trecho[] = (() => {
  const out: Trecho[] = [];
  const empurra = (ws: typeof PALAVRAS) => { if (ws.length) out.push({ ws, s: ws[0].s, e: ws[ws.length - 1].e }); };
  const tam = (ws: typeof PALAVRAS) => ws.map((x) => x.t).join(' ').length;
  const divide = (ws: typeof PALAVRAS) => {
    if (tam(ws) <= MAX || ws.length < 4) return empurra(ws);
    let melhor = 1, dif = Infinity;
    for (let k = 2; k <= ws.length - 2; k++) {
      const fim = ws[k - 1].t.toLowerCase();
      const d = Math.abs(tam(ws.slice(0, k)) - tam(ws.slice(k))) + (LIGA.has(fim) || /^[0-9]+$/.test(fim) ? 14 : 0);
      if (d < dif) { dif = d; melhor = k; }
    }
    divide(ws.slice(0, melhor));
    divide(ws.slice(melhor));
  };
  for (let b = 0; b < BLOCOS.length; b++) {
    const ws = PALAVRAS.filter((w) => w.b === b);
    let frase: typeof PALAVRAS = [];
    const frases: (typeof PALAVRAS)[] = [];
    ws.forEach((w) => { frase.push(w); if (/[.?!:]$/.test(w.t)) { frases.push(frase); frase = []; } });
    if (frase.length) frases.push(frase);
    for (const f of frases) {
      if (tam(f) <= MAX) { empurra(f); continue; }
      let parte: typeof PALAVRAS = [];
      const partes: (typeof PALAVRAS)[] = [];
      f.forEach((w) => { parte.push(w); if (/,$/.test(w.t)) { partes.push(parte); parte = []; } });
      if (parte.length) partes.push(parte);
      let acum: typeof PALAVRAS = [];
      for (const pt of partes) {
        if (acum.length && tam(acum) > 9 && tam([...acum, ...pt]) > MAX) { divide(acum); acum = []; }
        acum = [...acum, ...pt];
      }
      divide(acum);
    }
  }
  return out;
})();

const Legenda: React.FC<{ t: number }> = ({ t }) => {
  const i = TRECHOS.findIndex((x, k) => t >= x.s - 0.08 && (k + 1 >= TRECHOS.length || t < TRECHOS[k + 1].s - 0.08));
  if (i < 0) return null;
  const tr = TRECHOS[i];
  if (t > tr.e + 0.9) return null;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1420, display: 'flex', justifyContent: 'center' }}>
      <div style={{
        maxWidth: 860, padding: '12px 26px 15px', borderRadius: 18, background: 'rgba(14,26,43,0.78)', border: BORDA,
        fontFamily: TITULO, fontSize: 50, lineHeight: 1.15, letterSpacing: -0.5, textAlign: 'center',
      }}>
        {tr.ws.map((w, k) => (
          <span key={k} style={{ color: t >= w.s - 0.04 ? COR.objeto : '#5D6D86' }}>
            {w.t}{k < tr.ws.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </div>
  );
};

// ---------------- etiquetas presas ao 3D ----------------
type P3 = [number, number, number];
type Et = { txt: string; p: (e: Estado) => P3; a: number; b: number; acc?: boolean };
const BASE = 0.25;
const X_TV_ = 7.2; // controle de pé: y da base
const etiquetas = (): Et[] => [
  { txt: 'TAMPA', p: (e) => [0.3, BASE + 2.55 + 0.22 * e.destaque.tampa, 0.13 + e.off.tampa], a: T(1, 'tampa') - 0.1, b: T(1, 'botões') - 0.15, acc: true },
  { txt: 'BOTÕES DE BORRACHA', p: (e) => [0.3, BASE + 2.55 + 0.22 * e.destaque.borracha, 0.1 + e.off.borracha], a: T(1, 'botões') - 0.1, b: T(1, 'placa') - 0.15, acc: true },
  { txt: 'PLACA DE CIRCUITO', p: (e) => [0.3, BASE + 2.55 + 0.22 * e.destaque.placa, 0.02 + e.off.placa], a: T(1, 'placa') - 0.1, b: T(1, 'fundo') - 0.15, acc: true },
  { txt: 'FUNDO + PILHAS', p: (e) => [0.3, BASE + 2.55 + 0.22 * e.destaque.fundo, -0.1 + e.off.fundo], a: T(1, 'fundo') - 0.1, b: BE(1) + 0.4, acc: true },
  { txt: 'VOL +', p: (e) => [-0.18, BASE + 0.62 + 0.22 * e.destaque.botao, 0.25 + e.off.borracha], a: B(2) - 0.1, b: T(2, 'pontinho') - 0.6, acc: true },
  { txt: 'BOTÃO DE BORRACHA', p: () => [DETALHE.x + 0.1, 1.2, DETALHE.z - 0.1], a: T(2, 'pontinho') - 0.2, b: T(2, 'carbono') - 0.2 },
  { txt: 'CARBONO', p: (e) => [DETALHE.x - 0.05, 0.82 - 0.25 * e.aperto, DETALHE.z + 0.05], a: T(2, 'carbono') - 0.25, b: T(2, 'Quando') - 0.1, acc: true },
  { txt: 'DOIS CAMINHOS DE METAL', p: () => [DETALHE.x - 0.55, 0.42, DETALHE.z + 0.45], a: T(2, 'caminhos') - 0.1, b: T(2, 'corrente') - 0.3 },
  { txt: 'A CORRENTE PASSA', p: () => [DETALHE.x - 0.55, 0.42, DETALHE.z + 0.45], a: T(2, 'corrente') - 0.15, b: B(3) - 0.2, acc: true },
  { txt: 'CHIP', p: (e) => [0, BASE + 0.2 + 0.16, 0.06 + 0.16 * e.destaque.chip], a: T(3, 'chip') - 0.1, b: BE(3) + 0.3, acc: true },
  { txt: 'LED', p: (e) => [0.12, BASE + 2.36 + 0.12 * e.destaque.led + 0.1, 0.08 + 0.12 * e.destaque.led], a: T(4, 'LED') - 0.1, b: T(4, 'Ele') - 0.3, acc: true },
  { txt: 'INFRAVERMELHO', p: () => [2.3, 1.55, 0.3], a: T(4, 'infravermelha') - 0.2, b: B(5) + 0.4 },
  { txt: 'JANELINHA', p: () => [SENSOR.x, SENSOR.y + 0.16, SENSOR.z], a: T(5, 'janelinha') - 0.1, b: T(5, 'sensor') + 0.2 },
  { txt: 'SENSOR', p: (e) => [SENSOR.x - 0.1 * e.destaque.sensor, SENSOR.y + 0.17, SENSOR.z], a: T(5, 'sensor') - 0.1, b: T(5, 'sol') - 0.3, acc: true },
  { txt: 'LUZ PARADA DO SOL', p: () => [X_TV_ - 0.6, 2.36, 0.35], a: T(5, 'sol') - 0.1, b: T(5, 'sensor', 1) },
  { txt: 'IGNORADA', p: () => [SENSOR.x, SENSOR.y + 0.2, SENSOR.z + 0.15], a: T(5, 'atrapalham') - 0.4, b: T(5, 'sensor', 1) },
  { txt: 'VOL +', p: () => [SENSOR.x, SENSOR.y + 0.3, SENSOR.z - 0.2], a: T(5, 'volta') - 0.1, b: BE(5) + 0.5, acc: true },
  { txt: 'CÂMERA DO CELULAR', p: () => [X_CEL - 0.1, 2.12, 0.3], a: T(6, 'câmera') - 0.1, b: T(6, 'Ela') + 0.1, acc: true },
  { txt: 'A LUZ APARECE', p: () => [X_CEL + 0.05, 1.55, 0.05], a: T(6, 'aparece') - 0.1, b: BE(6) + 0.4, acc: true },
  { txt: 'OU A CÂMERA DA FRENTE', p: () => [X_CEL + 0.05, 0.6, 0.05], a: T(6, 'tente') - 0.1, b: BE(6) + 0.4 },
];
let ETS: Et[] | null = null;

const Etiquetas: React.FC<{ t: number; cam: Cam; e: Estado }> = ({ t, cam, e }) => (
  <>
    {(ETS ??= etiquetas()).map((et, i) => {
      const v = janela(t, et.a, et.b, 0.25, 0.25);
      if (v <= 0.001) return null;
      const { x, y, frente } = projetar(cam, et.p(e));
      if (!frente || x < 60 || x > 1020) return null;
      const borda = clamp(Math.min(x - 60, 1020 - x) / 90);
      return (
        <div key={i} style={{
          position: 'absolute', left: clamp(x, 170, 910), top: clamp(y, 430, 1360),
          transform: `translate(-50%,-50%) scale(${lerp(0.86, 1, saida(v))})`, opacity: v * borda,
          padding: '9px 18px', borderRadius: 12, whiteSpace: 'nowrap',
          fontFamily: MONO, fontWeight: 700, fontSize: 27, letterSpacing: 2.5,
          color: et.acc ? COR.fundo : COR.rotulo, background: et.acc ? COR.rotulo : CARTAO, border: et.acc ? 'none' : BORDA,
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        }}>
          {et.txt}
        </div>
      );
    })}
  </>
);

// ---------------- código do botão (zeros e uns) ----------------
const BITS = '10110010111001';
const Codigo: React.FC<{ t: number; cam: Cam }> = ({ t, cam }) => {
  const v = janela(t, T(3, 'código') - 0.2, BE(3) + 0.6, 0.3, 0.3);
  if (v <= 0.001) return null;
  const n = Math.floor(clamp((t - T(3, 'código')) / 1.6) * BITS.length);
  const { x, y } = projetar(cam, [0, BASE + 0.2 - 0.17, 0.05]);
  return (
    <div style={{ position: 'absolute', left: clamp(x, 300, 780), top: clamp(y + 40, 600, 1300), transform: 'translateX(-50%)', opacity: v, textAlign: 'center' }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {BITS.split('').map((b, i) => (
          <div key={i} style={{
            width: 40, height: 54, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: MONO, fontWeight: 700, fontSize: 32, background: i < n ? CARTAO : 'transparent',
            color: i < n ? COR.rotulo : 'transparent', border: i < n ? BORDA : '1px solid transparent',
          }}>{b}</div>
        ))}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: COR.rotulo, marginTop: 12 }}>CÓDIGO DO BOTÃO VOL +</div>
    </div>
  );
};

// ---------------- olho: não enxerga ----------------
const Olho: React.FC<{ t: number }> = ({ t }) => {
  const v = janela(t, T(4, 'olho') - 0.2, BE(4) + 0.7, 0.3, 0.3);
  if (v <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', justifyContent: 'center', opacity: v }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '14px 26px', borderRadius: 16, background: CARTAO, border: BORDA, transform: `scale(${lerp(0.9, 1, saida(v))})` }}>
        <svg width={64} height={40} viewBox="0 0 64 40">
          <path d="M4 20 C14 4, 50 4, 60 20 C50 36, 14 36, 4 20 Z" fill="none" stroke={COR.objeto} strokeWidth={4} />
          <circle cx={32} cy={20} r={8} fill={COR.objeto} />
          <line x1={10} y1={36} x2={54} y2={4} stroke={COR.move} strokeWidth={5} strokeLinecap="round" />
        </svg>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 3, color: COR.objeto }}>INVISÍVEL A OLHO NU</div>
      </div>
    </div>
  );
};

// ---------------- fechamento ----------------
const Fechamento: React.FC<{ t: number }> = ({ t }) => {
  const v = prog(t, T(7, 'Segue') - 0.3, 0.6, saida);
  if (v <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 430, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: v, transform: `translateY(${(1 - v) * 18}px)` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '20px 34px', borderRadius: 24, background: CARTAO, border: BORDA }}>
        <Img src={staticFile('cubo.png')} style={{ width: 110 }} />
        <div>
          <div style={{ fontFamily: TITULO, fontSize: 70, color: COR.objeto, letterSpacing: -1, lineHeight: 1 }}>
            fabriq<span style={{ color: COR.move }}>sabia?</span>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 3, color: COR.rotulo, marginTop: 10 }}>COMO AS COISAS FUNCIONAM POR DENTRO</div>
        </div>
      </div>
      <div style={{ marginTop: 22, padding: '12px 30px', borderRadius: 999, background: COR.rotulo, fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: COR.fundo }}>
        SEGUE PARA VER O PRÓXIMO
      </div>
    </div>
  );
};

export const Hud: React.FC<{ t: number; cam: Cam; e: Estado }> = ({ t, cam, e }) => {
  const fimMarca = 1 - prog(t, T(7, 'Segue') - 0.4, 0.4);
  return (
    <AbsoluteFill style={{ fontFamily: TEXTO }}>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(14,26,43,0.85) 0%, rgba(14,26,43,0) 20%, rgba(14,26,43,0) 72%, rgba(14,26,43,0.7) 100%)' }} />
      <Etiquetas t={t} cam={cam} e={e} />
      <Codigo t={t} cam={cam} />
      <Olho t={t} />
      <Fechamento t={t} />
      <Marca v={fimMarca} />
      <Cronometro t={t} />
      <Legenda t={t} />
    </AbsoluteFill>
  );
};
