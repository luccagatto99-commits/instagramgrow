import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Cadeado, Calendario, FECHADO, FichaDocumento, FundoEscritorio, Som, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, RAIO, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin, naEsteira, segue } from '../anim';
import { palavra } from './tempo';
import { CAIXA_X, IconeMaquina, IconePessoa, TesteTuring } from './comum';

const B = 2;

/** Alan Turing: os códigos da guerra e o teste de 1950. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tTuring = palavra(B, 'turing,');
  const tQuebrar = palavra(B, 'quebrar');
  const tCodigos = palavra(B, 'códigos');
  const t1950 = palavra(B, '1950,');
  const tTeste = palavra(B, 'teste.');
  const tConversa = palavra(B, 'conversa');
  const tVer = palavra(B, 'ver.');
  const tPessoa = palavra(B, 'pessoa');
  const tMaquina = palavra(B, 'máquina,');
  const tPassou = palavra(B, 'passou.');

  const saiFicha = segue(frame, t1950 - 6, 14);
  const pTeste = entra(frame, tTeste - 6, 110);
  const oculto = frame < tPessoa - 2 ? undefined : frame < tMaquina - 2 ? <IconePessoa /> : <IconeMaquina />;
  const pPassou = entra(frame, tPassou - 2, 170);
  const fimBaloes = 1 - lin(frame, tVer + 10, tVer + 16);

  return (
    <>
      <Som nome="tique" em={tTuring - 4} />
      <Som nome="carimbo" em={tCodigos + 6} volume={0.4} />
      <Som nome="tique" em={tTeste - 4} />
      <Som nome="tique" em={tConversa} volume={0.6} />
      <Som nome="tique" em={tConversa + 22} volume={0.6} />
      <Som nome="tique" em={tPessoa - 2} />
      <Som nome="tique" em={tMaquina - 2} />
      <Som nome="carimbo" em={tPassou} volume={0.5} />

      <Calendario ano={1950} de={t1950 - 4} ate={tTeste - 10} />

      {saiFicha < 1400 ? (
        <>
          <FichaDocumento x={naEsteira(frame, tTuring - 8, CENTRO_X) + saiFicha} base={780} rotulo="MATEMÁTICO" nome="Alan Turing" numero="1912 – 1954" largura={520} tamanho={56} />
          {/* mensagem cifrada da guerra: o cadeado abre em "códigos" */}
          {frame >= tQuebrar - 6 ? (
            <div
              style={{
                position: 'absolute',
                left: CENTRO_X + saiFicha,
                top: ESTEIRA_Y,
                transform: `translate(-50%, -100%) scale(${entra(frame, tQuebrar - 6, 150)})`,
                transformOrigin: '50% 100%',
                background: COR.branco,
                border: `${CONTORNO}px solid ${COR.preto}`,
                borderRadius: RAIO.caixa,
                padding: '18px 30px 18px 120px',
                whiteSpace: 'nowrap',
              }}
            >
              <Cadeado x={62} y={50} tamanho={64} abertura={lin(frame, tCodigos + 2, tCodigos + 10)} />
              <span style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: 48, color: COR.preto, letterSpacing: 4 }}>{frame < tCodigos + 6 ? 'QXZR WKTA' : 'ATACAR 6H'}</span>
            </div>
          ) : null}
        </>
      ) : null}

      {frame >= tTeste - 6 ? (
        <TesteTuring
          p={pTeste}
          oculto={oculto}
          pA={entra(frame, tConversa - 2, 160) * fimBaloes}
          pB={entra(frame, tConversa + 20, 160) * fimBaloes}
          textoA="você gosta de música?"
          textoB="adoro samba!"
        />
      ) : null}

      {frame >= tPessoa - 6 ? (
        <div style={{ position: 'absolute', left: CAIXA_X, top: 700, transform: 'translateX(-50%)', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 38, letterSpacing: 2, color: COR.preto, opacity: lin(frame, tPessoa - 6, tPessoa) * (1 - lin(frame, tPassou - 4, tPassou)), whiteSpace: 'nowrap' }}>
          {frame < tMaquina - 2 ? 'PESSOA?' : 'MÁQUINA?'}
        </div>
      ) : null}
      {pPassou > 0.01 ? (
        <div style={{ position: 'absolute', left: CAIXA_X, top: 720, transform: `translate(-50%, -50%) scale(${pPassou}) rotate(-4deg)`, background: COR.verde, border: `${CONTORNO}px solid ${COR.preto}`, borderRadius: RAIO.caixa, padding: '12px 26px 8px', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 44, letterSpacing: 3, color: COR.preto }}>
          PASSOU
        </div>
      ) : null}
    </>
  );
};

export const Turing: CenaEp = {
  Conteudo,
  Fundo: () => <FundoEscritorio />,
  planos: () => [
    ABERTO(0),
    FECHADO(palavra(B, 'quebrar') - 2, CENTRO_X, 860, 1.1),
    ABERTO(palavra(B, 'teste.') - 6),
    FECHADO(palavra(B, 'pessoa') - 4, 680, 820, 1.08),
    ABERTO(palavra(B, 'passou.') - 6),
  ],
};
