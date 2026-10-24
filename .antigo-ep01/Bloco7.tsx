import React from 'react';
import { useCurrentFrame } from 'remotion';
import { CaixaToken, Som, comEspaco } from '../components';
import { COR, FONTE, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin, mola, naEsteira, segue, suave, tranco } from '../anim';
import { palavra } from './tempo';
import { layoutCapital, T64 } from './Bloco6';
import { Carimbadora } from './Carimbadora';
import { BRASIL } from './dados';

const B = 6;
const BR = 4; // índice de " Brasil" na frase

/** O número: cada token tem um ID fixo; só o número entra no modelo. */
export const Bloco7: React.FC = () => {
  const frame = useCurrentFrame();
  const tNumero0 = palavra(B, 'número', 0);
  const tBrasil = palavra(B, 'brasil');
  const tEspaco = palavra(B, 'espaço');
  const tId = palavra(B, '15278');
  const tNumero = palavra(B, 'número', 1); // "só esse número"
  const tEntra = palavra(B, 'entra');
  const tNunca = palavra(B, 'letras');

  const capital = layoutCapital();
  const carimbos = capital.map((_, i) => tNumero0 - 4 + i * 5);
  const saiOutras = segue(frame, tBrasil - 6, 16);

  // " Brasil" vai para o centro e cresce
  const k = capital[BR];
  const bx = mola(frame, tBrasil - 2, k.x, CENTRO_X);
  const bBase = mola(frame, tBrasil - 2, k.base, ESTEIRA_Y);
  const bEsc = mola(frame, tBrasil - 2, 1, 84 / T64);

  const golpe = tId - 3;
  const textoSome = suave(frame, tNumero - 4, 8);
  const vai = segue(frame, tEntra, 22);
  const maqDy = -1100 * (1 - entra(frame, tBrasil + 6, 120)) - 1100 * lin(frame, tEntra - 6, tEntra + 6);
  const letras = BRASIL[0].t.trim().split('');

  return (
    <>
      {carimbos.map((t) => <Som key={t} nome="carimbo" em={t} volume={0.5} />)}
      <Som nome="carimbo" em={golpe + 3} />

      {/* as seis caixas chegam e recebem seus IDs */}
      {capital.map((c, i) => {
        if (i === BR || saiOutras >= 1400) return null;
        return (
          <CaixaToken
            key={i}
            texto={comEspaco(c.t)}
            id={frame >= carimbos[i] ? c.id : undefined}
            idEscala={entra(frame, carimbos[i], 220)}
            tamanho={T64}
            x={naEsteira(frame, 2 + i * 2, c.x) + saiOutras}
            base={c.base}
          />
        );
      })}

      {/* " Brasil" */}
      {vai < 1400 ? (
        textoSome < 1 ? (
          <CaixaToken
            texto={<span style={{ opacity: 1 - textoSome }}>{comEspaco(k.t)}</span>}
            id={frame >= carimbos[BR] ? k.id : undefined}
            idEscala={frame >= golpe + 3 ? 1 + 0.2 * (1 - lin(frame, golpe + 3, golpe + 12)) : entra(frame, carimbos[BR], 220)}
            tamanho={T64}
            x={frame < tBrasil - 2 ? naEsteira(frame, 2 + BR * 2, k.x) : bx}
            base={bBase}
            escala={bEsc}
            destaque={frame >= tBrasil}
          />
        ) : (
          <CaixaToken texto={String(k.id)} numero tamanho={84} x={CENTRO_X + vai} base={ESTEIRA_Y} destaque />
        )
      ) : null}

      {/* marca do espaço */}
      {frame >= tEspaco && frame < tId - 2 ? (
        <div
          style={{
            position: 'absolute',
            left: 100,
            top: 905,
            opacity: suave(frame, tEspaco, 6),
            fontFamily: FONTE.rotulo,
            fontWeight: 900,
            fontSize: 36,
            letterSpacing: 2,
            color: COR.preto,
          }}
        >
          ESPAÇO →
        </div>
      ) : null}

      {/* as letras ficam de fora */}
      {frame >= tNunca
        ? letras.map((l, i) => {
            const p = entra(frame, tNunca + i * 3, 150);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 270 + i * 110,
                  top: ESTEIRA_Y - 100 - (1 - p) * 300,
                  opacity: Math.min(1, p * 2),
                  fontFamily: FONTE.titulo,
                  fontSize: 84,
                  lineHeight: 1,
                  color: COR.preto,
                }}
              >
                {l}
              </div>
            );
          })
        : null}

      <Carimbadora x={CENTRO_X} top={560} golpe={tranco(frame, golpe)} curso={36} dy={maqDy} />
    </>
  );
};
