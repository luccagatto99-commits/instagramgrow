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
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(14,26,43,0.85) 0%, rgba(14,26,43,0) 20%, rgba(14,26,43,0) 72%, rgba(14,26,43,0.7) 100%)' }} />
      <Etiquetas t={t} cam={cam} e={e} />
      <Nivel t={t} e={e} />
      <Rpm t={t} />
      <SemConcreto e={e} />
      <Fechamento t={t} />
      <Flash t={t} />
      <Marca v={fimMarca} />
      <Cronometro t={t} />
      <Legenda t={t} />
    </AbsoluteFill>
  );
};
