import { AbsoluteFill, Img, staticFile } from 'remotion';
import { loadFont as archivoBlack } from '@remotion/google-fonts/ArchivoBlack';
import { loadFont as archivo } from '@remotion/google-fonts/Archivo';
import { loadFont as mono } from '@remotion/google-fonts/JetBrainsMono';
import { B, BE, BLOCOS, DURACAO, PALAVRAS, T, clamp, janela, lerp, prog, saida } from './tempo';
import { COR, Estado, E, PX, R, X1, FURO_TOPO, CERTA, VIZINHO } from './estado';
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
  const ponta = (s: Estado, n: string) => s.chaves.find((c) => c.nome === n)!.ponta;
  return [
    { txt: 'CHAVE DO VIZINHO', p: (s) => [ponta(s, 'vizinho') - 3.8, -0.95, 0.2], a: 0.3, b: e.em90 + 0.4 },
    { txt: 'CILINDRO', p: () => [-1.5, -0.25, 0.3], a: e.cilindro, b: e.corpo + 0.2 },
    { txt: 'CORPO', p: () => [-1.5, 1.85, 0.3], a: e.corpo, b: e.girar },
    { txt: 'FUROS', p: () => [0, 2.35, 0], a: e.furos, b: e.mola },
    { txt: 'MOLA', p: (s) => [0.48, (s.pinos[2].baseCima + 0.5 + FURO_TOPO) / 2, 0.2], a: e.mola, b: e.cima },
    { txt: 'PINO DE CIMA', p: (s) => [0.62, s.pinos[2].baseCima + 0.25, 0.2], a: e.cima, b: e.baixo },
    { txt: 'PINO DE BAIXO', p: (s) => [0.65, s.pinos[2].base + 0.2, 0.2], a: e.baixo, b: e.empurra },
    { txt: 'LINHA DE CORTE', p: () => [X1 - 0.3, R + 0.26, 0.2], a: e.metade + 0.3, b: e.trava + 1.0 },
    { txt: 'SUA CHAVE', p: (s) => [ponta(s, 'sua') - 3.8, -0.95, 0.2], a: e.chave + 0.4, b: e.dente + 0.6 },
    { txt: 'LINHA DE CORTE', p: () => [X1 - 0.3, R + 0.26, 0.2], a: e.linha, b: e.todos + 0.4 },
    { txt: 'CAME', p: () => [X1 + 0.3, -1.3, 0.6], a: e.pecinha, b: e.puxa },
    { txt: 'LINGUETA', p: (s) => [X1 + 0.35, -1.55, 1.0 + s.lingueta], a: e.puxa, b: B(5) - 0.7 },
    { txt: 'CHAVE DO VIZINHO', p: (s) => [ponta(s, 'vizinho') - 3.8, -0.95, 0.2], a: e.errada + 0.6, b: e.pino },
    { txt: 'OUTRA CHAVE', p: (s) => [ponta(s, 'outra') - 3.8, -0.95, 0.2], a: B(6) + 0.6, b: e.poucos },
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


// ---------------- não gira / girou ----------------
const Selo: React.FC<{ t: number }> = ({ t }) => {
  const ev = E();
  const nao = Math.max(janela(t, ev.tranco0, ev.tranco0 + 1.4, 0.12, 0.3), janela(t, ev.sai, ev.sai + 1.4, 0.12, 0.3));
  const sim = Math.max(janela(t, ev.gira + 0.4, ev.gira + 2.0, 0.15, 0.3), janela(t, ev.abre6 + 0.3, ev.abre6 + 1.9, 0.15, 0.3));
  const v = Math.max(nao, sim);
  if (v <= 0.001) return null;
  const ok = sim > nao;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 400, display: 'flex', justifyContent: 'center', opacity: v, transform: `scale(${lerp(0.8, 1, saida(v))})` }}>
      <div style={{ padding: '10px 26px', borderRadius: 999, background: ok ? COR.move : COR.objeto, fontFamily: MONO, fontWeight: 700, fontSize: 34, letterSpacing: 3, color: COR.fundo }}>
        {ok ? '✓ GIROU' : '✗ NÃO GIRA'}
      </div>
    </div>
  );
};

// ---------------- código da chave: cada dente, uma altura ----------------
const Digitos: React.FC<{ cod: number[]; acesos?: boolean[]; erro?: number }> = ({ cod, acesos, erro = -1 }) => (
  <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
    {cod.map((c, i) => {
      const on = acesos ? acesos[i] : true;
      const cor = i === erro ? COR.objeto : on ? COR.move : 'rgba(143,184,255,0.25)';
      return (
        <div key={i} style={{
          width: 62, height: 74, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: MONO, fontWeight: 700, fontSize: 40, border: `3px solid ${cor}`, color: on || i === erro ? COR.objeto : '#4A5A73',
          background: i === erro ? 'rgba(244,241,234,0.12)' : 'transparent',
        }}>{c}</div>
      );
    })}
  </div>
);

const CartaoDentes: React.FC<{ t: number; e: Estado }> = ({ t, e }) => {
  const ev = E();
  const v = janela(t, ev.dente - 0.2, ev.certa, 0.25, 0.3);
  if (v <= 0.001) return null;
  return (
    <Baixo v={v} top={400}>
      <Digitos cod={CERTA} acesos={e.pinos.map((p) => p.alinhado)} />
      <div style={{ marginTop: 10 }}><Rot>CADA DENTE, UMA ALTURA</Rot></div>
    </Baixo>
  );
};

// ---------------- na linha: quantos pinos alinharam ----------------
const CartaoLinha: React.FC<{ t: number; e: Estado }> = ({ t, e }) => {
  const ev = E();
  const v1 = janela(t, ev.emenda, ev.atras, 0.25, 0.3);
  const v2 = janela(t, ev.pino - 0.2, ev.sai + 1.3, 0.25, 0.3);
  const v = Math.max(v1, v2);
  if (v <= 0.001) return null;
  const n = e.pinos.filter((p) => p.alinhado).length;
  const errado = v2 > v1;
  return (
    <Baixo v={v} top={400}>
      <Digitos cod={errado ? VIZINHO : CERTA} acesos={e.pinos.map((p) => p.alinhado)} erro={errado ? 1 : -1} />
      <div style={{ marginTop: 10 }}>
        <Rot cor={n === 5 ? COR.move : COR.rotulo}>{n === 5 ? '5 DE 5 NA LINHA' : errado ? 'O 2º PINO PASSA DA LINHA' : `${n} DE 5 NA LINHA`}</Rot>
      </div>
    </Baixo>
  );
};

// ---------------- às vezes abre: milhares × milhões ----------------
const CartaoConta: React.FC<{ t: number }> = ({ t }) => {
  const ev = E();
  const v = janela(t, ev.combinacoes - 0.2, ev.alguma, 0.25, 0.3);
  const vm = prog(t, ev.milhoes - 0.1, 0.4, saida);
  const v2 = janela(t, ev.alguma, B(7) - 0.3, 0.25, 0.3);
  return (
    <>
      {v > 0.001 && (
        <Baixo v={v} top={400}>
          <div style={{ display: 'flex', gap: 34, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: TITULO, fontSize: 52, color: COR.objeto, lineHeight: 1.05 }}>MILHARES</div>
              <Rot>DE COMBINAÇÕES</Rot>
            </div>
            <div style={{ fontFamily: MONO, fontSize: 40, color: COR.rotulo, opacity: vm }}>×</div>
            <div style={{ textAlign: 'center', opacity: vm }}>
              <div style={{ fontFamily: TITULO, fontSize: 52, color: COR.move, lineHeight: 1.05 }}>MILHÕES</div>
              <Rot>DE FECHADURAS</Rot>
            </div>
          </div>
        </Baixo>
      )}
      {v2 > 0.001 && (
        <Baixo v={v2} top={400}>
          <Rot>SUA CHAVE</Rot>
          <div style={{ margin: '8px 0 14px' }}><Digitos cod={CERTA} /></div>
          <Rot>OUTRA PORTA, EM ALGUM LUGAR</Rot>
          <div style={{ marginTop: 8 }}><Digitos cod={CERTA} /></div>
        </Baixo>
      )}
    </>
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
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(14,26,43,0.85) 0%, rgba(14,26,43,0) 18%, rgba(14,26,43,0) 74%, rgba(14,26,43,0.7) 100%)' }} />
      <Etiquetas t={t} cam={cam} e={e} />
      <Selo t={t} />
      <CartaoDentes t={t} e={e} />
      <CartaoLinha t={t} e={e} />
      <CartaoConta t={t} />
      <Fechamento t={t} />
      <Marca v={fimMarca} />
      <Cronometro t={t} />
      <Legenda t={t} />
    </AbsoluteFill>
  );
};
