// ---------------- etiquetas presas ao 3D ----------------
type P3 = [number, number, number];
type Et = { txt: string; p: (e: Estado) => P3; a: number; b: number; acc?: boolean };
const naMaq = (e: Estado, p: P3): P3 => [p[0] + e.maqOff[0], p[1] + e.maqOff[1], p[2] + e.maqOff[2]];
const etiquetas = (): Et[] => [
  { txt: 'CONCRETO', p: (e) => naMaq(e, [CONCRETO[0], CONCRETO[1] + 0.45, CONCRETO[2]]), a: T(0, 'concreto') - 0.05, b: T(0, 'Em') + 1.0, acc: true },
  { txt: 'TANQUE', p: (e) => [0, EIXO[1] + TANQUE.r + 0.3, EIXO[2] + 1.5 * e.saiTanque], a: T(1, 'tanque') - 0.1, b: T(1, 'tambor') - 0.15, acc: true },
  { txt: 'TAMBOR COM FURINHOS', p: (e) => [0, EIXO[1] - TAMBOR.r - 0.35, EIXO[2] + 1.5 * e.saiTanque + 1.45 * e.saiTambor + 0.3], a: T(1, 'tambor') - 0.1, b: BE(1) + 0.4, acc: true },
  { txt: 'VÁLVULA', p: () => [VALVULA[0], VALVULA[1] + 0.35, VALVULA[2]], a: T(2, 'válvula') - 0.1, b: T(2, 'gaveta') - 0.15, acc: true },
  { txt: 'GAVETA DO SABÃO', p: () => [GAVETA[0], GAVETA[1] + 0.4, GAVETA[2]], a: T(2, 'gaveta') - 0.1, b: T(2, 'tubinho') - 0.2, acc: true },
  { txt: 'TUBINHO DE AR', p: () => [0.85, 1.55, 0.35], a: T(2, 'tubinho') - 0.1, b: BE(2) + 0.4, acc: true },
  { txt: 'MOTOR', p: (e) => naMaq(e, [MOTOR[0] + 0.45, MOTOR[1] - 0.1, MOTOR[2] - 0.3]), a: T(3, 'motor') - 0.1, b: T(3, 'correia') - 0.2, acc: true },
  { txt: 'CORREIA', p: (e) => naMaq(e, [0.95, 1.0, POLIA_Z]), a: T(3, 'correia') - 0.2, b: B(3) + 4.6, acc: true },
  { txt: 'PÁS', p: () => [0, EIXO[1] + TAMBOR.r + 0.25, 0.6], a: T(3, 'pás') - 0.1, b: T(3, 'roupa') + 0.6, acc: true },
  { txt: 'BOMBA', p: () => [BOMBA[0], BOMBA[1] + 0.35, BOMBA[2] + 0.2], a: T(4, 'bomba') - 0.1, b: T(4, 'gira') - 0.4, acc: true },
  { txt: 'A ÁGUA SAI PELOS FUROS', p: () => [0, EIXO[1] + TANQUE.r + 0.3, 0.6], a: T(4, 'jogada') - 0.2, b: BE(4) + 0.5 },
  { txt: 'CONCRETO · ~25 KG', p: (e) => naMaq(e, [CONCRETO[0], CONCRETO[1] + 0.5 + 1.6 * e.tiraConcreto, CONCRETO[2]]), a: T(5, 'bloco') - 0.1, b: T(5, 'molas') - 0.2, acc: true },
  { txt: 'MOLAS', p: (e) => naMaq(e, [0.75, 2.85, 0]), a: T(5, 'molas') - 0.1, b: BE(5) + 0.6, acc: true },
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
          position: 'absolute', left: clamp(x, 220, 860), top: clamp(y, 430, 1340),
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

// ---------------- cartão: nível da água ----------------
const Nivel: React.FC<{ t: number; e: Estado }> = ({ t, e }) => {
  const v = janela(t, T(2, 'subindo') - 0.3, BE(2) + 0.5, 0.3, 0.3);
  if (v <= 0.001) return null;
  const ok = t >= T(2, 'avisa') - 0.1;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 430, display: 'flex', justifyContent: 'center', opacity: v }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '14px 26px', borderRadius: 18, background: CARTAO, border: BORDA }}>
        <div style={{ width: 34, height: 110, borderRadius: 10, border: `3px solid ${COR.rotulo}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: `${e.nivel * 100}%`, background: COR.move }} />
        </div>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: COR.rotulo }}>NÍVEL DA ÁGUA</div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, color: ok ? COR.move : COR.objeto, marginTop: 6 }}>{ok ? 'CHEGOU · PARA' : 'SUBINDO…'}</div>
        </div>
      </div>
    </div>
  );
};

// ---------------- cartão: voltas por minuto ----------------
const Rpm: React.FC<{ t: number }> = ({ t }) => {
  const v = janela(t, T(4, 'gira') - 0.2, BE(4) + 0.6, 0.3, 0.3);
  if (v <= 0.001) return null;
  const rpm = Math.round(1200 * prog(t, T(4, 'gira') - 0.2, 2.4));
  const txt = rpm.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 430, display: 'flex', justifyContent: 'center', opacity: v, transform: `scale(${lerp(0.9, 1, saida(v))})` }}>
      <div style={{ padding: '14px 34px', borderRadius: 18, background: CARTAO, border: BORDA, textAlign: 'center' }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 72, color: COR.objeto, lineHeight: 1.05 }}>{txt}</div>
        <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: COR.rotulo }}>VOLTAS POR MINUTO</div>
      </div>
    </div>
  );
};

// ---------------- flash: o raio-x do gancho ----------------
const Flash: React.FC<{ t: number }> = ({ t }) => {
  const a = Math.max(0, 1 - Math.abs(t - E().concretoGancho) / 0.12) * 0.6;
  if (a <= 0.001) return null;
  return <AbsoluteFill style={{ background: '#FFFFFF', opacity: a }} />;
};

