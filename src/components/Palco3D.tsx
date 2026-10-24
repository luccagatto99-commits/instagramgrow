import React from 'react';
import { COR, CONTORNO, ESTEIRA_Y, W } from '../theme';

/**
 * Fábrica em 3D (CSS 3D, sem WebGL): o mesmo traço chapado da marca, agora com profundidade.
 * Coordenadas do mundo: x para a direita, y para BAIXO (como no CSS), z para perto da câmera.
 * O chão é o plano y = 0, na altura da esteira (ESTEIRA_Y). Nada de degradê nem brilho:
 * as faces laterais são pretas e fazem o papel da sombra dura.
 */

const CENTRO_CENA_Y = 790; // centro da área da cena (entre o hud e a legenda)
const P3D: React.CSSProperties = { position: 'absolute', left: 0, top: 0, transformStyle: 'preserve-3d' };

/** Câmera 3D: `rx` inclina para olhar de cima, `ry` gira em volta, `zoom` aproxima (translateZ), `foco` = ponto do mundo no centro. */
/** `centra` 0 → 1 leva o foco do lugar natural dele para o centro da cena (closes). */
export type Camera3D = { rx?: number; ry?: number; zoom?: number; foco?: [number, number, number]; centra?: number };

export const Palco3D: React.FC<Camera3D & { perspectiva?: number; children: React.ReactNode }> = ({
  rx = 16, ry = 0, zoom = 0, foco = [0, 0, 0], centra = 0, perspectiva = 1700, children,
}) => (
  // o foco fica onde ele estaria sem câmera (o chão na altura da esteira); a câmera gira em volta dele
  <div style={{ position: 'absolute', inset: 0, perspective: perspectiva, perspectiveOrigin: `${W / 2}px ${ESTEIRA_Y - 260}px` }}>
    <div
      style={{
        ...P3D,
        left: W / 2 + foco[0] * (1 - centra),
        top: ESTEIRA_Y + foco[1] + (CENTRO_CENA_Y - ESTEIRA_Y - foco[1]) * centra,
        transform: `translateZ(${zoom}px) rotateX(${-rx}deg) rotateY(${ry}deg) translate3d(${-foco[0]}px, ${-foco[1]}px, ${-foco[2]}px)`,
      }}
    >
      {children}
    </div>
  </div>
);

/** Posiciona qualquer coisa no mundo 3D. Os filhos usam (0, 0) como ponto de apoio. */
export const No3D: React.FC<{ x?: number; y?: number; z?: number; ry?: number; rx?: number; rz?: number; escala?: number; opacidade?: number; children: React.ReactNode }> = ({
  x = 0, y = 0, z = 0, ry = 0, rx = 0, rz = 0, escala = 1, opacidade = 1, children,
}) => (
  <div style={{ ...P3D, opacity: opacidade, transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${ry}deg) rotateX(${rx}deg) rotateZ(${rz}deg) scale(${escala})` }}>
    {children}
  </div>
);

const face = (w: number, h: number, fundo: string, borda: number, raio: number): React.CSSProperties => ({
  position: 'absolute',
  width: w,
  height: h,
  background: fundo,
  border: borda ? `${borda}px solid ${COR.preto}` : undefined,
  borderRadius: raio,
  boxSizing: 'border-box',
});

/**
 * Bloco com volume: largura `w`, altura `h`, profundidade `d`, apoiado pelo centro da base.
 * `frente` é desenhado na face da frente (div w × h). Laterais pretas; topo na cor da frente.
 */
export const Caixa3D: React.FC<{
  w: number;
  h: number;
  d: number;
  cor?: string;
  corLado?: string;
  corTopo?: string;
  raio?: number;
  borda?: number;
  frente?: React.ReactNode;
  topo?: React.ReactNode;
}> = ({ w, h, d, cor = COR.branco, corLado = COR.preto, corTopo, raio = 0, borda = CONTORNO, frente, topo }) => (
  <div style={P3D}>
    {/* fundo, laterais e topo */}
    <div style={{ ...face(w, h, corLado, 0, raio), left: -w / 2, top: -h, transform: `translateZ(${-d / 2}px)` }} />
    {/* cada face é centrada no lugar dela e girada em torno do próprio centro */}
    <div style={{ ...face(d, h, corLado, 0, 0), left: -w / 2 - d / 2 + 0.5, top: -h, transform: 'rotateY(90deg)' }} />
    <div style={{ ...face(d, h, corLado, 0, 0), left: w / 2 - d / 2 - 0.5, top: -h, transform: 'rotateY(90deg)' }} />
    <div style={{ ...face(w, d, corTopo ?? cor, borda, 0), left: -w / 2, top: -h - d / 2 + 0.5, transform: 'rotateX(90deg)' }}>{topo}</div>
    {/* frente */}
    <div style={{ ...face(w, h, cor, borda, raio), left: -w / 2, top: -h, transform: `translateZ(${d / 2}px)`, overflow: 'hidden' }}>{frente}</div>
  </div>
);

/**
 * Chão da fábrica: plano y = 0 com linhas de traço (mesma opacidade dos cenários), de x = `de` a `ate`
 * e de z = −`longe` a z = +`perto`. É feito de ladrilhos: um plano 3D que passa por trás da câmera some
 * inteiro no Chrome, então só os ladrilhos perto de `centro` (± `alcance`) são desenhados.
 */
export const Chao3D: React.FC<{ de?: number; ate?: number; longe?: number; perto?: number; passo?: number; opacidade?: number; cor?: string; centro?: number; alcance?: number }> = ({
  de = -1800, ate = 1800, longe = 1400, perto = 300, passo = 240, opacidade = 0.16, cor = `var(--traco, ${COR.preto})`, centro = 0, alcance = 2600,
}) => {
  const LAD = passo * 3; // ladrilho = 3 × 3 casas
  const i0 = Math.floor((Math.max(de, centro - alcance)) / LAD);
  const i1 = Math.ceil((Math.min(ate, centro + alcance)) / LAD);
  const k0 = Math.floor(-longe / LAD);
  const k1 = Math.ceil(perto / LAD);
  const lad: React.ReactNode[] = [];
  for (let i = i0; i < i1; i++) {
    for (let k = k0; k < k1; k++) {
      lad.push(
        <div key={`${i}:${k}`} style={{ ...P3D, width: LAD, height: LAD, left: -LAD / 2, top: -LAD / 2, transform: `translate3d(${(i + 0.5) * LAD}px, 1px, ${(k + 0.5) * LAD}px) rotateX(90deg)` }}>
          <svg width={LAD} height={LAD} style={{ position: 'absolute', overflow: 'visible' }} stroke={cor} strokeWidth={8}>
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
  return <div style={{ ...P3D, opacity: opacidade }}>{lad}</div>;
};

/**
 * Parede do fundo (plano z = `z`) com um cenário de traço (FundoGalpao etc., desenhados em 1080 × 1920
 * com o chão em y ≈ 1046). `escala` amplia o cenário para cobrir a parede de longe.
 */
export const Parede3D: React.FC<{ z?: number; escala?: number; children: React.ReactNode }> = ({ z = -1300, escala = 1.9, children }) => (
  <div style={{ ...P3D, width: W, height: 1920, left: -W / 2, top: -(ESTEIRA_Y + 46), transformOrigin: `50% ${ESTEIRA_Y + 46}px`, transform: `translateZ(${z}px) scale(${escala})` }}>
    {children}
  </div>
);

/**
 * Esteira com volume: faixa preta de x = `de` a `ate`, com roletes amarelos no topo. `deslocamento` em px
 * move os roletes. Feita de ladrilhos só com as faces visíveis (frente e topo) e as duas pontas: faces
 * internas entre segmentos brigavam entre si e "cortavam" a esteira. Só desenha perto de `centro`.
 */
export const Esteira3D: React.FC<{ deslocamento: number; de?: number; ate?: number; largura?: number; altura?: number; z?: number; centro?: number; alcance?: number }> = ({
  deslocamento, de = -1300, ate = 1300, largura = 200, altura = 46, z = 0, centro = 0, alcance = 2600,
}) => {
  const passo = 70;
  const SEG = 280; // múltiplo de `passo`: os roletes continuam de um ladrilho para o outro
  const off = ((deslocamento % passo) + passo) % passo;
  const cor = `var(--esteira, ${COR.preto})`;
  const roletes = (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {Array.from({ length: SEG / passo + 2 }).map((_, i) => (
        <div key={i} style={{ position: 'absolute', top: 18, bottom: 18, left: i * passo - passo + off, width: 16, borderRadius: 8, background: `var(--rolete, ${COR.amarelo})` }} />
      ))}
    </div>
  );
  const i0 = Math.floor(Math.max(de, centro - alcance) / SEG);
  const i1 = Math.ceil(Math.min(ate, centro + alcance) / SEG);
  const lad: React.ReactNode[] = [];
  for (let i = i0; i < i1; i++) {
    const x0 = Math.max(de, i * SEG);
    const x1 = Math.min(ate, (i + 1) * SEG);
    if (x1 <= x0) continue;
    const w = x1 - x0 + 0.6;
    lad.push(
      <React.Fragment key={i}>
        <div style={{ position: 'absolute', width: w, height: largura, left: x0, top: -altura - largura / 2, background: cor, transform: 'rotateX(90deg)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: i * SEG - x0, width: SEG }}>{roletes}</div>
        </div>
        <div style={{ position: 'absolute', width: w, height: altura, left: x0, top: -altura, background: cor, transform: `translateZ(${largura / 2}px)` }} />
      </React.Fragment>,
    );
  }
  return (
    <div style={{ ...P3D, transform: `translateZ(${z}px)` }}>
      {lad}
      {[de, ate].map((x) => (
        <div key={x} style={{ position: 'absolute', width: largura, height: altura, left: x - largura / 2, top: -altura, background: cor, transform: 'rotateY(90deg)' }} />
      ))}
    </div>
  );
};

/** Sombra dura no chão (quadrilátero preto achatado), deslocada para a direita e para trás. */
export const Sombra3D: React.FC<{ w: number; d: number; x?: number; z?: number; dx?: number; dz?: number; y?: number }> = ({ w, d, x = 0, z = 0, dx = 20, dz = -20, y = -1 }) => (
  <div style={{ ...P3D, width: w, height: d, left: -w / 2, top: -d / 2, background: `var(--sombra, ${COR.preto})`, transform: `translate3d(${x + dx}px, ${y}px, ${z + dz}px) rotateX(90deg)` }} />
);

/** Pontos soltos no ar (o "ruído" flutuando pela fábrica): quadradinhos pretos parados no espaço 3D. */
export const PoeiraRuido: React.FC<{ n?: number; semente?: number; frame: number; opacidade?: number; raio?: number; zMax?: number }> = ({ n = 40, semente = 3, frame, opacidade = 0.35, raio = 1200, zMax = Infinity }) => {
  const h = (i: number, k: number) => {
    let v = Math.imul(i * 374761393 + k * 668265263 + semente * 2246822519, 1274126177);
    v ^= v >>> 15;
    return (v >>> 0) / 4294967295;
  };
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const x = (h(i, 1) - 0.5) * raio * 2;
        const z = (h(i, 2) - 0.5) * raio * 1.6 - 200;
        const y = -80 - h(i, 3) * 900 + Math.sin(frame / 40 + i) * 14;
        const s = 10 + h(i, 4) * 14;
        if (z > zMax) return null; // perto da câmera um quadradinho vira um borrão: some antes
        return (
          <div
            key={i}
            style={{ ...P3D, width: s, height: s, left: -s / 2, top: -s / 2, background: COR.preto, opacity: opacidade, transform: `translate3d(${x}px, ${y}px, ${z}px)` }}
          />
        );
      })}
    </>
  );
};
