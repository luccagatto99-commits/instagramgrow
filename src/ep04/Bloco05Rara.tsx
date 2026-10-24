import React from 'react';
import { interpolate, Easing, useCurrentFrame } from 'remotion';
import { ABERTO, FECHADO, FichaDocumento, FundoEscritorio, Roleta, Som, TelaDividida, type CenaEp, type Fatia } from '../components';
import { COR, FONTE } from '../theme';
import { entra, lin } from '../anim';
import { palavra } from './tempo';
import { giroPara } from './Bloco04Escreve';

const B = 4;
const W = (800 - 24) / 2;
const COMUM: Fatia[] = [{ peso: 8, rotulo: 'Paris' }, { peso: 1 }, { peso: 1 }];
const RARA: Fatia[] = Array.from({ length: 6 }).map(() => ({ peso: 1, rotulo: '?' }));

const Pergunta: React.FC<{ texto: string; p: number }> = ({ texto, p }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: 16, textAlign: 'center', fontFamily: FONTE.titulo, fontSize: 30, color: COR.preto, opacity: p, lineHeight: 1.1 }}>{texto}</div>
);

/** Conhecida: o mais provável é o certo. Rara: nada se destaca e ela preenche o formato com algo plausível. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tConhecida = palavra(B, 'conhecida');
  const tFranca = palavra(B, 'frança');
  const tParis = palavra(B, 'paris');
  const tRara = palavra(B, 'rara');
  const tContinuar = palavra(B, 'continuar');
  const tCompleta = palavra(B, 'completa');
  const tNome = palavra(B, 'nome');
  const tNumero = palavra(B, 'número');
  const tData = palavra(B, 'data');

  const giroComum = interpolate(frame, [tFranca - 4, tParis], [0, giroPara(COMUM, 0)], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  // a roleta rara gira sem favorita e para em qualquer fatia quando ela precisa continuar
  const giroRara = interpolate(frame, [tRara, tCompleta], [0, giroPara(RARA, 3, 4)], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
  const pFicha = entra(frame, tCompleta - 2, 150);

  return (
    <>
      <Som nome="tique" em={tConhecida - 4} />
      <Som nome="carimbo" em={tParis} volume={0.5} />
      <Som nome="tique" em={tRara - 4} />
      {[tNome, tNumero, tData].map((t) => <Som key={t} nome="tique" em={t} volume={0.6} />)}

      <TelaDividida
        top={470}
        altura={500}
        titulos={['ASSUNTO COMUM', 'ASSUNTO RARO']}
        entrada={[entra(frame, tConhecida - 6, 140), entra(frame, tRara - 6, 140)]}
        esquerda={
          <>
            <Pergunta texto="capital da França?" p={lin(frame, palavra(B, 'pergunte') - 4, palavra(B, 'pergunte') + 4)} />
            <Roleta x={W / 2} y={220} raio={120} fatias={COMUM} giro={giroComum} vencedora={frame >= tParis ? 0 : undefined} />
          </>
        }
        direita={
          <>
            <Pergunta texto="um processo raro?" p={lin(frame, tRara - 4, tRara + 4)} />
            <Roleta x={W / 2} y={160} raio={70} fatias={RARA} giro={giroRara} vencedora={frame >= tCompleta ? 3 : undefined} />
            {pFicha > 0.01 ? (
              <FichaDocumento
                x={W / 2}
                base={436}
                largura={330}
                tamanho={26}
                escala={pFicha}
                nome={<span style={{ opacity: lin(frame, tNome - 2, tNome + 4) }}>Souza vs. Aérea Norte</span>}
                numero={
                  <>
                    <span style={{ opacity: lin(frame, tNumero - 2, tNumero + 4) }}>nº 4471</span>
                    <span style={{ opacity: lin(frame, tData - 2, tData + 4) }}> · 2019</span>
                  </>
                }
              />
            ) : null}
          </>
        }
      />
    </>
  );
};

export const Rara: CenaEp = {
  Conteudo,
  Fundo: () => <FundoEscritorio />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'paris') - 4, 540, 720, 1.05), ABERTO(palavra(B, 'rara') - 6), FECHADO(palavra(B, 'completa') - 2, 540, 760, 1.05)],
};
