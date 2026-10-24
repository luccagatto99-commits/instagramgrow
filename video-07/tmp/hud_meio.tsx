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
    { txt: 'LIMITADOR DE VELOCIDADE', p: () => [LIMIT.x + 0.6, LIMIT.y + 0.5, 0.55], a: e.rodinha, b: e.desce },
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
const Baixo: React.FC<{ v: number; top?: number; children: React.ReactNode }> = ({ v, top = 1230, children }) => (
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
    <Baixo v={v} top={1220}>
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
    <Baixo v={v} top={1190}>
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
    <div style={{ position: 'absolute', left: 0, right: 0, top: 440, display: 'flex', justifyContent: 'center', opacity: v, transform: `scale(${lerp(0.92, 1, saida(v))})` }}>
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

