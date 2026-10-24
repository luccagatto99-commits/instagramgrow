import { AbsoluteFill, Img, staticFile } from 'remotion';
import { loadFont as archivoBlack } from '@remotion/google-fonts/ArchivoBlack';
import { loadFont as archivo } from '@remotion/google-fonts/Archivo';
import { loadFont as mono } from '@remotion/google-fonts/JetBrainsMono';
import { B, BE, BLOCOS, DURACAO, PALAVRAS, T, clamp, janela, lerp, prog, saida } from './tempo';
import { BASE, COD_O, COR, CPU, EC, ERGUE, Estado, GPU, LETRA_O, NUM_O, RAM_A, RAM_B, TAMPA, TECLA_O, E, naTampa } from './estado';
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
type Et = { txt: string; p: P3; a: number; b: number };
const YD = BASE.h + ERGUE;
const etiquetas = (): Et[] => {
  const e = E();
  return [
    { txt: 'TECLA O', p: [TECLA_O[0], YD + 0.35, TECLA_O[1] + 0.1], a: e.apertou - 0.3, b: e.chipzinho },
    { txt: 'CHIP DO TECLADO', p: [EC[0], EC[1] + 0.35, EC[2] + 0.2], a: e.chipzinho, b: B(2) + 1.0 },
    { txt: 'PROCESSADOR', p: [CPU[0], CPU[1] + 0.95, CPU[2]], a: e.processador, b: e.windows },
    { txt: 'WHATSAPP', p: naTampa(0, TAMPA.h + 0.2, 0), a: e.whatsapp, b: e.guarda },
    { txt: 'MEMÓRIA', p: [RAM_A[0], RAM_A[1] + 0.7, RAM_A[2]], a: e.guarda, b: B(5) - 0.2 },
    { txt: 'CHIP DE VÍDEO', p: [GPU[0], GPU[1] + 0.6, GPU[2]], a: e.chipVideo, b: e.imagem },
    { txt: 'IMAGEM DA TELA', p: [RAM_B[0], RAM_B[1] + 0.7, RAM_B[2]], a: e.imagem, b: BE(5) + 0.4 },
  ];
};
let ETS: Et[] | null = null;

const Etiquetas: React.FC<{ t: number; cam: Cam }> = ({ t, cam }) => (
  <>
    {(ETS ??= etiquetas()).map((et, i) => {
      const v = janela(t, et.a, et.b, 0.25, 0.25);
      if (v <= 0.001) return null;
      const { x, y, frente } = projetar(cam, et.p);
      if (!frente) return null;
      return (
        <div key={i} style={{
          position: 'absolute', left: clamp(x, 220, 860), top: clamp(y, 650, 1420),
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

/** cartão no topo, centralizado */
const Topo: React.FC<{ v: number; children: React.ReactNode }> = ({ v, children }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: 410, display: 'flex', justifyContent: 'center', opacity: v, transform: `scale(${lerp(0.92, 1, saida(v))})` }}>
    <div style={{ padding: '16px 30px', borderRadius: 20, background: CARTAO, border: BORDA }}>{children}</div>
  </div>
);
const Rot: React.FC<{ children: React.ReactNode; cor?: string; tam?: number }> = ({ children, cor = COR.rotulo, tam = 22 }) => (
  <div style={{ fontFamily: MONO, fontSize: tam, letterSpacing: 3, color: cor, textAlign: 'center' }}>{children}</div>
);
const CINZA = '#6B7A93';

// ---------------- gancho: câmera lenta ----------------
const CameraLenta: React.FC<{ t: number; e: Estado }> = ({ t, e }) => {
  const ev = E();
  const v = janela(t, ev.apertaGancho, ev.rebobina, 0.2, 0.3);
  if (v <= 0.001) return null;
  const ms = Math.round(e.viagem * 80);
  return (
    <Topo v={v}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 64, color: COR.objeto, width: 210, textAlign: 'right' }}>0,{String(ms).padStart(3, '0')}</div>
        <div style={{ fontFamily: MONO, fontSize: 30, color: COR.rotulo }}>SEGUNDO</div>
      </div>
      <Rot cor={COR.move}>CÂMERA LENTA</Rot>
    </Topo>
  );
};

// ---------------- bloco 1: dentro da tecla ----------------
const CartaoTecla: React.FC<{ t: number; e: Estado }> = ({ t, e }) => {
  const ev = E();
  const v = janela(t, ev.embaixo, ev.chipzinho, 0.25, 0.3);
  if (v <= 0.001) return null;
  const p = prog(t, ev.apertou, 0.3); // aperto
  const fecha = t >= ev.fecham;
  const corrente = prog(t, ev.fecham, 0.25);
  return (
    <Topo v={v}>
      <svg width={560} height={210}>
        {/* tecla */}
        <rect x={190} y={14 + p * 30} width={180} height={52} rx={10} fill={COR.objeto} stroke={COR.traco} strokeWidth={3} />
        {/* cúpula de borracha */}
        <path d={`M 235 ${118} Q 280 ${70 + p * 36} 325 118`} fill="none" stroke={CINZA} strokeWidth={6} />
        {/* trilha de cima e contato */}
        <line x1={40} y1={124 + p * 10} x2={520} y2={124 + p * 10} stroke={fecha ? COR.move : COR.rotulo} strokeWidth={6} strokeOpacity={fecha ? corrente * 0.6 + 0.4 : 1} />
        <rect x={262} y={124 + p * 10} width={36} height={8} fill={fecha ? COR.move : COR.rotulo} />
        {/* trilha de baixo e contato */}
        <rect x={262} y={146} width={36} height={8} fill={fecha ? COR.move : COR.rotulo} />
        <line x1={40} y1={158} x2={520} y2={158} stroke={fecha ? COR.move : COR.rotulo} strokeWidth={6} />
        {fecha && [0, 1, 2, 3].map((k) => <circle key={k} cx={40 + ((t * 300 + k * 120) % 480)} cy={158} r={7} fill="#FFE2D3" />)}
        <text x={40} y={112} fontFamily={MONO} fontSize={18} letterSpacing={2} fill={COR.rotulo}>TRILHA DE METAL</text>
        <text x={40} y={190} fontFamily={MONO} fontSize={18} letterSpacing={2} fill={COR.rotulo}>TRILHA DE METAL</text>
      </svg>
      <Rot cor={fecha ? COR.move : COR.rotulo}>{fecha ? 'ENCOSTOU · CIRCUITO FECHADO' : 'DENTRO DA TECLA'}</Rot>
    </Topo>
  );
};

// ---------------- bloco 1: o chip do teclado testa as teclas ----------------
const CartaoVarredura: React.FC<{ t: number }> = ({ t }) => {
  const ev = E();
  const v = janela(t, ev.chipzinho, BE(1) + 0.4, 0.25, 0.3);
  if (v <= 0.001) return null;
  const n = Math.floor(Math.max(0, Math.min(t, ev.acha) - ev.chipzinho) * 500);
  const achou = t >= ev.acha;
  return (
    <Topo v={v}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, justifyContent: 'center' }}>
        <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 3, color: COR.rotulo }}>TESTE Nº</div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 60, color: COR.objeto, width: 170 }}>{String(n).padStart(4, '0')}</div>
      </div>
      <Rot cor={achou ? COR.move : COR.rotulo} tam={26}>{achou ? 'FECHOU: TECLA O' : 'NENHUMA… NENHUMA…'}</Rot>
    </Topo>
  );
};

// ---------------- bloco 2: o código vai em pulsos de corrente ----------------
const CartaoPulsos: React.FC<{ t: number }> = ({ t }) => {
  const ev = E();
  const v = janela(t, ev.mandando - 0.1, BE(2) + 0.5, 0.25, 0.3);
  if (v <= 0.001) return null;
  const w = 62, x0 = 20, alto = 26, baixo = 96;
  const foco = t >= ev.naoTem ? 0 : t >= ev.temUm ? 1 : -1;
  const vis = prog(t, ev.mandando, 1.6, (u) => u) * 8; // os pulsos vão saindo
  let d = `M ${x0} ${baixo}`;
  COD_O.forEach((b, k) => {
    if (k >= vis) return;
    const y = b ? alto : baixo;
    d += ` L ${x0 + k * w} ${y} L ${x0 + (k + 1) * w} ${y}`;
  });
  return (
    <Topo v={v}>
      <svg width={540} height={170}>
        <path d={d} fill="none" stroke={COR.move} strokeWidth={6} strokeLinejoin="round" />
        {COD_O.map((b, k) => k < vis && (
          <text key={k} x={x0 + k * w + w / 2} y={150} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={44}
            fill={b ? COR.move : COR.rotulo} opacity={foco === -1 || foco === b ? 1 : 0.25}>{b}</text>
        ))}
      </svg>
      <Rot cor={foco === 1 ? COR.move : COR.rotulo}>{foco === 1 ? 'TEM CORRENTE = 1' : foco === 0 ? 'NÃO TEM = 0' : 'CÓDIGO DA TECLA O'}</Rot>
    </Topo>
  );
};

// ---------------- bloco 3: tabela do teclado brasileiro e o número 111 ----------------
const CartaoTabela: React.FC<{ t: number }> = ({ t }) => {
  const ev = E();
  const v = janela(t, ev.windows, ev.dai, 0.25, 0.3);
  if (v <= 0.001) return null;
  const linhas: [string, string][] = [['00010111', 'I'], ['00011000', 'O'], ['00011001', 'P']];
  const acha = t >= ev.descobre;
  return (
    <Topo v={v}>
      <Rot>TABELA DO TECLADO BRASILEIRO</Rot>
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {linhas.map(([c, l], k) => {
          const on = acha && l === 'O';
          return (
            <div key={k} style={{ display: 'flex', gap: 24, alignItems: 'center', padding: '4px 18px', borderRadius: 10, background: on ? COR.move : 'transparent' }}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 38, color: on ? COR.fundo : COR.objeto, opacity: on || !acha ? 1 : 0.4 }}>{c}</div>
              <div style={{ fontFamily: MONO, fontSize: 34, color: on ? COR.fundo : COR.rotulo, opacity: on || !acha ? 1 : 0.4 }}>→</div>
              <div style={{ fontFamily: TITULO, fontSize: 40, color: on ? COR.fundo : COR.objeto, opacity: on || !acha ? 1 : 0.4 }}>{l}</div>
            </div>
          );
        })}
      </div>
    </Topo>
  );
};
const Bits: React.FC<{ bits: number[]; tam?: number; ate?: number }> = ({ bits, tam = 44, ate = 8 }) => (
  <div style={{ display: 'flex', gap: 6 }}>
    {bits.map((b, k) => (
      <div key={k} style={{
        width: tam, height: tam * 1.2, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: MONO, fontWeight: 700, fontSize: tam * 0.75, opacity: k < ate ? 1 : 0.15,
        background: b ? COR.move : 'rgba(143,184,255,0.12)', border: `3px solid ${b ? COR.move : COR.rotulo}`, color: b ? COR.fundo : COR.rotulo,
      }}>{b}</div>
    ))}
  </div>
);
const CartaoNumero: React.FC<{ t: number }> = ({ t }) => {
  const ev = E();
  const v = janela(t, ev.dai, BE(3) + 0.5, 0.25, 0.3);
  if (v <= 0.001) return null;
  const n = prog(t, ev.numero, 0.4, saida);
  return (
    <Topo v={v}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, justifyContent: 'center' }}>
        <div style={{ fontFamily: TITULO, fontSize: 72, color: COR.objeto, lineHeight: 1 }}>o</div>
        <div style={{ fontFamily: MONO, fontSize: 44, color: COR.rotulo }}>=</div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 72, color: COR.move, opacity: n, lineHeight: 1 }}>111</div>
      </div>
      <div style={{ marginTop: 12, opacity: n }}><Bits bits={NUM_O} /></div>
    </Topo>
  );
};

// ---------------- bloco 4: a mensagem na memória ----------------
const CartaoMemoria: React.FC<{ t: number }> = ({ t }) => {
  const ev = E();
  const v = janela(t, ev.guarda - 0.2, BE(4) + 0.4, 0.25, 0.3);
  if (v <= 0.001) return null;
  return (
    <Topo v={v}>
      <Rot>MENSAGEM PARA “MÃE”, NA MEMÓRIA</Rot>
      <div style={{ display: 'flex', gap: 10, marginTop: 12, justifyContent: 'center' }}>
        {['o', '', ''].map((c, k) => (
          <div key={k} style={{
            width: 80, height: 86, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `3px solid ${c ? COR.move : 'rgba(143,184,255,0.3)'}`, fontFamily: TITULO, fontSize: 52, color: COR.objeto,
          }}>{c}</div>
        ))}
      </div>
    </Topo>
  );
};

// ---------------- bloco 5: a fonte e os pontinhos ----------------
const CartaoFonte: React.FC<{ t: number }> = ({ t }) => {
  const ev = E();
  const v = janela(t, ev.fonte, BE(5) + 0.5, 0.25, 0.3);
  if (v <= 0.001) return null;
  const px = 22, ox = 20, oy = 14;
  const pts: [number, number][] = [];
  LETRA_O.forEach((l, r) => [...l].forEach((c, k) => { if (c === '#') pts.push([k, r]); }));
  const pinta = prog(t, ev.pinta, 1.2, (u) => u);
  const forma = prog(t, ev.fonte + 0.2, 0.5);
  return (
    <Topo v={v}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
        <svg width={150} height={190}>
          {Array.from({ length: 35 }, (_, i) => (
            <rect key={i} x={ox + (i % 5) * px} y={oy + Math.floor(i / 5) * px} width={px - 3} height={px - 3} rx={3} fill="none" stroke="rgba(143,184,255,0.25)" strokeWidth={2} />
          ))}
          {pts.slice(0, Math.round(pinta * pts.length)).map(([k, r], i) => (
            <rect key={i} x={ox + k * px} y={oy + r * px} width={px - 3} height={px - 3} rx={3} fill={COR.objeto} />
          ))}
          <ellipse cx={ox + 2.5 * px - 1.5} cy={oy + 4.6 * px} rx={2.4 * px} ry={2.3 * px} fill="none" stroke={COR.move} strokeWidth={4} opacity={forma} />
        </svg>
        <div>
          <Rot cor={COR.move}>{pinta > 0 ? 'PONTINHOS PINTADOS' : 'FORMATO DA LETRA'}</Rot>
          <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 2, color: COR.rotulo, marginTop: 8, textAlign: 'center' }}>{pinta > 0 ? 'NA IMAGEM DA TELA' : '(A FONTE)'}</div>
        </div>
      </div>
    </Topo>
  );
};

// ---------------- bloco 6: a tela lê 60 vezes por segundo ----------------
const CartaoTela60: React.FC<{ t: number }> = ({ t }) => {
  const ev = E();
  const v = janela(t, ev.le, ev.pontinho, 0.25, 0.3);
  if (v <= 0.001) return null;
  const n = (Math.floor((t - ev.le) * 60) % 60) + 1;
  return (
    <Topo v={v}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, justifyContent: 'center' }}>
        <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 3, color: COR.rotulo }}>LEITURA</div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 60, color: COR.objeto, width: 90 }}>{String(Math.max(1, n)).padStart(2, '0')}</div>
        <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 3, color: COR.rotulo }}>DE 60</div>
      </div>
      <Rot>EM 1 SEGUNDO</Rot>
    </Topo>
  );
};
const CartaoPixel: React.FC<{ t: number }> = ({ t }) => {
  const ev = E();
  const v = janela(t, ev.pontinho, ev.aparece + 0.2, 0.25, 0.3);
  if (v <= 0.001) return null;
  const forca = prog(t, T(6, 'força') - 0.3, 0.8);
  const luzes: [string, string, number, number][] = [
    ['#FF4A4A', 'VERMELHA', T(6, 'vermelha'), 233], ['#43D17A', 'VERDE', T(6, 'verde'), 237], ['#4A8BFF', 'AZUL', T(6, 'azul'), 239],
  ];
  return (
    <Topo v={v}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28 }}>
        <div style={{ display: 'flex', gap: 8, padding: 10, borderRadius: 14, border: `3px solid ${COR.rotulo}` }}>
          {luzes.map(([c, , a, n], k) => {
            const on = prog(t, a - 0.15, 0.25);
            const nivel = lerp(1, n / 255, forca);
            return <div key={k} style={{ width: 34, height: 120, borderRadius: 8, background: c, opacity: 0.12 + 0.88 * on * nivel }} />;
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {luzes.map(([c, nome, a, n], k) => {
            const on = prog(t, a - 0.15, 0.25);
            return (
              <div key={k} style={{ display: 'flex', gap: 14, alignItems: 'baseline', opacity: 0.25 + 0.75 * on }}>
                <div style={{ width: 150, fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 2, color: c }}>{nome}</div>
                <div style={{ width: 70, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: COR.objeto, opacity: forca }}>{Math.round(lerp(0, n, forca))}</div>
              </div>
            );
          })}
        </div>
      </div>
      <Rot>1 PONTINHO DA LETRA</Rot>
    </Topo>
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
      <Etiquetas t={t} cam={cam} />
      <CameraLenta t={t} e={e} />
      <CartaoTecla t={t} e={e} />
      <CartaoVarredura t={t} />
      <CartaoPulsos t={t} />
      <CartaoTabela t={t} />
      <CartaoNumero t={t} />
      <CartaoMemoria t={t} />
      <CartaoFonte t={t} />
      <CartaoTela60 t={t} />
      <CartaoPixel t={t} />
      <Fechamento t={t} />
      <Marca v={fimMarca} />
      <Cronometro t={t} />
      <Legenda t={t} />
    </AbsoluteFill>
  );
};
