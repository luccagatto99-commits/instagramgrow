import React from 'react';
import { COR } from '../theme';

/**
 * Rosto 3D de traço (genérico, ninguém real), calculado ponto a ponto e projetado em SVG.
 * Pode girar à vontade (`giro` em volta do eixo vertical, `incl` para cima/baixo) sem os cortes do CSS 3D.
 * Camadas, cada uma com sua intensidade 0 → 1:
 * - `contorno`: cabeça branca com contorno, olhos, nariz e boca (o rosto "que você vê");
 * - `pontos`: pontos azuis projetados na pele (maiores onde a pele está mais perto);
 * - `malha`: rede de linhas da superfície (o mapa 3D);
 * - `plano`: achata o rosto numa foto (sem profundidade: de lado vira uma linha);
 * - `oculos`, `barba`: acessórios; `varredura` = altura da linha de leitura (−1.3 → 1.3, fora = sem).
 * Unidade local: meia largura da cabeça = 1. `R` = meia largura em px. Posicionado pelo centro.
 */
export type FormaRosto = { rx: number; ry: number; rz: number; nariz: number; queixo: number; bochecha: number; cabelo?: boolean };
export const ROSTO_VOCE: FormaRosto = { rx: 1, ry: 1.3, rz: 1, nariz: 0.3, queixo: 0.34, bochecha: 0.05 };
export const ROSTO_ESTRANHO: FormaRosto = { rx: 1.1, ry: 1.18, rz: 0.95, nariz: 0.2, queixo: 0.12, bochecha: 0.09, cabelo: true };

const RAD = Math.PI / 180;
const G = (d: number, s: number) => Math.exp(-(d * d) / (2 * s * s));
const hash = (i: number, k = 0) => {
  let h = Math.imul(i ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(k + 0x27d4eb2f, 0xc2b2ae35);
  h ^= h >>> 16;
  h = Math.imul(h, 0x7feb352d);
  h ^= h >>> 15;
  h = Math.imul(h, 0x846ca68b);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};

type V3 = [number, number, number];

/** Ponto da superfície em (th, ph) graus: th = em volta (0 = frente), ph = altura (+ = para cima). */
const superficie = (th: number, ph: number, f: FormaRosto): V3 => {
  const c = Math.cos(ph * RAD);
  let x = Math.sin(th * RAD) * c * f.rx;
  const y = -Math.sin(ph * RAD) * f.ry;
  let z = Math.cos(th * RAD) * c * f.rz;
  if (ph < 0) {
    // maxilar afina para baixo
    const k = 1 - f.queixo * Math.pow(Math.sin(-ph * RAD), 1.6);
    x *= k;
    z *= 0.75 + 0.25 * k;
  }
  if (Math.abs(th) < 95) {
    const relevo =
      f.nariz * G(th, 8) * G(ph + 6, 13) -
      0.09 * (G(th - 25, 10) + G(th + 25, 10)) * G(ph - 10, 7) +
      0.04 * (G(th - 25, 15) + G(th + 25, 15)) * G(ph - 19, 5) +
      f.bochecha * (G(th - 38, 14) + G(th + 38, 14)) * G(ph + 14, 12) +
      0.06 * G(th, 15) * G(ph + 30, 6) +
      0.06 * G(th, 13) * G(ph + 50, 10);
    z += relevo * Math.max(0, Math.cos(th * RAD));
  }
  return [x, y, z];
};

/** Normal aproximada (a do elipsoide de base), para saber se o ponto está virado para a câmera. */
const normal = (th: number, ph: number, f: FormaRosto): V3 => {
  const c = Math.cos(ph * RAD);
  const n: V3 = [(Math.sin(th * RAD) * c) / f.rx, -Math.sin(ph * RAD) / f.ry, (Math.cos(th * RAD) * c) / f.rz];
  const m = Math.hypot(...n);
  return [n[0] / m, n[1] / m, n[2] / m];
};

/** Pontos dos "30 mil" (amostra): espalhados ao acaso pela cabeça (como o padrão do projetor), sem o topo e o pescoço. */
const PONTOS: [number, number][] = (() => {
  const out: [number, number][] = [];
  for (let i = 0; out.length < 1100 && i < 5000; i++) {
    const uy = 2 * hash(i, 11) - 1;
    const th = (hash(i, 12) - 0.5) * 360;
    const ph = Math.asin(uy) / RAD;
    if (ph < -78 || ph > 74) continue;
    out.push([th, ph]);
  }
  return out;
})();

/** Fios da barba: pontos no maxilar (sem a boca). */
const BARBA: [number, number][] = (() => {
  const out: [number, number][] = [];
  for (let i = 0; out.length < 170 && i < 2000; i++) {
    const th = (hash(i, 1) - 0.5) * 170;
    const ph = -16 - hash(i, 2) * 50;
    if (Math.abs(th) < 22 && ph > -38 && ph < -22) continue; // boca
    if (ph > -26 && Math.abs(th) < 40) continue; // bochecha alta fica limpa
    out.push([th, ph]);
  }
  return out;
})();

/** Fios de cabelo do rosto estranho: topo e nuca. */
const CABELO: [number, number][] = (() => {
  const out: [number, number][] = [];
  for (let i = 0; out.length < 260 && i < 4000; i++) {
    const th = (hash(i, 5) - 0.5) * 360;
    const ph = 30 + hash(i, 6) * 52;
    if (Math.abs(th) < 70 && ph < 44) continue; // testa livre
    out.push([th, ph]);
  }
  return out;
})();

/** Monotone chain: casco convexo dos pontos projetados (silhueta da cabeça, com o nariz de perfil). */
const casco = (pts: [number, number][]) => {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cruz = (o: number[], a: number[], b: number[]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: [number, number][] = [];
  for (const q of p) {
    while (lo.length >= 2 && cruz(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop();
    lo.push(q);
  }
  const hi: [number, number][] = [];
  for (let i = p.length - 1; i >= 0; i--) {
    const q = p[i];
    while (hi.length >= 2 && cruz(hi[hi.length - 2], hi[hi.length - 1], q) <= 0) hi.pop();
    hi.push(q);
  }
  return [...lo.slice(0, -1), ...hi.slice(0, -1)];
};

export const Rosto3D: React.FC<{
  x: number;
  y: number;
  R?: number;
  giro?: number;
  incl?: number;
  contorno?: number;
  pontos?: number;
  malha?: number;
  plano?: number;
  oculos?: number;
  barba?: number;
  pele?: number;
  realce?: number; // 0 → 1: exagera a diferença de tamanho dos pontos (perto = grande, longe = pequeno) // cabeça branca sem olhos/boca (fundo da malha e dos pontos)
  varredura?: number;
  forma?: FormaRosto;
  sombra?: boolean;
  corPonto?: string;
  id?: string;
}> = ({
  x, y, R = 140, giro = 0, incl = 0, contorno = 1, pontos = 0, malha = 0, plano = 0, oculos = 0, barba = 0, pele = 0, realce = 0, varredura = 9,
  forma = ROSTO_VOCE, sombra = true, corPonto = COR.azul, id = 'rosto',
}) => {
  const ca = Math.cos(giro * RAD);
  const sa = Math.sin(giro * RAD);
  const cb = Math.cos(incl * RAD);
  const sb = Math.sin(incl * RAD);
  const D = 5; // distância da câmera (em meias larguras): perspectiva leve
  const foto = plano > 0.5;

  const gira = (v: V3): V3 => {
    const x1 = v[0] * ca + v[2] * sa;
    const z1 = -v[0] * sa + v[2] * ca;
    const y2 = v[1] * cb - z1 * sb;
    const z2 = v[1] * sb + z1 * cb;
    return [x1, y2, z2];
  };
  /** Projeta um ponto da superfície; devolve [X, Y, profundidade, visível]. */
  const proj = (th: number, ph: number, sobe = 0): [number, number, number, boolean] => {
    const s = superficie(th, ph, forma);
    const n = normal(th, ph, forma);
    const p: V3 = [s[0] + n[0] * sobe, s[1] + n[1] * sobe, (s[2] + n[2] * sobe) * (1 - plano)];
    const r = gira(p);
    const k = D / (D - r[2]);
    const vis = foto ? Math.abs(th) < 90 : gira(plano > 0 ? [n[0] * (1 - plano), n[1] * (1 - plano), n[2] * (1 - plano) + plano] : n)[2] > -0.02;
    return [r[0] * R * k, r[1] * R * k, r[2], vis];
  };

  // silhueta: casco convexo de uma grade da cabeça (só a metade da frente quando é foto)
  const grade: [number, number][] = [];
  for (let ph = -84; ph <= 84; ph += 7) {
    for (let th = -180; th < 180; th += 9) {
      if (foto && Math.abs(th) > 90) continue;
      const [X, Y] = proj(th, ph);
      grade.push([X, Y]);
    }
  }
  const sil = casco(grade);
  const silD = sil.length ? `M${sil.map(([a, b]) => `${a.toFixed(1)} ${b.toFixed(1)}`).join(' L')} Z` : '';

  /** Polilinha de pontos da superfície, quebrada onde fica de costas. */
  const linha = (pts: [number, number][], sobe = 0.01) => {
    const segs: string[] = [];
    let atual: string[] = [];
    for (const [th, ph] of pts) {
      const [X, Y, , vis] = proj(th, ph, sobe);
      if (vis) atual.push(`${X.toFixed(1)} ${Y.toFixed(1)}`);
      else if (atual.length) {
        if (atual.length > 1) segs.push(`M${atual.join(' L')}`);
        atual = [];
      }
    }
    if (atual.length > 1) segs.push(`M${atual.join(' L')}`);
    return segs.join(' ');
  };
  const faixa = (de: number, ate: number, passo: number, f: (v: number) => [number, number]) => {
    const out: [number, number][] = [];
    for (let v = de; v <= ate + 1e-6; v += passo) out.push(f(v));
    return out;
  };

  const S = R * 2.2;
  const esc = R / 140; // espessuras pensadas para R = 140
  const clipId = `${id}-sil`;

  // olhos, nariz, boca e sobrancelhas
  const olho = (lado: number) => {
    const [X, Y, , vis] = proj(lado * 25, 10, 0.01);
    if (!vis) return null;
    const [X2] = proj(lado * 25 + 6, 10, 0.01);
    const rx = Math.max(2, Math.abs(X2 - X) * 1.6);
    return <ellipse key={`o${lado}`} cx={X} cy={Y} rx={rx} ry={11 * esc} fill={COR.preto} />;
  };
  const nariz = linha([[2, 14], [3, 2], [5, -8], [6, -12], [0, -14], [-6, -12]]);
  const boca = linha(faixa(-20, 20, 4, (t) => [t, -29 - 5 * Math.cos((t / 20) * (Math.PI / 2))]));
  const sobrancelhas = [-1, 1].map((l) => linha(faixa(15, 35, 5, (t) => [l * t, 21 + (l * t > 0 ? -1 : 1) * 0])));

  // malha: paralelos e meridianos
  const malhaD =
    malha > 0
      ? [
          ...faixa(-70, 70, 14, (ph) => [0, ph]).map(([, ph]) => linha(faixa(-180, 180, 6, (th) => [th, ph]), 0)),
          ...faixa(-180, 160, 20, (th) => [th, 0]).map(([th]) => linha(faixa(-80, 80, 6, (ph) => [th, ph]), 0)),
        ].join(' ')
      : '';

  // óculos: dois aros na frente dos olhos, ponte e hastes
  const aro = (lado: number) => linha(faixa(0, 360, 20, (a) => {
    const th = lado * 25 + Math.cos(a * RAD) * 13;
    const ph = 9 + Math.sin(a * RAD) * 10;
    return [th, ph];
  }), 0.1);
  const oculosD = oculos > 0 ? [aro(-1), aro(1), linha([[-12, 10], [-6, 12], [0, 12.5], [6, 12], [12, 10]], 0.12), linha([[38, 10], [60, 10], [85, 9]], 0.06), linha([[-38, 10], [-60, 10], [-85, 9]], 0.06)].join(' ') : '';

  // orelhas: frente = desenhada por cima da cabeça (vista de lado), atrás = por baixo
  const orelha = (lado: number) => {
    const pts: string[] = [];
    let vis = false;
    for (let a = 0; a < 360; a += 30) {
      const [X, Y, , v] = proj(lado * (90 + Math.cos(a * RAD) * 7), 2 + Math.sin(a * RAD) * 11, 0.05 + 0.05 * Math.cos(a * RAD));
      vis = vis || v;
      pts.push(`${X.toFixed(1)} ${Y.toFixed(1)}`);
    }
    const n = gira(normal(lado * 90, 0, forma));
    return { d: `M${pts.join(' L')} Z`, frente: n[2] > 0.2, vis };
  };
  const orelhas = foto ? [] : [orelha(-1), orelha(1)];
  const desenhaOrelha = (o: { d: string }, k: number) => (
    <path key={k} d={o.d} fill={COR.branco} stroke={COR.preto} strokeWidth={7 * esc} strokeLinejoin="round" opacity={contorno} />
  );

  return (
    <svg width={S * 2} height={S * 2} viewBox={`${-S} ${-S} ${S * 2} ${S * 2}`} style={{ position: 'absolute', left: x - S, top: y - S, overflow: 'visible' }}>
      <defs>
        <clipPath id={clipId}>
          <path d={silD} />
        </clipPath>
      </defs>
      {sombra && Math.max(contorno, pele) > 0 ? <path d={silD} transform={`translate(${16 * esc} ${16 * esc})`} fill={`var(--sombra, ${COR.preto})`} opacity={Math.max(contorno, pele)} /> : null}
      {contorno > 0 ? orelhas.map((o, k) => (!o.frente ? desenhaOrelha(o, k) : null)) : null}
      {Math.max(contorno, pele) > 0 ? <path d={silD} fill={COR.branco} stroke={COR.preto} strokeWidth={8 * esc} strokeLinejoin="round" opacity={Math.max(contorno, pele)} /> : null}
      {contorno > 0 ? orelhas.map((o, k) => (o.frente ? desenhaOrelha(o, k) : null)) : null}
      {forma.cabelo && contorno > 0
        ? CABELO.map(([th, ph], i) => {
            const [X, Y, , vis] = proj(th, ph, 0.03);
            if (!vis) return null;
            const [X2, Y2] = proj(th + (hash(i, 8) - 0.5) * 10, ph - 7, 0.03);
            return <line key={`c${i}`} x1={X} y1={Y} x2={X2} y2={Y2} stroke={COR.preto} strokeWidth={6 * esc} strokeLinecap="round" opacity={contorno} />;
          })
        : null}

      {malha > 0 ? <path d={malhaD} fill="none" stroke={COR.preto} strokeWidth={3 * esc} strokeLinecap="round" opacity={malha} /> : null}

      {pontos > 0
        ? PONTOS.map(([th, ph], i) => {
            const h = hash(i, 7);
            if (h > pontos * 1.02) return null;
            const [X, Y, z, vis] = proj(th, ph, 0.015);
            if (!vis) return null;
            const perto = Math.min(1, Math.max(0, (z + 0.3) / 1.4));
            const surge = Math.min(1, (pontos * 1.02 - h) * 12);
            const r = (2.2 + 3.4 * perto) * (1 - realce) + (1.2 + 9 * Math.pow(perto, 3)) * realce;
            return <circle key={i} cx={X} cy={Y} r={r * esc * surge} fill={corPonto} />;
          })
        : null}

      {contorno > 0 ? (
        <g opacity={contorno} fill="none" stroke={COR.preto} strokeLinecap="round" strokeLinejoin="round">
          {olho(-1)}
          {olho(1)}
          <path d={sobrancelhas.join(' ')} strokeWidth={6 * esc} />
          <path d={nariz} strokeWidth={6 * esc} />
          <path d={boca} strokeWidth={7 * esc} />
        </g>
      ) : null}

      {barba > 0
        ? BARBA.map(([th, ph], i) => {
            if (hash(i, 3) > barba) return null;
            const [X, Y, , vis] = proj(th, ph, 0.02);
            const [X2, Y2] = proj(th + (hash(i, 4) - 0.5) * 4, ph - 4, 0.02);
            if (!vis) return null;
            return <line key={i} x1={X} y1={Y} x2={X2} y2={Y2} stroke={COR.preto} strokeWidth={4.5 * esc} strokeLinecap="round" />;
          })
        : null}

      {oculos > 0 ? <path d={oculosD} fill="none" stroke={COR.preto} strokeWidth={7 * esc} strokeLinejoin="round" strokeLinecap="round" opacity={Math.min(1, oculos * 2)} transform={`translate(0 ${(1 - Math.min(1, oculos)) * -60 * esc})`} /> : null}

      {Math.abs(varredura) < 1.4 ? (
        <g clipPath={`url(#${clipId})`}>
          <line x1={-S} x2={S} y1={varredura * R} y2={varredura * R} stroke={COR.vermelho} strokeWidth={7 * esc} />
        </g>
      ) : null}
    </svg>
  );
};
