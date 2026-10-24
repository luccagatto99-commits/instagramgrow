import { AbsoluteFill, Img, staticFile } from 'remotion';
import { loadFont as archivoBlack } from '@remotion/google-fonts/ArchivoBlack';
import { loadFont as archivo } from '@remotion/google-fonts/Archivo';
import { loadFont as mono } from '@remotion/google-fonts/JetBrainsMono';
import { B, BE, BLOCOS, DURACAO, PALAVRAS, T, clamp, janela, lerp, prog, saida } from './tempo';
import { CABINE, CONTRA, COR, Estado, LIMIT, OTIS, POLIA, E } from './estado';
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
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1500, display: 'flex', justifyContent: 'center' }}>
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
type Et = { txt: string; p: (e: Estado) => P3; a: number; b: number };
const etiquetas = (): Et[] => {
  const e = E();
  const xa = CABINE.cx, xb = CONTRA.cx;
  return [
    { txt: 'MOLA', p: (s) => [0, s.yPlat + 0.85, 0], a: e.mola, b: e.empurrou },
    { txt: 'TRAVAS', p: (s) => [0.95, s.yPlat - 0.35, 0.3], a: e.empurrou, b: e.dentes + 0.3 },
    { txt: 'DENTES DO TRILHO', p: (s) => [OTIS.postoX, s.yPlat + 1.1, 0.2], a: e.dentes, b: B(2) - 0.4 },
    { txt: 'MOTOR', p: () => [POLIA.cx, POLIA.y + 0.8, -0.95], a: e.motor, b: e.gira + 0.4 },
    { txt: 'POLIA', p: () => [POLIA.cx, POLIA.y + 1.05, 0], a: e.gira + 0.4, b: e.cabos },
    { txt: 'CABOS DE AÇO', p: (s) => [xa + 0.95, (s.yc + CABINE.h + POLIA.y) / 2, 0.3], a: e.cabos, b: e.cabine },
    { txt: 'CABINE', p: (s) => [xa, s.yc + CABINE.h / 2, 0.9], a: e.cabine, b: e.contrapeso },
    { txt: 'CONTRAPESO', p: (s) => [xb + 0.15, s.ycw + CONTRA.h / 2, 0.5], a: e.contrapeso, b: e.equilibra },
    { txt: 'LIMITADOR DE VELOCIDADE', p: () => [LIMIT.x + 0.9, LIMIT.y - 0.75, 0.55], a: e.rodinha, b: e.desce },
    { txt: 'CABO DO LIMITADOR', p: (s) => [LIMIT.x + 0.2, s.yc - 0.4, 0.55], a: e.outro, b: e.rodinha },
    { txt: 'ALAVANCA', p: (s) => [CABINE.cx - CABINE.w / 2 - 0.2, s.yc + CABINE.h + 0.3, 0.55], a: e.alavanca, b: e.garras },
    { txt: 'GARRAS', p: (s) => [CABINE.cx, s.yc - 0.35, 0.6], a: e.garras, b: e.ideia },
  ];
};
let ETS: Et[] | null = null;

const Etiquetas: React.FC<{ t: number; cam: Cam; e: Estado }> = ({ t, cam, e }) => (
  <>
    {(ETS ??= etiquetas()).map((et, i) => {
      const v = janela(t, et.a, et.b, 0.25, 0.25);
      if (v <= 0.001) return null;
      const { x, y, frente } = projetar(cam, et.p(e));
      if (!frente) return null;
      return (
        <div key={i} style={{
          position: 'absolute', left: clamp(x, 220, 860), top: clamp(y, 400, 1440),
          transform: `translate(-50%,-50%) scale(${lerp(0.86, 1, saida(v))})`, opacity: v,
          padding: '9px 18px', borderRadius: 12, whiteSpace: 'nowrap',
          fontFamily: MONO, fontWeight: 700, fontSize: 27, letterSpacing: 2.5,
          color: COR.fundo, background: COR.rotulo, boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        }}>
          {et.txt}
        </div>
      );
    })}
  </>
);

/** cartão na faixa de baixo (acima da legenda), centralizado */
const Baixo: React.FC<{ v: number; top?: number; children: React.ReactNode }> = ({ v, top = 1260, children }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', opacity: v, transform: `scale(${lerp(0.92, 1, saida(v))})` }}>
    <div style={{ padding: '14px 28px', borderRadius: 20, background: CARTAO, border: BORDA }}>{children}</div>
  </div>
);
const Rot: React.FC<{ children: React.ReactNode; cor?: string; tam?: number }> = ({ children, cor = COR.rotulo, tam = 22 }) => (
  <div style={{ fontFamily: MONO, fontSize: tam, letterSpacing: 3, color: cor, textAlign: 'center' }}>{children}</div>
);
const CINZA = '#6B7A93';

// ---------------- câmera lenta (quedas) ----------------
const CameraLenta: React.FC<{ t: number }> = ({ t }) => {
  const ev = E();
  const v = Math.max(janela(t, ev.arrebenta0, ev.otis + 0.2, 0.1, 0.3), janela(t, ev.arrebentam, ev.para + 1.2, 0.2, 0.3));
  if (v <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 400, display: 'flex', justifyContent: 'center', opacity: v }}>
      <div style={{ padding: '8px 22px', borderRadius: 999, background: COR.move, fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 3, color: COR.fundo }}>CÂMERA LENTA</div>
    </div>
  );
};

// ---------------- 1854 ----------------
const Cartao1854: React.FC<{ t: number }> = ({ t }) => {
  const ev = E();
  const v = janela(t, ev.otis + 0.4, ev.caiu, 0.3, 0.3);
  const v2 = janela(t, ev.caiu, ev.mola, 0.25, 0.3);
  if (v + v2 <= 0.001) return null;
  return (
    <>
      {v > 0.001 && (
        <Baixo v={v}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 64, color: COR.objeto, textAlign: 'center', lineHeight: 1 }}>1854</div>
          <Rot>NOVA YORK · NA FRENTE DE UMA PLATEIA</Rot>
        </Baixo>
      )}
      {v2 > 0.001 && (
        <Baixo v={v2}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, color: COR.move, textAlign: 'center' }}>CAIU SÓ ALGUNS CENTÍMETROS</div>
        </Baixo>
      )}
    </>
  );
};

// ---------------- contrapeso: o motor só puxa a diferença ----------------
const CartaoEquilibrio: React.FC<{ t: number }> = ({ t }) => {
  const ev = E();
  const v = janela(t, ev.equilibra, BE(2) + 0.5, 0.25, 0.3);
  if (v <= 0.001) return null;
  const inc = Math.sin(t * 2) * 2;
  return (
    <Baixo v={v} top={1250}>
      <svg width={520} height={150}>
        <g transform={`rotate(${inc} 260 60)`}>
          <line x1={60} y1={60} x2={460} y2={60} stroke={COR.rotulo} strokeWidth={8} strokeLinecap="round" />
          <rect x={40} y={66} width={150} height={64} rx={10} fill={COR.objeto} />
          <text x={115} y={108} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={24} fill={COR.fundo}>CABINE</text>
          <rect x={330} y={66} width={150} height={64} rx={10} fill={COR.escuro} stroke={COR.rotulo} strokeWidth={3} />
          <text x={405} y={108} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={20} fill={COR.objeto}>CONTRAPESO</text>
        </g>
        <path d="M 240 140 L 260 64 L 280 140 Z" fill={COR.rotulo} />
      </svg>
      <Rot cor={COR.move}>O MOTOR SÓ PUXA A DIFERENÇA</Rot>
    </Baixo>
  );
};

// ---------------- vários cabos ----------------
const CartaoCabos: React.FC<{ t: number; e: Estado }> = ({ t, e }) => {
  const ev = E();
  const v = janela(t, ev.varios - 0.2, BE(3) + 0.5, 0.25, 0.3);
  if (v <= 0.001) return null;
  const n = e.cabos.filter((c) => c.conta > 0.5).length;
  const so = t >= ev.sozinho + 0.3;
  return (
    <Baixo v={v}>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        {e.cabos.map((c, i) => (
          <div key={i} style={{
            width: 54, height: 66, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 34,
            border: `3px solid ${c.conta > 0.5 && !(so && i > 0) ? COR.move : 'rgba(143,184,255,0.25)'}`, color: c.conta > 0.5 && !(so && i > 0) ? COR.objeto : '#4A5A73',
          }}>{i + 1}</div>
        ))}
      </div>
      <div style={{ marginTop: 10 }}><Rot cor={so ? COR.move : COR.rotulo}>{so ? '1 CABO JÁ SEGURA O ELEVADOR' : `${n} CABOS DE AÇO`}</Rot></div>
    </Baixo>
  );
};

// ---------------- velocidade da queda ----------------
const CartaoVelocidade: React.FC<{ t: number; e: Estado }> = ({ t, e }) => {
  const ev = E();
  const v = janela(t, ev.desce - 0.3, ev.abrem - 0.1, 0.25, 0.3);
  if (v <= 0.001) return null;
  const f = clamp(e.vel / 0.11);
  return (
    <Baixo v={v}>
      <Rot>VELOCIDADE DA CABINE</Rot>
      <div style={{ width: 460, height: 30, borderRadius: 15, border: `3px solid ${COR.rotulo}`, marginTop: 10, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${f * 100}%`, background: f > 0.75 ? COR.move : COR.rotulo }} />
        <div style={{ position: 'absolute', left: '75%', top: -2, bottom: -2, width: 4, background: COR.objeto }} />
      </div>
      <div style={{ marginTop: 8 }}><Rot cor={f > 0.75 ? COR.move : COR.rotulo}>{f > 0.75 ? 'RÁPIDO DEMAIS' : 'NORMAL'}</Rot></div>
    </Baixo>
  );
};

// ---------------- limitador: os pesinhos abrem e travam o cabo ----------------
const CartaoLimitador: React.FC<{ t: number; e: Estado }> = ({ t, e }) => {
  const ev = E();
  const v = janela(t, ev.abrem - 0.1, ev.alavanca, 0.25, 0.3);
  if (v <= 0.001) return null;
  const ang = e.angLimit * 57.3;
  const ab = e.pesos;
  const preso = e.travaLimit;
  return (
    <Baixo v={v} top={1230}>
      <svg width={300} height={190} viewBox="-150 -95 300 190">
        {/* dentes fixos em volta: os pesinhos abertos encaixam aqui */}
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i / 16) * Math.PI * 2;
          return <path key={i} d={`M ${Math.cos(a) * 86} ${Math.sin(a) * 86} L ${Math.cos(a + 0.12) * 74} ${Math.sin(a + 0.12) * 74} L ${Math.cos(a + 0.24) * 86} ${Math.sin(a + 0.24) * 86}`} fill="none" stroke={CINZA} strokeWidth={4} />;
        })}
        <g transform={`rotate(${-ang})`}>
          <circle r={60} fill="none" stroke={COR.objeto} strokeWidth={8} />
          <line x1={-60} y1={0} x2={60} y2={0} stroke={COR.objeto} strokeWidth={5} />
          {[-1, 1].map((s) => (
            <g key={s} transform={`rotate(${s === 1 ? 0 : 180}) translate(0 -18) rotate(${-ab * 38})`}>
              <rect x={0} y={-10} width={54 + ab * 16} height={20} rx={6} fill={preso ? COR.move : COR.rotulo} />
            </g>
          ))}
        </g>
      </svg>
      <Rot cor={preso ? COR.move : COR.rotulo}>{preso ? 'TRAVOU O CABO' : ab > 0.3 ? 'OS PESINHOS ABREM' : 'GIRANDO RÁPIDO'}</Rot>
    </Baixo>
  );
};

// ---------------- garra apertando o trilho ----------------
const CartaoGarra: React.FC<{ t: number; e: Estado }> = ({ t, e }) => {
  const ev = E();
  const v = janela(t, ev.garras - 0.1, ev.ideia + 0.6, 0.25, 0.3);
  if (v <= 0.001) return null;
  const g = e.garras;
  const fa = e.faiscas;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', justifyContent: 'center', opacity: v, transform: `scale(${lerp(0.92, 1, saida(v))})` }}>
      <div style={{ padding: '14px 28px', borderRadius: 20, background: CARTAO, border: BORDA, textAlign: 'center' }}>
        <svg width={320} height={170} viewBox="-160 -85 320 170">
          <rect x={-14} y={-85} width={28} height={170} fill={COR.sombra} />
          {[-1, 1].map((s) => (
            <path key={s} d={`M ${s * (90 - 66 * g)} -40 L ${s * (16 + 60 * (1 - g))} -24 L ${s * (16 + 60 * (1 - g))} 24 L ${s * (90 - 66 * g)} 40 Z`} fill={g > 0.5 ? COR.move : COR.rotulo} />
          ))}
          {fa > 0.01 && Array.from({ length: 8 }, (_, i) => {
            const u = (t * 2.5 + i / 8) % 1;
            return <circle key={i} cx={(i % 2 ? 1 : -1) * (20 + u * 70)} cy={-20 + u * -50 + (i % 3) * 10} r={4 * (1 - u)} fill="#FFD9A8" opacity={fa} />;
          })}
        </svg>
        <Rot cor={g > 0.5 ? COR.move : COR.rotulo}>{g > 0.5 ? 'A GARRA APERTA O TRILHO' : 'GARRA ABERTA'}</Rot>
      </div>
    </div>
  );
};

// ---------------- fechamento ----------------
const Fechamento: React.FC<{ t: number }> = ({ t }) => {
  const v = prog(t, T(6, 'Segue') - 0.3, 0.6, saida);
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
  const fimMarca = 1 - prog(t, T(6, 'Segue') - 0.4, 0.4);
  return (
    <AbsoluteFill style={{ fontFamily: TEXTO }}>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(14,26,43,0.85) 0%, rgba(14,26,43,0) 18%, rgba(14,26,43,0) 74%, rgba(14,26,43,0.7) 100%)' }} />
      <Etiquetas t={t} cam={cam} e={e} />
      <CameraLenta t={t} />
      <Cartao1854 t={t} />
      <CartaoEquilibrio t={t} />
      <CartaoCabos t={t} e={e} />
      <CartaoVelocidade t={t} e={e} />
      <CartaoLimitador t={t} e={e} />
      <CartaoGarra t={t} e={e} />
      <Fechamento t={t} />
      <Marca v={fimMarca} />
      <Cronometro t={t} />
      <Legenda t={t} />
    </AbsoluteFill>
  );
};
