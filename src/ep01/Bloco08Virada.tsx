import React from 'react';
import { useCurrentFrame } from 'remotion';
import { CaixaToken, Destaque, Som, larguraCaixa, FundoAlerta } from '../components';
import { COR, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin, naEsteira, tranco } from '../anim';
import { palavra } from './tempo';
import { ABERTO, FECHADO, type CenaEp } from './comum';
import { Guilhotina } from './Guilhotina';
import { G_TOP } from './Bloco06Exemplo';
import { MorangoTrancado } from './comum';
import { MORANGO } from './dados';

const B = 7;
const T = 84;
// centro da caixa para o corte mor|ango cair sob a lâmina
const L = larguraCaixa('morango', T);
const X0 = CENTRO_X + L / 2 - (10 + Math.round(T * 0.36) + T * 0.64 * 3);

/** Letras escondidas: o "r" aparece só como contorno dentro da caixa fechada. */
const Escondido: React.FC<{ texto: string; fechado: boolean }> = ({ texto, fechado }) => (
  <span>
    {texto.split('').map((c, i) => (
      <span key={i} style={{ color: fechado ? 'transparent' : COR.preto, WebkitTextStroke: fechado && c === 'r' ? `3px ${COR.preto}` : undefined }}>
        {c}
      </span>
    ))}
  </span>
);

/** A virada: o morango volta, vira mor + ango, dois números; as letras ficam escondidas. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tMorango = palavra(B, 'morango.');
  const tLembra = 8;
  const tEle = palavra(B, 'ele', 0);
  const tMor = palavra(B, 'mor');
  const tRecebe = palavra(B, 'recebe');
  const tDois = palavra(B, 'números.');
  const tContar = palavra(B, 'fechadas,');
  const tPergunta = palavra(B, 'pergunta');
  const tSoletrar = palavra(B, 'erro');
  const tEnxerga = palavra(B, 'simplesmente');

  const xIn = naEsteira(frame, tLembra - 8, X0);
  const abertura = lin(frame, tMorango, tMorango + 8);
  const cadeadoCai = lin(frame, tMorango + 10, tMorango + 22);

  const golpe = tMor - 1;
  const cortado = frame >= golpe + 3;
  const abre = entra(frame, golpe + 3, 160);
  const xMor = X0 - L / 2 + larguraCaixa('mor', T) / 2 - abre * 60;
  const xAng = X0 + L / 2 - larguraCaixa('ango', T) / 2 + abre * 60;

  const fechado = frame >= tContar;
  const pTampa = entra(frame, tContar, 180);
  const altCaixa = T * 1.1 + 30 + 20 + 58;
  const viraNumero = frame >= tSoletrar;
  const anda = lin(frame, tEnxerga, tEnxerga + 90, 0, 1000);
  const gDy = -1100 * (1 - entra(frame, tEle - 8, 130)) - 1100 * lin(frame, golpe + 12, golpe + 22);

  return (
    <>
      <Som nome="sirene" em={0} duracao={30} volume={0.2} />
      <Som nome="guilhotina" em={golpe} />
      <Som nome="carimbo" em={tRecebe} />
      <Som nome="carimbo" em={tDois} />

      {!cortado ? (
        <MorangoTrancado x={xIn} base={ESTEIRA_Y} abertura={abertura} cadeadoDy={cadeadoCai * cadeadoCai * 700} semCadeado={cadeadoCai >= 1} />
      ) : null}

      {cortado && !viraNumero
        ? [
            { k: MORANGO[0], x: xMor, t: tRecebe },
            { k: MORANGO[1], x: xAng, t: tDois },
          ].map(({ k, x, t }) => (
            <React.Fragment key={k.id}>
              <CaixaToken
                texto={<Escondido texto={k.t} fechado={fechado} />}
                id={frame >= t ? k.id : undefined}
                idEscala={entra(frame, t, 220)}
                tamanho={T}
                x={x}
                base={ESTEIRA_Y}
              />
              {fechado ? (
                <div
                  style={{
                    position: 'absolute',
                    left: x - larguraCaixa(k.t, T) / 2 - 12,
                    top: ESTEIRA_Y - altCaixa - 26 - (1 - pTampa) * 200,
                    width: larguraCaixa(k.t, T) + 24,
                    height: 34,
                    background: COR.preto,
                    borderRadius: 12,
                  }}
                />
              ) : null}
            </React.Fragment>
          ))
        : null}

      <Destaque de={tPergunta} ate={tSoletrar - 12} top={560}>
        quantos “r”<br />tem aqui dentro?
      </Destaque>
      <Destaque de={tSoletrar + 2} top={560}>
        ela só vê<br />as etiquetas
      </Destaque>

      {/* só os números seguem */}
      {viraNumero
        ? MORANGO.map((k, i) => (
            <CaixaToken key={k.id} texto={String(k.id)} numero tamanho={84} x={(i === 0 ? xMor : xAng) + anda} base={ESTEIRA_Y} destaque />
          ))
        : null}

      <div style={{ opacity: 1 - lin(frame, golpe + 12, golpe + 18) }}>
        <Guilhotina x={CENTRO_X} top={G_TOP} golpe={tranco(frame, golpe)} dy={gDy} />
      </div>
    </>
  );
};

export const Virada: CenaEp = {
  Conteudo,
  Fundo: () => { const f = useCurrentFrame(); return <FundoAlerta deslocamento={f * 4} />; },
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'morango.') - 2, 500, 880, 1.2), ABERTO(palavra(B, 'ele') - 6), FECHADO(palavra(B, 'recebe') - 2, CENTRO_X, 880, 1.2), FECHADO(palavra(B, 'fechadas,') - 2, CENTRO_X, 800, 1.15), ABERTO(palavra(B, 'erro') - 2)],
};
