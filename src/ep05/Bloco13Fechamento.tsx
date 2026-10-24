import React from 'react';
import { useCurrentFrame } from 'remotion';
import { FundoSaida, PlacaDeAviso, Som } from '../components';
import { palavra } from './tempo';
import { ABERTO, type CenaEp } from '../components';

const B = 12;
export const PERFIL = '@fabriqia';

/** Fechamento padrão: turno encerrado + placa de aviso. */
const Conteudo: React.FC = () => {
  const tFabrica = palavra(B, 'fábrica');
  return (
    <>
      <Som nome="apito" em={palavra(B, 'turno')} volume={0.3} />
      <PlacaDeAviso
        linha1="Quer entender a IA por dentro?"
        faixa="SIGA. A FÁBRICA ABRE TODO DIA."
        perfil={PERFIL}
        inicio={palavra(B, 'para') - 4}
        inicioFaixa={palavra(B, 'siga') - 2}
        inicioPerfil={tFabrica}
        top={440}
      />
    </>
  );
};

export const Fechamento: CenaEp = {
  Conteudo,
  Fundo: () => {
    const f = useCurrentFrame();
    return <FundoSaida ponteiro={f * 0.08} />;
  },
  planos: () => [ABERTO(0)],
};
