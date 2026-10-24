import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Calendario, Carimbo, FECHADO, FichaDocumento, FundoPortaria, Som, rolaAno, type CenaEp } from '../components';
import { CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin, naEsteira } from '../anim';
import { palavra } from './tempo';
import { Sol } from './comum';

const B = 0;

/** Gancho: o plano de 1956 (criar a IA num verão) e o erro de quase setenta anos. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tCientistas = palavra(B, 'cientistas');
  const tVerao = palavra(B, 'verão.');
  const tErraram = palavra(B, 'erraram');
  const tSetenta = palavra(B, 'setenta');
  const ano = rolaAno(frame, tSetenta - 4, 1956, 2022, 34);

  return (
    <>
      <Som nome="tique" em={0} />
      <Som nome="tique" em={tCientistas - 2} />
      <Som nome="tique" em={tVerao - 2} />
      <Som nome="carimbo" em={tErraram} volume={0.6} />
      <Som nome="tique" em={tSetenta + 30} />

      <Calendario ano={ano} de={0} top={430} />

      <FichaDocumento
        x={naEsteira(frame, tCientistas - 6, CENTRO_X)}
        base={ESTEIRA_Y}
        rotulo="PLANO"
        nome="criar a inteligência artificial"
        numero="prazo: 1 verão"
        largura={560}
        tamanho={46}
        anulada={lin(frame, tErraram - 2, tErraram + 4)}
      >
        <Carimbo x={280} y={120} texto="ERRARAM" em={tErraram} tamanho={56} rot={-12} />
      </FichaDocumento>

      {frame >= tVerao - 6 ? <Sol x={850} y={610} r={52} giro={frame * 0.6} escala={entra(frame, tVerao - 6, 150)} /> : null}
    </>
  );
};

export const Gancho: CenaEp = {
  Conteudo,
  Fundo: () => <FundoPortaria opacidade={0.4} placa={0} />,
  planos: () => [FECHADO(0, CENTRO_X, 860, 1.08), ABERTO(palavra(B, 'cientistas') + 4), FECHADO(palavra(B, 'erraram') - 2, CENTRO_X, 820, 1.08), ABERTO(palavra(B, 'setenta') - 4)],
};
