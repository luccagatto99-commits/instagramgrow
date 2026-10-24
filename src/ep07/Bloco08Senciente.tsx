import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Balao, CarroEsportivo, CicloDeControle, FECHADO, FundoEscritorio, RODA_CARRO, Som, type CenaEp } from '../components';
import { COR, FONTE, ESTEIRA_Y, CENTRO_X } from '../theme';
import { entra, lin, naEsteira } from '../anim';
import { palavra } from './tempo';

const B = 7;

/** "Senciente": o balão abre e por dentro só há o ciclo mede → compara → corrige, um programa. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tCarro = palavra(B, 'carro');
  const tSenciente = palavra(B, '"senciente".');
  const tNao = palavra(B, 'não');
  const tPrograma = palavra(B, 'programa');
  const tRepetindo = palavra(B, 'repetindo');

  const pBalao = entra(frame, tSenciente - 4, 150) * (1 - lin(frame, tNao - 6, tNao));
  const pCarro = 1 - lin(frame, tNao - 6, tNao);
  const pCiclo = entra(frame, tNao - 2, 140);
  const velocidade = frame < tRepetindo ? 6 : 6 + (frame - tRepetindo) * 0.9;
  const giro = -90 + (frame - tNao) * velocidade;
  const pPrograma = entra(frame, tPrograma - 4, 160);

  return (
    <>
      <Som nome="tique" em={tCarro - 6} />
      <Som nome="tique" em={tSenciente - 4} />
      <Som nome="tique" em={tNao - 2} />
      <Som nome="carimbo" em={tPrograma} volume={0.4} />

      {pCarro > 0.01 ? <CarroEsportivo x={naEsteira(frame, -6, CENTRO_X)} y={ESTEIRA_Y - RODA_CARRO * 0.9} escala={0.9 * pCarro} /> : null}
      <Balao x={CENTRO_X + 40} base={890} largura={560} tamanho={76} escala={pBalao}>
        “senciente”
        <div style={{ marginTop: 6, fontFamily: FONTE.rotulo, fontWeight: 700, fontSize: 28, letterSpacing: 2 }}>ELON MUSK, NO X</div>
      </Balao>

      {frame >= tNao - 2 ? (
        <>
          <CicloDeControle x={CENTRO_X} y={790} raio={170} giro={giro} rastro={frame > tRepetindo ? 160 : 0} escala={pCiclo}>
            <CarroEsportivo x={0} y={0} escala={0.42} rot={Math.sin(frame * 0.5) * 6} />
          </CicloDeControle>
          <div style={{ position: 'absolute', left: CENTRO_X, top: 962, transform: `translate(-50%, -50%) scale(${pPrograma})`, background: COR.preto, color: COR.amarelo, borderRadius: 14, padding: '8px 26px 4px', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 36, letterSpacing: 3, whiteSpace: 'nowrap' }}>PROGRAMA</div>
        </>
      ) : null}
    </>
  );
};

export const Senciente: CenaEp = {
  Conteudo,
  Fundo: () => <FundoEscritorio />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, '"senciente".') - 2, 560, 800, 1.06), ABERTO(palavra(B, 'não') - 2)],
};
