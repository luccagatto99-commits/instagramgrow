// ---------------- etiquetas presas ao 3D ----------------
type P3 = [number, number, number];
type Et = { txt: string; p: (e: Estado) => P3; a: number; b: number; acc?: boolean };
const etiquetas = (): Et[] => [
  { txt: 'VOLANTE', p: () => [0, C[1] + 1.75, 0], a: T(1, 'volante') - 0.1, b: T(1, 'dentro') + 0.2, acc: true },
  { txt: 'BOLSA DOBRADA', p: () => [0, C[1] + 0.95, 0.15], a: T(1, 'bolsa') - 0.1, b: T(1, 'cilindro') - 0.1, acc: true },
  { txt: 'GERADOR DE GÁS', p: () => [0, C[1] - 0.62, GERADOR.z], a: T(1, 'cilindro') - 0.1, b: BE(1) + 0.6, acc: true },
  { txt: 'CENTRAL', p: () => [ECU[0], ECU[1] + 0.45, ECU[2]], a: T(2, 'sensor') - 0.2, b: T(2, 'buraco') - 0.2, acc: true },
  { txt: 'SENSOR', p: () => [ECU[0] - 0.2, ECU[1] + 0.32, ECU[2]], a: T(2, 'buraco') - 0.2, b: BE(2) + 0.4, acc: true },
  { txt: 'FIO', p: () => [0.15, 1.2, -1.95], a: T(3, 'fio') - 0.15, b: T(3, 'iniciador') + 0.1, acc: true },
  { txt: 'INICIADOR', p: () => [0, C[1] + 0.2, GERADOR.z], a: T(3, 'iniciador') + 0.3, b: BE(3) + 0.4, acc: true },
  { txt: 'PASTILHAS', p: () => [0, C[1] + 0.36, GERADOR.z], a: T(4, 'pastilhas') - 0.1, b: T(4, 'queimam') + 0.3, acc: true },
  { txt: 'FILTRO', p: () => [0, C[1] + 0.48, GERADOR.z], a: T(5, 'filtro') - 0.15, b: T(5, 'rasga') - 0.4, acc: true },
  { txt: 'FUROS', p: (e) => [0.7 * SACO.rx * (0.3 + 0.7 * e.cheio), C[1] + 0.85, 0.3 + 0.55 * e.cheio - SACO.rz * e.cheio * 0.6], a: T(6, 'furos') - 0.15, b: T(6, 'cabeça') - 0.1, acc: true },
  { txt: 'GÁS ESCAPANDO', p: (e) => [1.6, C[1] + 0.8, 0.3 + 0.55 * e.cheio - 0.5], a: T(6, 'escapa') - 0.1, b: T(6, 'Assim') - 0.1 },
  { txt: 'TALCO OU AMIDO', p: () => [0, C[1] + 1.55, 1.4], a: T(7, 'talco') - 0.15, b: BE(7) + 0.5, acc: true },
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
          position: 'absolute', left: clamp(x, 200, 880), top: clamp(y, 430, 1340),
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

// ---------------- cartão: o tranco medido pelo sensor ----------------
const Grafico: React.FC<{ t: number }> = ({ t }) => {
  const v = janela(t, T(2, 'mede') - 0.2, BE(2) + 0.6, 0.35, 0.35);
  if (v <= 0.001) return null;
  const ev = E();
  const W = 640, H = 220, LIM = 0.55;
  const t0 = ev.buraco - 0.6, t1 = ev.batida + 2.4;
  const pts: string[] = [];
  for (let k = 0; k <= 160; k++) {
    const tt = t0 + ((t1 - t0) * k) / 160;
    if (tt > t) break;
    pts.push(`${(k / 160) * W},${H - 14 - tranco(tt) * (H - 40)}`);
  }
  const dispara = t >= ev.dispara;
  const passou = t >= ev.batida + 0.25;
  const yLim = H - 14 - LIM * (H - 40);
  const xB = ((ev.buraco + 0.35 - t0) / (t1 - t0)) * W;
  const xT = ((ev.batida + 0.25 - t0) / (t1 - t0)) * W;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 430, display: 'flex', justifyContent: 'center', opacity: v, transform: `scale(${lerp(0.92, 1, saida(v))})` }}>
      <div style={{ padding: '16px 24px 14px', borderRadius: 18, background: CARTAO, border: BORDA }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: COR.rotulo, marginBottom: 8 }}>
          <span>TRANCO DO CARRO</span>
          <span style={{ color: dispara ? COR.move : 'rgba(143,184,255,0.5)', fontWeight: 700 }}>{dispara ? 'DISPARA' : 'ESPERA'}</span>
        </div>
        <svg width={W} height={H} style={{ display: 'block' }}>
          <line x1={0} y1={yLim} x2={W} y2={yLim} stroke={COR.rotulo} strokeWidth={2} strokeDasharray="10 8" opacity={0.7} />
          <text x={W - 4} y={yLim - 10} textAnchor="end" fontFamily={MONO} fontSize={18} fill={COR.rotulo} letterSpacing={2}>LIMITE</text>
          <polyline points={pts.join(' ')} fill="none" stroke={passou ? COR.move : COR.objeto} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
          {t >= ev.buraco + 0.5 ? <text x={xB} y={H - 14 - 0.28 * (H - 40) - 14} textAnchor="middle" fontFamily={MONO} fontSize={18} fill={COR.objeto} letterSpacing={2}>BURACO</text> : null}
          {passou ? <text x={xT + 18} y={30} fontFamily={MONO} fontSize={18} fill={COR.move} letterSpacing={2}>BATIDA</text> : null}
        </svg>
      </div>
    </div>
  );
};

// ---------------- cartão: nitrogênio ----------------
const Nitrogenio: React.FC<{ t: number }> = ({ t }) => {
  const v = janela(t, T(4, 'nitrogênio') - 0.2, BE(4) + 0.7, 0.3, 0.3);
  if (v <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 440, display: 'flex', justifyContent: 'center', opacity: v, transform: `scale(${lerp(0.9, 1, saida(v))})` }}>
      <div style={{ padding: '14px 34px', borderRadius: 18, background: CARTAO, border: BORDA, textAlign: 'center' }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 72, color: COR.objeto, lineHeight: 1.05 }}>
          N<span style={{ fontSize: 40 }}>2</span>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: COR.rotulo }}>NITROGÊNIO · 78% DO AR</div>
      </div>
    </div>
  );
};

// ---------------- cartão: 30 ms contra uma piscada ----------------
const Tempo: React.FC<{ t: number }> = ({ t }) => {
  const v = janela(t, T(5, 'enche') - 0.2, BE(5) + 0.9, 0.3, 0.3);
  if (v <= 0.001) return null;
  const ms = Math.round(30 * prog(t, T(5, 'enche') - 0.15, 1.3));
  const pisc = prog(t, T(5, 'piscada') - 0.3, 0.8);
  const W = 400;
  const barra = (rot: string, frac: number, texto: string, cor: string, p: number) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10 }}>
      <div style={{ width: 130, fontFamily: MONO, fontSize: 22, letterSpacing: 2, color: COR.rotulo, textAlign: 'right' }}>{rot}</div>
      <div style={{ width: Math.max(2, W * frac * p), height: 22, borderRadius: 11, background: cor }} />
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: COR.objeto, opacity: p }}>{texto}</div>
    </div>
  );
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 430, display: 'flex', justifyContent: 'center', opacity: v, transform: `scale(${lerp(0.9, 1, saida(v))})` }}>
      <div style={{ padding: '14px 28px 18px', borderRadius: 18, background: CARTAO, border: BORDA, width: 720, boxSizing: 'border-box' }}>
        <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: COR.rotulo }}>TEMPO PARA ENCHER</div>
        {barra('AIRBAG', ms / 150, `${ms} ms`, COR.move, 1)}
        {barra('PISCADA', 1, '~150 ms', COR.rotulo, pisc)}
      </div>
    </div>
  );
};

