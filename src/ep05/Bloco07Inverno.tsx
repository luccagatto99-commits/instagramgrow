import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Carimbo, FECHADO, FichaDocumento, FundoGalpao, Num, Som, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin, naEsteira, segue } from '../anim';
import { palavra } from './tempo';
import { Floco, PROMESSA, PlacaConceito } from './comum';

const B = 6;

// regras no estilo da ELIZA: o manual não acaba nunca
const REGRAS = [
  '“estou X” → “por que você está X?”',
  '“mãe” → “fale da sua família”',
  '“sim” → “tem certeza?”',
  '“sonho” → “o que ele sugere?”',
  '“não” → “por que não?”',
  '“sempre” → “dê um exemplo”',
  '“ninguém” → “ninguém mesmo?”',
  '“computador” → “isso preocupa você?”',
  '“talvez” → “você parece em dúvida”',
  '“lembro” → “o que mais você lembra?”',
];
const LINHA = 52;
const VISIVEIS = 5;

/** Regras não dão conta do mundo; a promessa falha; o dinheiro some; o inverno. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tRegras = palavra(B, 'regras');
  const tExcecoes = palavra(B, 'exceções');
  const tPromessas = palavra(B, 'promessas');
  const tFalharam = palavra(B, 'falharam,');
  const tDinheiro = palavra(B, 'dinheiro');
  const tSumiu = palavra(B, 'sumiu,');
  const tInverno = palavra(B, 'inverno');

  // a primeira regra entra na fala; as outras caem a partir de "exceções"
  const tRegra = (i: number) => (i === 0 ? tRegras - 2 : tExcecoes - 4 + (i - 1) * 5);
  const nLinhas = REGRAS.filter((_, i) => frame >= tRegra(i)).length;
  const saiPilha = segue(frame, tPromessas - 10, 14);
  const contador = Math.round(lin(frame, tExcecoes, tExcecoes + 50, 1, 4096));
  const saiPromessa = segue(frame, tInverno - 8, 14);
  const moedas = 1 - lin(frame, tSumiu - 2, tSumiu + 8);

  return (
    <>
      {REGRAS.map((_, i) => <Som key={i} nome="tique" em={tRegra(i) + 2} volume={0.5} />)}
      <Som nome="tique" em={tPromessas - 4} />
      <Som nome="carimbo" em={tFalharam} volume={0.6} />
      <Som nome="tique" em={tDinheiro - 2} />

      {frame >= tRegras - 6 && saiPilha < 1400 ? (
        <div
          style={{
            position: 'absolute',
            left: naEsteira(frame, tRegras - 6, CENTRO_X) + saiPilha,
            top: 600,
            width: 720,
            transform: 'translateX(-50%)',
            background: COR.branco,
            border: `${CONTORNO}px solid ${COR.preto}`,
            borderRadius: RAIO.caixa,
            boxShadow: SOMBRA,
            overflow: 'hidden',
          }}
        >
          <div style={{ background: COR.preto, color: COR.amarelo, padding: '12px 26px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 34, letterSpacing: 2 }}>
            <span>MANUAL DE REGRAS</span>
            <span style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: 40, letterSpacing: 0, opacity: frame >= tExcecoes - 4 ? 1 : 0 }}>{contador.toLocaleString('pt-BR')}</span>
          </div>
          <div style={{ height: LINHA * VISIVEIS + 20, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 26, right: 26, top: 10 - Math.max(0, nLinhas - VISIVEIS) * LINHA }}>
              {REGRAS.slice(0, nLinhas).map((r) => (
                <div key={r} style={{ height: LINHA, display: 'flex', alignItems: 'center', fontFamily: FONTE.rotulo, fontWeight: 700, fontSize: 32, color: COR.preto, whiteSpace: 'nowrap' }}>{r}</div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* a promessa dos vinte anos volta, carimbada */}
      {frame >= tPromessas + 2 && saiPromessa < 1400 ? (
        <>
          <FichaDocumento
            x={460 + saiPromessa}
            base={ESTEIRA_Y}
            escala={entra(frame, tPromessas + 2, 150)}
            rotulo={PROMESSA.rotulo}
            nome={PROMESSA.nome}
            numero={<>prazo: <Num>20</Num> anos</>}
            largura={440}
            tamanho={42}
            anulada={lin(frame, tFalharam - 2, tFalharam + 4)}
          >
            <Carimbo x={220} y={150} texto="FALHOU" em={tFalharam} tamanho={56} rot={-12} />
          </FichaDocumento>
          {frame >= tDinheiro - 4 && moedas > 0.01
            ? [0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: 830 + saiPromessa,
                    top: ESTEIRA_Y - 70 - i * 46,
                    width: 140,
                    height: 70,
                    transform: `translateX(-50%) scale(${entra(frame, tDinheiro - 4 + i * 3, 170) * moedas})`,
                    background: COR.branco,
                    border: `${CONTORNO}px solid ${COR.preto}`,
                    borderRadius: '50%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: FONTE.titulo,
                    fontSize: 40,
                    color: COR.preto,
                  }}
                >
                  $
                </div>
              ))
            : null}
        </>
      ) : null}

      {/* o inverno */}
      {frame >= tInverno - 6
        ? Array.from({ length: 14 }).map((_, i) => {
            const t0 = tInverno - 6 + i * 5;
            const y = 470 + (frame - t0) * (5 + (i % 3));
            if (frame < t0 || y > 1010) return null;
            return <Floco key={i} x={110 + ((i * 137) % 820)} y={y} tamanho={46 + (i % 3) * 14} giro={frame * 3 + i * 20} />;
          })
        : null}
      <PlacaConceito texto="INVERNO DA IA" top={600} p={entra(frame, tInverno + 8, 140)} />
    </>
  );
};

export const Inverno: CenaEp = {
  Conteudo,
  Fundo: () => <FundoGalpao />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'promessas') - 4, 560, 820, 1.08), ABERTO(palavra(B, 'inverno') - 6)],
};
