import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, CaixaToken, Carimbadora, Destaque, FECHADO, FundoPrensa, Som, comEspaco, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin, naEsteira, pop, segue, tranco } from '../anim';
import { palavra } from './tempo';
import { CACHORRO } from './dados';

const B = 2;
const T = 72;
const MAQ_TOP = 600;
// o carimbo desce até o topo da caixa (sem ID ainda)
const CURSO = ESTEIRA_Y - (T * 1.1 + Math.round(T * 0.18) * 2 + 20) - (MAQ_TOP + 140 + 56);

/** Silhueta de traço, sem rosto. Duas pessoas bem diferentes. */
const Pessoa: React.FC<{ tipo: 0 | 1 }> = ({ tipo }) => (
  <svg width={200} height={200} viewBox="0 0 200 200" fill={COR.branco} stroke={COR.preto} strokeWidth={9} strokeLinejoin="round">
    {tipo === 0 ? (
      <>
        <path d="M60 196 L70 118 Q100 100 130 118 L140 196 Z" />
        <circle cx={100} cy={62} r={36} />
        <path d="M64 58 Q66 14 100 16 Q136 14 138 58 L138 96" fill="none" />
      </>
    ) : (
      <>
        <path d="M22 196 L40 130 Q100 104 160 130 L178 196 Z" />
        <circle cx={100} cy={80} r={32} />
        <rect x={56} y={44} width={88} height={14} rx={6} fill={COR.preto} />
        <rect x={72} y={10} width={56} height={40} rx={8} />
      </>
    )}
  </svg>
);

/** Ficha com uma pessoa e um CPF (números fictícios). */
const Ficha: React.FC<{ x: number; base: number; numero: string; tipo: 0 | 1; fim: number; marca: boolean }> = ({ x, base, numero, tipo, fim, marca }) => {
  const W = 330;
  const H = 400;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - W / 2,
        top: base - H,
        width: W,
        height: H,
        background: COR.branco,
        border: `${CONTORNO}px solid ${COR.preto}`,
        borderRadius: RAIO.caixa,
        boxShadow: SOMBRA,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 20,
      }}
    >
      <Pessoa tipo={tipo} />
      <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 30, letterSpacing: 2, color: COR.preto, marginTop: 30 }}>CPF</div>
      <div style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: 30, color: COR.azul, whiteSpace: 'nowrap', marginTop: 6 }}>
        {numero.slice(0, -2)}
        <span style={{ display: 'inline-block', transform: `scale(${fim})`, borderBottom: marca ? `5px solid ${COR.preto}` : undefined }}>{numero.slice(-2)}</span>
      </div>
    </div>
  );
};

/** O número é só uma etiqueta: CPFs parecidos, pessoas diferentes. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tNum = palavra(B, 'número', 0);
  const tCod = palavra(B, 'código');
  const tEtiq = palavra(B, 'etiqueta.');
  const tCpf = palavra(B, 'cpf');
  const tQuase = palavra(B, 'quase');
  const tParec = palavra(B, 'parecidas.');
  const tSoz = palavra(B, 'sozinho');

  const golpe = tNum - 3;
  const maqDy = -1100 * (1 - entra(frame, 2, 120)) - 1100 * lin(frame, tCod - 8, tCod + 2);
  const sai = segue(frame, tCpf - 8, 14);

  const xA = naEsteira(frame, tCpf - 2, 770);
  const xB = naEsteira(frame, tCpf + 6, 310);
  const fim = pop(frame, tQuase, 0.45);
  const pDif = entra(frame, tParec, 170);

  return (
    <>
      <Som nome="tique" em={0} />
      <Som nome="carimbo" em={golpe + 3} />
      <Som nome="tique" em={tCpf - 2} />
      <Som nome="tique" em={tCpf + 6} />

      {sai < 1400 ? (
        <CaixaToken
          texto={comEspaco(CACHORRO.t)}
          id={frame >= golpe + 3 ? CACHORRO.id : undefined}
          idEscala={entra(frame, golpe + 3, 220)}
          tamanho={T}
          x={naEsteira(frame, -6, CENTRO_X) + sai}
          base={ESTEIRA_Y}
          destaque
        />
      ) : null}
      <Carimbadora x={CENTRO_X} top={MAQ_TOP} golpe={tranco(frame, golpe)} curso={CURSO} dy={maqDy} />

      <Destaque de={tCod + 2} ate={tEtiq - 8} top={480} tamanho={64}>
        <span style={{ display: 'inline-flex', gap: 5, verticalAlign: 'middle', marginRight: 18 }}>
          {[6, 3, 8, 3, 3, 9, 4, 3, 7, 3].map((w, i) => (
            <span key={i} style={{ width: w, height: 56, background: COR.preto, display: 'inline-block' }} />
          ))}
        </span>
        ID = código de barras
      </Destaque>
      <Destaque de={tEtiq - 2} ate={tCpf - 8} top={480} tamanho={64}>
        o ID é só uma etiqueta
      </Destaque>

      {frame >= tCpf - 2 ? <Ficha x={xA} base={ESTEIRA_Y - 10} numero="123.456.789-01" tipo={0} fim={fim} marca={frame >= tQuase} /> : null}
      {frame >= tCpf + 6 ? <Ficha x={xB} base={ESTEIRA_Y - 10} numero="123.456.789-00" tipo={1} fim={fim} marca={frame >= tQuase} /> : null}
      {frame >= tParec ? (
        <div
          style={{
            position: 'absolute',
            left: CENTRO_X,
            top: 690,
            transform: `translate(-50%, 0) scale(${pDif})`,
            fontFamily: FONTE.titulo,
            fontSize: 110,
            lineHeight: 1,
            color: COR.preto,
          }}
        >
          ≠
        </div>
      ) : null}

      <Destaque de={tSoz - 4} top={470} tamanho={72}>
        número ≠ significado
      </Destaque>
    </>
  );
};

export const Etiqueta: CenaEp = {
  Conteudo,
  Fundo: () => { const f = useCurrentFrame(); return <FundoPrensa giro={f * 0.6} />; },
  planos: () => [
    ABERTO(0),
    FECHADO(palavra(B, 'número', 0) - 4, CENTRO_X, 860, 1.2),
    ABERTO(palavra(B, 'código') - 2),
    FECHADO(palavra(B, 'cpf') + 12, CENTRO_X, 780, 1.08),
    FECHADO(palavra(B, 'quase') - 2, CENTRO_X, 900, 1.18),
    ABERTO(palavra(B, 'parecidas.') - 2),
  ],
};
