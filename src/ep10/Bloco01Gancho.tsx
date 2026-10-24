import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Escultura, FECHADO, FundoGalpao, Lapis, QuadroRuido, Som, type CenaEp } from '../components';
import { ESTEIRA_Y, CENTRO_X } from '../theme';
import { entra, lin, mola } from '../anim';
import { palavra } from './tempo';
import { Cachorro, CenaPraia } from './comum';

const B = 0;
const BASE = ESTEIRA_Y - 10;
export const LARG_QUADRO = 520;

/**
 * Gancho: o quadro já começa cheio de pontos piscando. Em "não desenha nada" um lápis é riscado;
 * em "vai tirando" os pontos somem e aparece o cachorro; em "escultor" um bloco de pedra
 * perde pedaços ao lado, no mesmo ritmo do quadro.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tNao = palavra(B, 'não', 0);
  const tNada = palavra(B, 'nada.');
  const tComeca = palavra(B, 'começa');
  const tTirando = palavra(B, 'tirando', 0);
  const tEscultor = palavra(B, 'escultor');
  const tEstatua = palavra(B, 'estátua.', 0, true);

  // lápis: entra à esquerda, é riscado e cai
  const pLapis = frame >= tNao - 4 ? entra(frame, tNao - 4, 200) : 0;
  const risco = lin(frame, tNada, tNada + 8);
  const cai = lin(frame, tComeca, tComeca + 14);
  const abreLapis = mola(frame, tNao - 4, 0, 1) - mola(frame, tComeca, 0, 1);

  // tela dividida com a escultura a partir de "escultor"
  const divide = frame >= tEscultor - 4 ? mola(frame, tEscultor - 4, 0, 1) : 0;
  const pEscultura = lin(frame, tEscultor + 4, tEstatua - 4);
  const nivel = frame < tEscultor ? lin(frame, tTirando, tEscultor - 4, 1, 0.55) : lin(frame, tEscultor + 4, tEstatua - 4, 0.55, 0);

  const xQuadro = CENTRO_X + 110 * abreLapis - 180 * divide;
  const escQuadro = 1 - 0.2 * abreLapis - 0.34 * divide;
  return (
    <>
      <Som nome="chiado" em={0} volume={0.35} />
      <Som nome="tique" em={tNao - 4} />
      <Som nome="carimbo" em={tNada} volume={0.4} />
      <Som nome="chiado" em={tTirando} volume={0.25} />
      {Array.from({ length: 8 }).map((_, k) => (
        <Som key={k} nome="tique" em={tEscultor + 6 + k * 8} volume={0.25} />
      ))}

      <QuadroRuido x={xQuadro} base={BASE} largura={LARG_QUADRO} nivel={nivel} escala={escQuadro}>
        <CenaPraia />
      </QuadroRuido>

      {pLapis > 0 && cai < 1 ? (
        <Lapis x={285 - 40 * cai} y={790 + 260 * cai * cai} tamanho={240} risco={risco} escala={pLapis * (1 - cai * 0.3)} rot={-40 * cai} />
      ) : null}

      {divide > 0 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: divide, transform: `translateY(${(1 - divide) * -140}px)` }}>
          <Escultura x={730} base={BASE} largura={300} p={pEscultura}>
            <Cachorro transform="translate(20 161) scale(1.1)" traco={8} />
          </Escultura>
        </div>
      ) : null}
    </>
  );
};

export const Gancho: CenaEp = {
  Conteudo,
  Fundo: () => <FundoGalpao />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'tirando', 0), CENTRO_X, 800, 1.1), ABERTO(palavra(B, 'escultor') - 4)],
};
