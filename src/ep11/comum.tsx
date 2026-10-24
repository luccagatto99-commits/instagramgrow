import React from 'react';
import { interpolate, spring, useCurrentFrame } from 'remotion';
import {
  Caixa3D, Esteira3D, FundoEscritorio, FundoGalpao, FundoMapa, FundoPrateleiras, FundoPrensa, FundoReuniao,
  No3D, Palco3D, PoeiraRuido, QuadroRuido, useCamada, type Camera3D,
} from '../components';
import { durBloco, inicioBloco } from './tempo';
import { BatenteZebrado, EsteiraCorredor, FaixaChao, Maquina3D, Palete3D, VigaTeto } from './fabrica';
import { COR, FONTE, FPS } from '../theme';

const P = COR.preto;

/**
 * Cachorro de contorno (mesmo desenho do ep10) com rabo, orelha e pelo que se mexem.
 * Caixa local ≈ 0..235 × −15..126, olhando para a direita.
 */
export const CachorroVivo: React.FC<{ t: number; cor?: string; vento?: number; transform?: string }> = ({ t, cor = COR.branco, vento = 0, transform }) => {
  const rabo = Math.sin(t / 3) * 16;
  const orelha = Math.sin(t / 5) * (4 + vento * 14) - vento * 10;
  const tufo = (i: number) => Math.sin(t / 4 + i) * (3 + vento * 8) - vento * 8;
  const olho = cor === P ? COR.branco : P;
  return (
    <g transform={transform} stroke={P} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round">
      <path d="M22 48 Q2 22 14 0" fill="none" strokeWidth={9} transform={`rotate(${rabo} 22 48)`} />
      {[34, 58, 124, 148].map((lx) => (
        <rect key={lx} x={lx} y={58} width={20} height={68} rx={9} fill={cor} />
      ))}
      <polygon points="138,42 164,2 196,20 170,64" fill={cor} />
      <ellipse cx={95} cy={55} rx={80} ry={34} fill={cor} />
      {/* pelo do dorso */}
      {[52, 82, 112].map((x, i) => (
        <path key={x} d={`M${x} 23 q ${-10 + tufo(i)} -14 ${-22 + tufo(i) * 2} -8`} fill="none" strokeWidth={6} />
      ))}
      <circle cx={180} cy={14} r={30} fill={cor} />
      <ellipse cx={210} cy={26} rx={21} ry={13} fill={cor} />
      <circle cx={229} cy={21} r={6} fill={olho} stroke="none" />
      <path d="M166 -10 Q148 10 158 38 Q172 22 178 -6 Z" fill={cor === P ? COR.branco : P} transform={`rotate(${orelha} 172 -8)`} />
      <circle cx={190} cy={7} r={5} fill={olho} stroke="none" />
    </g>
  );
};

/** Posição do cachorro dentro da cena (viewBox 400 × 300) e da orelha, para ligar quadros vizinhos. */
export const CACHORRO_X = 70;
export const orelhaNaCena = (passo = 0): [number, number] => [CACHORRO_X + passo + 0.9 * 164, 140 + 0.9 * 12];

/**
 * "Um cachorro na praia" desenhado em traço, já se mexendo (viewBox 400 × 300).
 * `t` = frame da animação; `cor` = cor do cachorro; `tremor` sacode o fundo; `quebra` 0 → 1 levanta a onda;
 * `vento` faz o pelo e a orelha balançarem; `passo` anda o cachorro para a direita.
 */
export const CenaPraiaViva: React.FC<{ t: number; cor?: string; tremor?: number; quebra?: number; vento?: number; passo?: number }> = ({
  t, cor, tremor = 0, quebra = 0, vento = 0, passo = 0,
}) => {
  const tx = tremor ? Math.sin(t * 2.3) * tremor : 0;
  const ty = tremor ? Math.cos(t * 3.1) * tremor * 0.7 : 0;
  const mar = (t * 1.6) % 50;
  const crista = 34 + quebra * 40 + Math.sin(t / 7) * 6;
  return (
    <g>
      <rect width={400} height={300} fill={COR.branco} />
      <g transform={`translate(${tx} ${ty})`}>
        <circle cx={330} cy={66} r={32} fill={COR.amarelo} stroke={P} strokeWidth={6} />
        <g fill="none" stroke={P} strokeWidth={5} strokeLinecap="round">
          <path transform={`translate(${-mar} 0)`} d="M0 170 Q25 160 50 170 T100 170 T150 170 T200 170 T250 170 T300 170 T350 170 T400 170 T450 170" />
          <path transform={`translate(${-((mar * 1.4) % 50)} 0)`} d="M180 190 Q205 180 230 190 T280 190 T330 190 T380 190 T430 190" />
          {/* onda que quebra, à direita */}
          <path d={`M300 200 Q330 ${200 - crista} 368 ${200 - crista * 0.8} Q392 ${200 - crista * 0.55} 384 ${200 - crista * 0.25} Q370 ${200 - crista * 0.45} 360 ${200 - crista * 0.3}`} strokeWidth={6} />
        </g>
        <path d="M0 212 Q200 196 400 212 L400 300 L0 300 Z" fill={COR.amarelo} stroke={P} strokeWidth={6} />
      </g>
      <CachorroVivo t={t} cor={cor} vento={vento} transform={`translate(${CACHORRO_X + passo} 140) scale(0.9)`} />
    </g>
  );
};

/** Tela com volume (quadro de pontos sobre a imagem), apoiada pela base no ponto (0, 0). */
export const Tela3D: React.FC<{
  w: number;
  nivel?: number;
  nivelEm?: (cx: number) => number;
  semente?: number;
  cols?: number;
  d?: number;
  children: React.ReactNode;
  sobre?: React.ReactNode;
  pe?: boolean;
}> = ({ w, nivel = 0, nivelEm, semente = 1, cols = 40, d = 64, children, sobre, pe = true }) => {
  const h = (w * 3) / 4;
  const alturaPe = pe ? PE_TELA : 0;
  return (
    <>
    {pe ? (
      <>
        <Caixa3D w={w * 0.42} h={18} d={d * 2.4} cor={P} borda={0} />
        <No3D y={-18} z={-d * 0.2}>
          <Caixa3D w={44} h={alturaPe - 18} d={24} cor={P} borda={0} />
        </No3D>
      </>
    ) : null}
    <No3D y={-alturaPe}>
    <Caixa3D
      w={w}
      h={h}
      d={d}
      raio={20}
      borda={0}
      corTopo={COR.branco}
      frente={
        <QuadroRuido x={w / 2} base={h} largura={w} nivel={nivel} nivelEm={nivelEm} semente={semente} cols={cols} sombra={false} sobre={sobre}>
          {children}
        </QuadroRuido>
      }
    />
    </No3D>
    </>
  );
};
/** Altura do pé da Tela3D (a imagem começa acima dele). */
export const PE_TELA = 56;

/** Um quadro de rolo de filme: faixa preta com furos amarelos e a imagem no meio. Apoiado pela base. */
export const QuadroFilme3D: React.FC<{
  w: number;
  nivel?: number;
  semente?: number;
  cols?: number;
  children: React.ReactNode;
  sobre?: React.ReactNode;
}> = ({ w, nivel = 0, semente = 1, cols = 20, children, sobre }) => {
  const h = (w * 3) / 4;
  const faixa = Math.round(w * 0.14);
  const W = w + 24;
  const H = h + faixa * 2;
  const furos = 5;
  const furo = (y: number) =>
    Array.from({ length: furos }).map((_, i) => (
      <div
        key={`${y}-${i}`}
        style={{ position: 'absolute', top: y, left: 12 + ((W - 24) / furos) * (i + 0.5) - faixa * 0.3, width: faixa * 0.6, height: faixa * 0.5, borderRadius: 6, background: COR.amarelo }}
      />
    ));
  return (
    <Caixa3D
      w={W}
      h={H}
      d={18}
      raio={10}
      cor={P}
      borda={0}
      frente={
        <>
          {furo(faixa * 0.25)}
          {furo(H - faixa * 0.75)}
          <div style={{ position: 'absolute', left: 12, top: faixa, width: w, height: h }}>
            <QuadroRuido x={w / 2} base={h} largura={w} nivel={nivel} semente={semente} cols={cols} sombra={false} sobre={sobre}>
              {children}
            </QuadroRuido>
          </div>
        </>
      }
    />
  );
};
/** Altura total do QuadroFilme3D para uma largura de imagem `w`. */
export const alturaFilme = (w: number) => (w * 3) / 4 + Math.round(w * 0.14) * 2;

export const ALTURA_ESTEIRA = 46;

// ─── A fábrica por dentro ───────────────────────────────────────────────────────────
// Cada bloco acontece numa SALA. As salas ficam uma atrás da outra (eixo z, para dentro da tela),
// separadas por paredes com uma porta. Na virada de bloco a câmera anda para a frente e atravessa
// a porta até a sala seguinte, como quem caminha dentro da fábrica.
//
// CSS 3D desenha errado o que chega perto da câmera ou passa por trás dela: tudo aqui é feito
// de peças curtas, e cada peça some ANTES de chegar perto (`visivel`), já fora do quadro.

export const SALA_PROF = 4200; // profundidade de cada sala
export const ESTACAO_Z = [0, 1, 2, 3, 4, 5].map((k) => -k * SALA_PROF);
export const VIAGEM = 40; // frames da caminhada entre salas (começo de cada bloco)
const MEIA = SALA_PROF / 2;
const PAREDE_X = 1300; // paredes laterais
const PE_DIREITO = 1400;
const PORTA = 860; // meia largura da porta: os batentes ficam fora da faixa dos textos do hud (x 215–865)
const COR_PAREDE = `var(--fundo-parede, ${COR.amarelo})`;
const PERSPECTIVA = 1700;

/** Coluna branca com volume. */
const Coluna: React.FC<{ x: number; z: number; h?: number; w?: number }> = ({ x, z, h = 1000, w = 90 }) => (
  <No3D x={x} z={z}>
    <Caixa3D w={w} h={h} d={w} borda={8} />
  </No3D>
);

/** Arquivo de aço do escritório: gavetas com puxador. */
const Arquivo: React.FC<{ x: number; z: number }> = ({ x, z }) => (
  <No3D x={x} z={z}>
    <Caixa3D
      w={230}
      h={340}
      d={170}
      raio={12}
      frente={
        <>
          {[0, 1, 2].map((g) => (
            <div key={g} style={{ position: 'absolute', left: 14, right: 14, top: 14 + g * 104, height: 90, border: `6px solid ${P}`, borderRadius: 8, boxSizing: 'border-box' }}>
              <div style={{ position: 'absolute', left: '50%', top: 18, width: 60, height: 14, marginLeft: -30, background: P, borderRadius: 7 }} />
            </div>
          ))}
        </>
      }
    />
  </No3D>
);

/** Caixote de madeira (traço): quadrado com a cruz de reforço. */
const Caixote: React.FC<{ x: number; y?: number; z: number; t?: number }> = ({ x, y = 0, z, t = 170 }) => (
  <No3D x={x} y={y} z={z}>
    <Caixa3D
      w={t}
      h={t}
      d={t}
      frente={
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
          <path d="M8 8 L92 92 M92 8 L8 92" stroke={P} strokeWidth={6} fill="none" />
        </svg>
      }
    />
  </No3D>
);

/** Estante do depósito: montantes, duas prateleiras e caixas guardadas. */
const Estante: React.FC<{ x: number; z: number }> = ({ x, z }) => (
  <No3D x={x} z={z}>
    {[-170, 170].flatMap((mx) =>
      [-80, 80].map((mz) => (
        <No3D key={`${mx}:${mz}`} x={mx} z={mz}>
          <Caixa3D w={22} h={360} d={22} cor={P} borda={0} />
        </No3D>
      )),
    )}
    {[130, 340].map((y, k) => (
      <React.Fragment key={y}>
        <No3D y={-y}>
          <Caixa3D w={380} h={20} d={190} borda={6} />
        </No3D>
        {[-100, 70].map((bx, b) => (
          <No3D key={bx} x={bx + ((k + b) % 2) * 20} y={-y - 20}>
            <Caixa3D w={110 + ((k + b) % 3) * 20} h={90 + (b % 2) * 30} d={110} borda={6} />
          </No3D>
        ))}
      </React.Fragment>
    ))}
  </No3D>
);

// objetos de cada sala, com z relativo ao centro da sala (o conteúdo do bloco fica em z = 0)
type Objeto = { el: (z: number) => React.ReactNode; z: number };
const col = (x: number, z: number): Objeto => ({ z, el: (zz) => <Coluna x={x} z={zz} /> });
const par = (z: number, el: (x: number, z: number) => React.ReactNode): Objeto[] => [-1, 1].map((l) => ({ z, el: (zz) => el(l * 1020, zz) }));
// objeto típico de cada sala, nos dois lados: atrás do conteúdo (z −700) e no caminho de quem chega (z +700)
const SALAS: { Fundo: React.FC; objetos: Objeto[]; esteira: boolean }[] = [
  { Fundo: FundoGalpao, esteira: true, objetos: [col(-1050, -700), col(1050, -700), col(-1050, 700), col(1050, 700)] },
  { Fundo: FundoEscritorio, esteira: true, objetos: [...par(-700, (x, z) => <Arquivo x={x} z={z} />), ...par(700, (x, z) => <Arquivo x={x} z={z} />)] },
  {
    Fundo: FundoPrensa,
    esteira: true,
    objetos: [...par(-700, (x, z) => <Caixote x={x} z={z} />), ...par(700, (x, z) => <Caixote x={x} z={z} t={150} />), { z: -700, el: (z) => <Caixote x={-1020} y={-170} z={z} t={150} /> }],
  },
  { Fundo: FundoReuniao, esteira: true, objetos: [col(-1050, -700), col(1050, -700), col(-1050, 700), col(1050, 700)] },
  { Fundo: FundoMapa, esteira: true, objetos: [...par(-700, (x, z) => <Arquivo x={x} z={z} />), col(-1050, 700), col(1050, 700)] },
  { Fundo: FundoPrateleiras, esteira: false, objetos: [...par(-700, (x, z) => <Estante x={x} z={z} />), ...par(700, (x, z) => <Estante x={x} z={z} />)] },
];

/**
 * Equipamentos de toda sala (o que faz parecer fábrica no caminho da câmera), z relativo ao centro:
 * esteiras laterais levando caixas (atrás do conteúdo), máquinas trabalhando, paletes, faixas
 * zebradas no chão e vigas com luminárias no teto. Lados e tipos alternam de sala para sala.
 */
const Equipamentos: React.FC<{ k: number; z0: number; t: number; zMax: number; chegou: boolean }> = ({ k, z0, t, zMax, chegou }) => {
  // as fileiras da entrada (z > 300) só servem à caminhada: quando a câmera chega (já fora do quadro)
  // elas saem, para não aparecer coladas no conteúdo quando a câmera gira
  const v = (z: number) => z0 + z + 160 < zMax && !(chegou && z > 300);
  const lado = k % 2 ? -1 : 1;
  const itens: [number, React.ReactNode][] = [
    [-1200, <Maquina3D key="m1" x={-880} z={z0 - 1200} t={t} variante={k * 2} teto={PE_DIREITO} />],
    [-1200, <Maquina3D key="m2" x={880} z={z0 - 1200} t={t} variante={k * 2 + 1} teto={PE_DIREITO} />],
    [-1750, <Maquina3D key="m3" x={lado * 880} z={z0 - 1750} t={t} variante={k + 1} teto={PE_DIREITO} />],
    [-1750, <Palete3D key="p1" x={-lado * 1000} z={z0 - 1750} semente={k * 7 + 1} />],
    // caminho de quem chega: fileiras dos dois lados, coladas no corredor (fora do quadro quando a câmera para)
    [450, <Maquina3D key="m4" x={-lado * 760} z={z0 + 450} t={t} variante={k + 2} teto={PE_DIREITO} />],
    [450, <Palete3D key="p2" x={lado * 760} z={z0 + 450} semente={k * 7 + 2} />],
    [1050, <Palete3D key="p3" x={-lado * 760} z={z0 + 1050} semente={k * 7 + 3} />],
    [1050, <Maquina3D key="m5" x={lado * 760} z={z0 + 1050} t={t} variante={k + 3} teto={PE_DIREITO} />],
    [1650, <Maquina3D key="m6" x={-lado * 760} z={z0 + 1650} t={t} variante={k + 4} teto={PE_DIREITO} />],
    [1650, <Maquina3D key="m7" x={lado * 760} z={z0 + 1650} t={t} variante={k + 5} teto={PE_DIREITO} />],
  ];
  return (
    <>
      {[-1, 1].map((l) => <FaixaChao key={`f${l}`} x={l * 470} de={z0 - MEIA + 60} ate={z0 + MEIA - 60} zMax={zMax} />)}
      {[-1, 1].map((l) => <EsteiraCorredor key={`e${l}`} x={l * 620} de={z0 - MEIA + 80} ate={z0 - 450} t={t + l * 37} zMax={zMax} />)}
      {itens.map(([z, el]) => (v(z) ? el : null))}
      {[-1750, -1050, -350, 350, 1050, 1750].map((z) => (v(z) ? <VigaTeto key={`v${z}`} z={z0 + z} largura={PAREDE_X * 2} teto={PE_DIREITO} /> : null))}
    </>
  );
};

/**
 * Parede lateral em faixas de `FAIXA` px, com o cenário de traço da sala (dois desenhos por parede).
 * `lado` −1 = esquerda, 1 = direita. Só desenha as faixas que estão longe da câmera (`zMax`).
 */
const FAIXA = 700;
const ARTE = MEIA; // cada cópia do cenário cobre meia parede
const ESC_ARTE = ARTE / 1080; // os cenários de traço são desenhados em 1080 de largura
const ParedeLateral: React.FC<{ lado: -1 | 1; z0: number; Fundo: React.FC; zMax: number }> = ({ lado, z0, Fundo, zMax }) => {
  const n = SALA_PROF / FAIXA;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        // u: distância ao longo da parede, de quem olha de dentro da sala (esquerda→direita da arte)
        const u0 = i * FAIXA;
        const zc = lado < 0 ? z0 + MEIA - u0 - FAIXA / 2 : z0 - MEIA + u0 + FAIXA / 2;
        if (zc + FAIXA / 2 > zMax) return null;
        const copia = Math.floor(u0 / ARTE);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: FAIXA + 1,
              height: PE_DIREITO,
              left: -FAIXA / 2,
              top: -PE_DIREITO,
              background: COR_PAREDE,
              overflow: 'hidden',
              transformOrigin: '50% 100%',
              transform: `translate3d(${lado * PAREDE_X}px, 0, ${zc}px) rotateY(${-lado * 90}deg)`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: 1080,
                height: 1920,
                left: copia * ARTE - u0,
                top: PE_DIREITO - 1046 * ESC_ARTE,
                transform: `scale(${ESC_ARTE})`,
                transformOrigin: '0 0',
              }}
            >
              <Fundo />
            </div>
            {/* rodapé */}
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 12, background: P, opacity: 0.6 }} />
          </div>
        );
      })}
    </>
  );
};

/** Parede do fundo da sala com a passagem larga para a próxima (batentes brancos com volume, sem viga). */
const ParedeComPorta: React.FC<{ z: number }> = ({ z }) => {
  const painel = (x0: number, x1: number, y0: number, y1: number, k: string) => (
    <div
      key={k}
      style={{ position: 'absolute', left: x0, top: -y1, width: x1 - x0, height: y1 - y0, background: COR_PAREDE, borderBottom: `8px solid rgba(17,17,17,0.35)`, boxSizing: 'border-box', transform: `translateZ(${z}px)` }}
    />
  );
  return (
    <>
      {painel(-PAREDE_X - 2, -PORTA - 40, 0, PE_DIREITO, 'e')}
      {painel(PORTA + 40, PAREDE_X + 2, 0, PE_DIREITO, 'd')}
      {[-1, 1].map((l) => (
        <BatenteZebrado key={l} x={l * (PORTA + 25)} z={z} altura={PE_DIREITO} />
      ))}
    </>
  );
};

/** Chão em ladrilhos (linhas de traço) de uma sala; só os ladrilhos longe da câmera. */
const ChaoSala: React.FC<{ z0: number; zMax: number }> = ({ z0, zMax }) => {
  const passo = 240;
  const LAD = passo * 3;
  const nx = Math.ceil((PAREDE_X * 2) / LAD);
  const nz = Math.ceil(SALA_PROF / LAD);
  const lad: React.ReactNode[] = [];
  for (let i = 0; i < nx; i++) {
    for (let k = 0; k < nz; k++) {
      const x = -PAREDE_X + (i + 0.5) * LAD;
      const z = z0 + MEIA - (k + 0.5) * LAD;
      if (z + LAD / 2 > zMax) continue;
      lad.push(
        <div key={`${i}:${k}`} style={{ position: 'absolute', width: LAD, height: LAD, left: -LAD / 2, top: -LAD / 2, transform: `translate3d(${x}px, 1px, ${z}px) rotateX(90deg)` }}>
          <svg width={LAD} height={LAD} style={{ position: 'absolute', overflow: 'visible' }} stroke={`var(--traco, ${P})`} strokeWidth={8}>
            {[0, 1, 2].map((n) => (
              <g key={n}>
                <line x1={n * passo} y1={0} x2={n * passo} y2={LAD} />
                <line x1={0} y1={n * passo} x2={LAD} y2={n * passo} />
              </g>
            ))}
          </svg>
        </div>,
      );
    }
  }
  return <div style={{ position: 'absolute', left: 0, top: 0, transformStyle: 'preserve-3d', opacity: 0.16 }}>{lad}</div>;
};

const suaviza = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
/** Posição z da câmera durante o bloco `b` (caminha da sala anterior nos primeiros frames). */
export const camZNoBloco = (b: number, frame: number) =>
  b === 0 ? ESTACAO_Z[0] : ESTACAO_Z[b - 1] + (ESTACAO_Z[b] - ESTACAO_Z[b - 1]) * suaviza(frame / VIAGEM);

const LIMITE_PALCO = 1130;
const TOPO_PALCO = 440; // abaixo da placa de área: o cenário 3D nunca passa por trás dela

/**
 * O palco 3D: as salas da fábrica (paredes com porta, chão, esteira, objetos e pontos soltos no ar),
 * com a câmera na sala do bloco. O conteúdo do bloco fica no centro da sala dele: aparece quando a
 * câmera chega e se recolhe nos últimos frames, antes da caminhada seguinte.
 * Só desenha na camada do mundo (a cópia do hud não repete o 3D).
 */
export const Fabrica3D: React.FC<{
  bloco: number;
  cam: Camera3D;
  rolando?: number; // deslocamento dos roletes (padrão: andam sempre)
  poeira?: number; // opacidade dos pontos soltos no ar (0 = sem)
  children?: React.ReactNode;
}> = ({ bloco, cam, rolando, poeira = 0.3, children }) => {
  const frame = useCurrentFrame();
  if (useCamada() === 'hud') return null;
  const andar = bloco === 0 ? 1 : suaviza(frame / VIAGEM);
  const camZ = camZNoBloco(bloco, frame);
  // passo de caminhada: a câmera sobe e desce de leve enquanto anda
  const passo = bloco > 0 && andar < 1 ? Math.sin(andar * Math.PI * 6) * 7 * Math.sin(andar * Math.PI) : 0;
  const foco: [number, number, number] = [cam.foco?.[0] ?? 0, (cam.foco?.[1] ?? 0) + passo, cam.foco?.[2] ?? 0];
  // z do olho no mundo (aproximado) e limite do que pode ser desenhado
  const zOlho = camZ + foco[2] + PERSPECTIVA - (cam.zoom ?? 0);
  const zMax = zOlho - 260;
  const visivel = (z: number) => z < zMax;
  const dur = durBloco(bloco);
  const chega = bloco === 0 ? 1 : suaviza((frame - (VIAGEM - 14)) / 14);
  const sai = bloco === ESTACAO_Z.length - 1 ? 0 : suaviza((frame - (dur - 9)) / 8);
  const esc = chega * (1 - sai);
  // só a sala atual e a anterior (durante a caminhada). A próxima não aparece pela porta: lá longe,
  // a esteira dela cairia bem na faixa dos textos do hud.
  const salas = SALAS.map((_, k) => k).filter((k) => k >= bloco - 1 && k <= bloco);
  // o 3D fica entre a placa e a legenda (440 ≤ y < 1130), mesmo quando a câmera gira forte
  return (
    <div style={{ position: 'absolute', inset: 0, clipPath: `inset(${TOPO_PALCO}px 0 ${1920 - LIMITE_PALCO}px 0)` }}>
      <Palco3D {...cam} foco={foco} perspectiva={PERSPECTIVA}>
        <No3D z={-camZ}>
          {salas.map((k) => {
            const z0 = ESTACAO_Z[k];
            const sala = SALAS[k];
            return (
              <React.Fragment key={k}>
                <ChaoSala z0={z0} zMax={zMax} />
                <ParedeLateral lado={-1} z0={z0} Fundo={sala.Fundo} zMax={zMax} />
                <ParedeLateral lado={1} z0={z0} Fundo={sala.Fundo} zMax={zMax} />
                {k < SALAS.length - 1 && visivel(z0 - MEIA) ? <ParedeComPorta z={z0 - MEIA} /> : null}
                {sala.esteira && visivel(z0 + 100) ? (
                  <Esteira3D deslocamento={rolando ?? (inicioBloco(bloco) + frame) * 4} de={-PAREDE_X} ate={PAREDE_X} z={z0} />
                ) : null}
                <Equipamentos k={k} z0={z0} t={inicioBloco(bloco) + frame} zMax={zMax} chegou={k === bloco && (bloco === 0 || frame >= VIAGEM - 12)} />
                {sala.objetos.map((o, n) => (visivel(z0 + o.z + 120) ? <React.Fragment key={n}>{o.el(z0 + o.z)}</React.Fragment> : null))}
                {poeira > 0 ? (
                  <No3D z={z0}>
                    <PoeiraRuido frame={inicioBloco(bloco) + frame} opacidade={poeira} zMax={zMax - z0} />
                  </No3D>
                ) : null}
              </React.Fragment>
            );
          })}
          {esc > 0.01 ? (
            <No3D z={ESTACAO_Z[bloco]} escala={esc}>
              {children}
            </No3D>
          ) : null}
        </No3D>
      </Palco3D>
    </div>
  );
};

/** Mesa de traço com volume: tampo e quatro pés. Apoiada pela base. */
export const Mesa3D: React.FC<{ w?: number; d?: number; altura?: number }> = ({ w = 440, d = 220, altura = 200 }) => {
  const pe = 26;
  const tampo = 28;
  return (
    <>
      {[
        [-w / 2 + 30, -d / 2 + 30],
        [w / 2 - 30, -d / 2 + 30],
        [-w / 2 + 30, d / 2 - 30],
        [w / 2 - 30, d / 2 - 30],
      ].map(([x, z]) => (
        <No3D key={`${x}-${z}`} x={x} z={z}>
          <Caixa3D w={pe} h={altura - tampo} d={pe} cor={COR.branco} borda={6} />
        </No3D>
      ))}
      <No3D y={-(altura - tampo)}>
        <Caixa3D w={w} h={tampo} d={d} cor={COR.branco} borda={8} />
      </No3D>
    </>
  );
};

/** Copo de traço (recorte plano, de frente). Apoiado pela base. */
export const Copo: React.FC<{ w?: number }> = ({ w = 96 }) => {
  const h = w * 1.3;
  return (
    <svg width={w} height={h} viewBox="0 0 96 125" style={{ position: 'absolute', left: -w / 2, top: -h, overflow: 'visible' }}>
      <path d="M8 6 L88 6 L78 119 L18 119 Z" fill={COR.branco} stroke={P} strokeWidth={8} strokeLinejoin="round" />
      <path d="M14 46 L82 46" stroke={P} strokeWidth={6} />
      <path d="M26 20 L22 100" stroke={P} strokeWidth={5} strokeLinecap="round" opacity={0.5} />
    </svg>
  );
};

/**
 * Selo "em 90s" (igual ao da capa) que, em `vira`, gira e vira um cronômetro 1:30 contando
 * para trás até 0:00 em `fim`. Fica à direita da barra de progresso, dentro da zona segura.
 */
export const Cronometro90: React.FC<{ vira: number; fim: number; x?: number; top?: number }> = ({ vira, fim, x = 873, top = 245 }) => {
  const frame = useCurrentFrame();
  const giro = interpolate(frame, [vira - 4, vira, vira + 4], [1, 0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const relogio = frame >= vira;
  const resta = Math.max(0, Math.ceil(90 * (1 - Math.min(1, (frame - vira) / (fim - vira)))));
  const texto = relogio ? `${Math.floor(resta / 60)}:${String(resta % 60).padStart(2, '0')}` : 'em 90s';
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top,
        transform: `translateX(-50%) scaleX(${Math.max(0.02, giro)})`,
        background: COR.vermelho,
        border: `5px solid ${P}`,
        borderRadius: 999,
        padding: '4px 18px 2px',
        fontFamily: relogio ? FONTE.numero : FONTE.rotulo,
        fontWeight: relogio ? 800 : 900,
        fontSize: 32,
        letterSpacing: relogio ? 0 : 1,
        color: COR.branco,
        whiteSpace: 'nowrap',
        lineHeight: 1.2,
      }}
    >
      {texto}
    </div>
  );
};

/** Milhar com ponto (1.000.000). */
export const milhar = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/**
 * Movimento de câmera 3D por chaves: a partir de cada frame-chave a câmera vai (com spring, sem
 * overshoot) para os valores daquela chave. Valores não informados continuam como estavam.
 * Com `bloco`: o bloco começa no plano NEUTRO (o mesmo em que o anterior terminou, durante a viagem),
 * vai para a primeira chave quando chega à estação e volta ao NEUTRO no fim, para a próxima viagem.
 * Por cima, um balanço lento em `ry` (no tempo do vídeo, contínuo entre blocos) deixa o 3D vivo.
 */
type ChaveCam = { em: number; rx?: number; ry?: number; zoom?: number; foco?: [number, number, number]; centra?: number };
const NEUTRO = { rx: 16, ry: 0, zoom: -150, foco: [0, -180, 0] as [number, number, number], centra: 0 };
export const cameraPor = (frame: number, chavesBloco: ChaveCam[], balanco = 2.5, bloco?: number): Camera3D => {
  let chaves = chavesBloco;
  if (bloco !== undefined && bloco > 0) {
    const [primeira, ...resto] = chavesBloco;
    chaves = [{ em: 0, ...NEUTRO }, { ...primeira, em: VIAGEM - 10 }, ...resto.map((c) => ({ ...c, em: Math.max(c.em, VIAGEM - 4) }))];
  }
  if (bloco !== undefined && bloco < ESTACAO_Z.length - 1) chaves = [...chaves, { em: durBloco(bloco) - 20, ...NEUTRO }];
  let rx = chaves[0].rx ?? 16;
  let ry = chaves[0].ry ?? 0;
  let zoom = chaves[0].zoom ?? 0;
  let foco: [number, number, number] = chaves[0].foco ?? [0, 0, 0];
  let centra = chaves[0].centra ?? 0;
  for (const c of chaves.slice(1)) {
    if (frame < c.em) break;
    const p = spring({ frame: frame - c.em, fps: FPS, config: { damping: 22, stiffness: 60, mass: 1 } });
    if (c.rx !== undefined) rx += (c.rx - rx) * p;
    if (c.ry !== undefined) ry += (c.ry - ry) * p;
    if (c.zoom !== undefined) zoom += (c.zoom - zoom) * p;
    if (c.centra !== undefined) centra += (c.centra - centra) * p;
    if (c.foco) foco = foco.map((v, i) => v + (c.foco![i] - v) * p) as [number, number, number];
  }
  const t = bloco === undefined ? frame : inicioBloco(bloco) + frame;
  return { rx, ry: ry + Math.sin(t / 70) * balanco, zoom, foco, centra };
};
