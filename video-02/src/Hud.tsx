import { AbsoluteFill, Img, staticFile } from 'remotion';
import { loadFont as archivoBlack } from '@remotion/google-fonts/ArchivoBlack';
import { loadFont as archivo } from '@remotion/google-fonts/Archivo';
import { loadFont as mono } from '@remotion/google-fonts/JetBrainsMono';
import { B, BE, BLOCOS, DURACAO, PALAVRAS, T, clamp, janela, lerp, prog, saida } from './tempo';
import { CARRETEL, COR, DET, Estado, FATIA } from './estado';
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
const etiquetas = (): Et[] => [
  { txt: 'CAMADAS', p: () => [FATIA.x + 0.55, FATIA.y + 0.5, FATIA.z], a: T(1, 'camadas') - 0.1, b: T(1, 'caminho') - 0.2, acc: true },
  { txt: 'CAMINHO DO BICO', p: () => [FATIA.x + 0.55, FATIA.y + 0.5, FATIA.z], a: T(1, 'caminho') - 0.1, b: B(2) + 0.2, acc: true },
  { txt: 'CARRETEL', p: (e) => [CARRETEL.x + 0.45, CARRETEL.y + 0.45 + 0.12 * e.destaque.carretel, CARRETEL.z], a: T(2, 'carretel') - 0.1, b: T(2, 'fio') - 0.1, acc: true },
  { txt: 'FIO DE PLÁSTICO', p: () => [CARRETEL.x + 0.45, CARRETEL.y + 0.45, CARRETEL.z], a: T(2, 'fio'), b: BE(2) + 0.3 },
  { txt: 'MOTOR + ENGRENAGENS', p: () => [DET.x, 2.85, DET.z], a: T(3, 'motor') - 0.1, b: T(3, 'Elas') + 0.3, acc: true },
  { txt: 'APERTAM E EMPURRAM', p: () => [DET.x, 2.85, DET.z], a: T(3, 'apertam') - 0.1, b: T(3, 'tubo') - 0.2 },
  { txt: 'TUBO', p: () => [DET.x + 0.3, 1.6, DET.z], a: T(3, 'tubo') - 0.1, b: B(4) + 0.3 },
  { txt: 'BLOCO QUENTE', p: () => [DET.x + 0.45, 1.2, DET.z], a: T(4, 'bloco') - 0.1, b: T(4, 'esquenta') + 0.3, acc: true },
  { txt: '200 °C', p: () => [DET.x + 0.45, 1.2, DET.z], a: T(4, '200') - 0.2, b: T(4, 'sai') - 0.2, acc: true },
  { txt: 'FURO DE 0,4 MM', p: () => [DET.x + 0.3, 0.6, DET.z + 0.1], a: T(4, 'furo') - 0.2, b: BE(4) + 0.5 },
  { txt: 'BICO ← →', p: (e) => [e.xBico, e.alturaBico + 0.55, 0.14], a: T(5, 'bico') - 0.1, b: T(5, 'mesa') - 0.2, acc: true },
  { txt: 'MESA ↕', p: (e) => [0.55, 0.42, e.zMesa + 0.5], a: T(5, 'mesa') - 0.1, b: T(5, 'Juntos') + 0.3, acc: true },
  { txt: 'PRIMEIRA CAMADA', p: (e) => [-0.35, 0.45, e.zMesa], a: T(5, 'primeira') - 0.2, b: T(5, 'Um') - 0.1 },
  { txt: 'VENTILADOR', p: (e) => [e.xBico + 0.25, e.alturaBico + 0.45, 0.4], a: T(5, 'ventilador') - 0.1, b: BE(5) + 0.4, acc: true },
  { txt: 'FAVO DE MEL', p: () => [0.3, 1.25 + 0.65, 0.9], a: T(7, 'favo') - 0.2, b: BE(7) + 0.4, acc: true },
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

// ---------------- contador de camadas ----------------
const Contador: React.FC<{ e: Estado }> = ({ e }) => {
  const v = janela(e.t, T(6, 'sobe') - 0.2, BE(6) + 0.6, 0.3, 0.3);
  if (v <= 0.001) return null;
  const n = Math.round(e.nCamadas * 4); // cada camada desenhada vale 4 de 0,2 mm
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 440, display: 'flex', justifyContent: 'center', opacity: v }}>
      <div style={{ padding: '14px 30px', borderRadius: 18, background: CARTAO, border: BORDA, textAlign: 'center' }}>
        <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: COR.rotulo }}>CAMADA</div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 64, color: COR.objeto, lineHeight: 1.05 }}>{n}<span style={{ fontSize: 30, color: '#5D6D86' }}> / 100</span></div>
        <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 3, color: COR.rotulo }}>0,2 MM CADA</div>
      </div>
    </div>
  );
};

// ---------------- fechamento ----------------
const Fechamento: React.FC<{ t: number }> = ({ t }) => {
  const v = prog(t, T(8, 'Segue') - 0.3, 0.6, saida);
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
  const fimMarca = 1 - prog(t, T(8, 'Segue') - 0.4, 0.4);
  return (
    <AbsoluteFill style={{ fontFamily: TEXTO }}>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(14,26,43,0.85) 0%, rgba(14,26,43,0) 20%, rgba(14,26,43,0) 72%, rgba(14,26,43,0.7) 100%)' }} />
      <Etiquetas t={t} cam={cam} e={e} />
      <Contador e={e} />
      <Fechamento t={t} />
      <Marca v={fimMarca} />
      <Cronometro t={t} />
      <Legenda t={t} />
    </AbsoluteFill>
  );
};
