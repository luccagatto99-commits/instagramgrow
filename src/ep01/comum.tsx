import React from 'react';
import { CaixaToken, Cadeado, larguraCaixa, useVisivelNoHud } from '../components';
import { COR, FONTE, CONTORNO, CENTRO_X } from '../theme';

export { ABERTO, FECHADO, type CenaEp } from '../components';

/** Caixa "morango" trancada (gancho, promessa e virada). */
export const MorangoTrancado: React.FC<{ x: number; base: number; escala?: number; abertura?: number; cadeadoDy?: number; semCadeado?: boolean }> = ({
  x, base, escala = 1, abertura = 0, cadeadoDy = 0, semCadeado,
}) => {
  const T = 84;
  const L = larguraCaixa('morango', T);
  const alt = T * 1.1 + 30 + 20;
  return (
    <>
      <CaixaToken texto="morango" tamanho={T} x={x} base={base} escala={escala} destaque />
      {semCadeado ? null : (
        <Cadeado x={x + (L / 2) * escala + 4} y={base - alt * escala - 26 * escala + cadeadoDy} tamanho={120 * escala} abertura={abertura} />
      )}
    </>
  );
};

/** Balão de fala branco com rabinho. */
export const Balao: React.FC<{ children: React.ReactNode; top: number; escala?: number; largura?: number; tamanho?: number }> = ({
  children, top, escala = 1, largura, tamanho = 64,
}) => {
  const vis = useVisivelNoHud();
  return (
  <div
    style={{
      ...vis,
      position: 'absolute',
      left: CENTRO_X,
      top,
      width: largura,
      transform: `translateX(-50%) scale(${escala})`,
      transformOrigin: '50% 100%',
      background: COR.branco,
      border: `${CONTORNO}px solid ${COR.preto}`,
      borderRadius: 40,
      padding: '20px 40px',
      fontFamily: FONTE.titulo,
      fontSize: tamanho,
      lineHeight: 1.12,
      color: COR.preto,
      whiteSpace: largura ? 'normal' : 'nowrap',
      textAlign: 'center',
    }}
  >
    {children}
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: -40,
        marginLeft: -22,
        borderLeft: '22px solid transparent',
        borderRight: '22px solid transparent',
        borderTop: `40px solid ${COR.preto}`,
      }}
    />
  </div>
  );
};
