// Máquina de lavar brasileira (abertura superior): gabinete em raio-x com o tampo e a tampa de vidro fumê,
// tanque, cesto com furos e anel de balanceamento (água salgada), batedor no meio, roupas, água (laranja),
// varetas com molas, motor + correia, bomba, válvula + dispenser de sabão e o tubinho de ar.
import { useMemo } from 'react';
import * as THREE from 'three';
import {
  ANEL, BATEDOR, BOMBA, CESTO, COR, Estado, GAB, MOTOR, PAINEL, PRESSO, ROUPAS, SABAO, TANQUE, V3, VALVULA,
} from '../estado';
import { Contorno, Peca, brilho, extrudar, toon } from './base';
import { Fluxo, Haste } from './pecas';
import { aleatorio, clamp } from '../tempo';

const v3 = (p: V3) => new THREE.Vector3(...p);
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

/** mola: hélice entre dois pontos */
const Mola: React.FC<{ a: V3; b: V3; mat: THREE.Material; r?: number }> = ({ a, b, mat, r = 0.06 }) => {
  const A = v3(a), Bv = v3(b);
  const d = Bv.clone().sub(A);
  const l = d.length();
  const u = d.clone().normalize();
  const p1 = new THREE.Vector3(1, 0, 0).cross(u).normalize();
  if (p1.lengthSq() < 1e-6) p1.set(0, 0, 1);
  const p2 = u.clone().cross(p1).normalize();
  const pts: THREE.Vector3[] = [];
  const voltas = 7, n = 100;
  for (let i = 0; i <= n; i++) {
    const s = i / n, ang = s * voltas * Math.PI * 2;
    pts.push(A.clone().add(u.clone().multiplyScalar(s * l)).add(p1.clone().multiplyScalar(Math.cos(ang) * r)).add(p2.clone().multiplyScalar(Math.sin(ang) * r)));
  }
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const tubo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 200, 0.013, 6);
  geo.copy(tubo);
  tubo.dispose();
  return <mesh geometry={geo} material={mat} />;
};

// canos (referencial do gabinete)
const ENTRADA = new THREE.CatmullRomCurve3([
  [VALVULA[0], VALVULA[1], VALVULA[2] + 0.1], [0.2, 2.9, -0.75], [SABAO[0] + 0.1, SABAO[1] + 0.15, SABAO[2] - 0.1],
  [SABAO[0], SABAO[1], SABAO[2] + 0.05], [-0.32, 2.3, -0.3], [-0.2, 1.7, -0.15],
].map((p) => v3(p as V3)));
const SAIDA = new THREE.CatmullRomCurve3([
  [0, 0.5, 0.2], [-0.25, 0.25, 0.45], [BOMBA[0], BOMBA[1], BOMBA[2]], [-0.85, 0.3, 0.1], [-0.88, 0.7, -0.9], [-0.9, 1.0, -1.5],
].map((p) => v3(p as V3)));
const AR = new THREE.CatmullRomCurve3([[-0.6, 0.62, -0.62], [-0.82, 0.9, -0.7], [-0.86, 2.2, -0.8], [PRESSO[0], PRESSO[1] - 0.08, PRESSO[2]]].map((p) => v3(p as V3)));

const N_ROUPA = 9;

export const Lavadora: React.FC<{ e: Estado }> = ({ e }) => {
  const g = useMemo(() => {
    // tampo com o buraco da boca
    const s = new THREE.Shape();
    s.moveTo(-1, -1); s.lineTo(1, -1); s.lineTo(1, 1); s.lineTo(-1, 1); s.closePath();
    const furo = new THREE.Path(); furo.absarc(0, 0.08, 0.8, 0, Math.PI * 2, true); s.holes.push(furo);
    const tampo = extrudar(s, 0.1, 0.01).rotateX(-Math.PI / 2).translate(0, GAB.h, 0);
    const tampa = new THREE.CylinderGeometry(0.86, 0.86, 0.05, 48).translate(0, 0, 0.86); // gira pela dobradiça de trás
    return {
      lado: new THREE.BoxGeometry(GAB.w, GAB.h - 0.1, GAB.d),
      tampo, tampa,
      painel: new THREE.BoxGeometry(1.9, 0.36, 0.3),
      botao: new THREE.CylinderGeometry(0.1, 0.1, 0.06, 24).rotateX(Math.PI / 2),
      visor: new THREE.BoxGeometry(0.5, 0.14, 0.02),
      tanque: new THREE.CylinderGeometry(TANQUE.r, TANQUE.r, TANQUE.y1 - TANQUE.y0, 56, 1, true),
      fundoTanque: new THREE.CircleGeometry(TANQUE.r, 48).rotateX(-Math.PI / 2),
      cesto: new THREE.CylinderGeometry(CESTO.r, CESTO.r, CESTO.y1 - CESTO.y0, 56, 1, true),
      fundoCesto: new THREE.CircleGeometry(CESTO.r, 48).rotateX(-Math.PI / 2),
      furo: new THREE.CircleGeometry(0.028, 10),
      anel: new THREE.TorusGeometry(ANEL.r, ANEL.tubo, 14, 64).rotateX(Math.PI / 2),
      batedor: new THREE.CylinderGeometry(BATEDOR.r * 0.8, BATEDOR.r, BATEDOR.y1 - BATEDOR.y0, 24),
      aleta: new THREE.BoxGeometry(0.42, 0.34, 0.05),
      saia: new THREE.CylinderGeometry(0.42, 0.5, 0.1, 32),
      roupa: new THREE.SphereGeometry(1, 16, 12),
      motor: new THREE.CylinderGeometry(0.2, 0.2, 0.38, 24),
      polia: new THREE.CylinderGeometry(0.34, 0.34, 0.05, 32),
      poliaM: new THREE.CylinderGeometry(0.07, 0.07, 0.07, 16),
      bomba: new THREE.CylinderGeometry(0.14, 0.14, 0.24, 20).rotateX(Math.PI / 2),
      valvula: new THREE.BoxGeometry(0.2, 0.16, 0.2),
      sabao: new THREE.BoxGeometry(0.34, 0.12, 0.26),
      presso: new THREE.CylinderGeometry(0.12, 0.12, 0.07, 20).rotateX(Math.PI / 2),
      cano: new THREE.TubeGeometry(ENTRADA, 80, 0.032, 8),
      canoSaida: new THREE.TubeGeometry(SAIDA, 80, 0.045, 8),
      canoAr: new THREE.TubeGeometry(AR, 60, 0.02, 8),
      pe: new THREE.BoxGeometry(0.2, 0.08, 0.2),
    };
  }, []);
  const m = useMemo(() => ({
    lado: toon(COR.objeto, { transparent: true, opacity: 0.14, depthWrite: false }),
    objeto: toon(COR.objeto),
    tampo: toon(COR.objeto),
    vidro: new THREE.MeshBasicMaterial({ color: COR.rotulo, transparent: true, opacity: 0.28, depthWrite: false }),
    metal: toon('#D6D9DE', { side: THREE.DoubleSide, transparent: true, opacity: 0.22, depthWrite: false }),
    tanque: toon(COR.sombra, { transparent: true, opacity: 0.32, side: THREE.DoubleSide, depthWrite: false }),
    escuro: toon(COR.escuro),
    batedor: toon(COR.batedor),
    agua: (() => { const a = brilho(COR.move, 1.15); a.opacity = 0.5; a.depthWrite = false; return a; })(),
    anel: toon(COR.objeto, { transparent: true, opacity: 0.45, depthWrite: false }),
    aguaAnel: brilho(COR.move, 2.2),
    furo: new THREE.MeshBasicMaterial({ color: COR.escuro, side: THREE.DoubleSide }),
    quente: brilho(COR.move, 2.4),
    luz: brilho(COR.rotulo, 1.6),
    roupas: ROUPAS.map((c) => toon(c)),
  }), []);

  const furos = useMemo(() => {
    const out: { p: V3; r: V3 }[] = [];
    const nA = 30, nY = 7;
    for (let i = 0; i < nA; i++) for (let k = 0; k < nY; k++) {
      const a = ((i + (k % 2) * 0.5) / nA) * Math.PI * 2;
      const y = CESTO.y0 + 0.15 + (k / (nY - 1)) * (CESTO.y1 - CESTO.y0 - 0.35);
      out.push({ p: [Math.sin(a) * (CESTO.r + 0.004), y, Math.cos(a) * (CESTO.r + 0.004)], r: [0, a, 0] });
    }
    return out;
  }, []);
  const roupas = useMemo(() => {
    const r = aleatorio(9);
    return Array.from({ length: N_ROUPA }, (_, i) => ({ off: i / N_ROUPA, f: r(), s: [0.28 + r() * 0.1, 0.16 + r() * 0.06, 0.25 + r() * 0.1] as V3, rot: r() * 6 }));
  }, []);

  const t = e.t;
  const tq = e.tanqueOff;
  // anel: a água fica numa metade; quando o anel "corre", vai para o lado oposto ao da roupa embolada
  const ladoRoupa = e.phi;
  const ladoAgua = (1 - e.anelCorre) * (ladoRoupa + 0.4) + e.anelCorre * (ladoRoupa + Math.PI);
  const nivelY = CESTO.y0 + 0.02 + e.nivel * 0.95;
  const pres = Math.max(e.centrifuga, e.vel > 10 ? 1 : 0);

  // roupa: posição de cada peça (referencial do tanque)
  const posRoupa = (i: number): { p: V3; v: number; rot: number } => {
    const d = roupas[i];
    const k = i / N_ROUPA;
    // caindo pela boca (bloco 1) ou subindo na rebobinada do gancho
    let v = clamp((e.roupasDentro - k) * N_ROUPA);
    const th0 = d.off * Math.PI * 2 + d.f;
    let p: V3;
    if (e.lavando > 0.1) {
      // rolagem: desce pelo meio, sobe pelas bordas, e gira um pouco com o batedor
      const u = ((t * 0.32 + d.off) % 1 + 1) % 1;
      const rr = 0.42 + 0.22 * Math.cos(u * Math.PI * 2);
      const hh = 1.25 + 0.35 * Math.sin(u * Math.PI * 2) * Math.cos(u * Math.PI * 2 < Math.PI ? 0 : 0);
      const th = th0 + t * 0.4 + e.batedorAng * 0.35;
      p = [Math.sin(th) * rr, hh, Math.cos(th) * rr];
    } else if (e.embolada > 0.5) {
      const th = e.phi + d.f * 0.7;
      p = [Math.sin(th) * (CESTO.r - 0.16), 0.95 + d.f * 0.5, Math.cos(th) * (CESTO.r - 0.16)];
    } else if (pres > 0.5) {
      const th = e.phi + th0;
      p = [Math.sin(th) * (CESTO.r - 0.13), 0.9 + d.f * 1.1, Math.cos(th) * (CESTO.r - 0.13)];
    } else {
      // parada no fundo
      const rr = 0.25 + 0.35 * d.f;
      p = [Math.sin(th0) * rr, CESTO.y0 + 0.16 + (i % 3) * 0.1, Math.cos(th0) * rr];
    }
    // caindo: vem de cima da boca
    if (v < 1 && e.caindo > 0.01) {
      const q = v;
      p = [p[0] * q, p[1] + (1 - q) * (1 - q) * 2.4, p[2] * q];
      v = q > 0.001 ? 1 : 0;
    }
    if (e.sobeGancho > 0) { p = [p[0] * (1 - e.sobeGancho), p[1] + e.sobeGancho * 2.4, p[2] * (1 - e.sobeGancho)]; v = e.sobeGancho < 0.98 ? 1 : 0; }
    return { p, v, rot: d.rot + t * (e.lavando > 0.1 ? 1.5 : 0) };
  };

  const gotas = useMemo(() => {
    const r = aleatorio(17);
    return Array.from({ length: 60 }, () => ({ a: r() * Math.PI * 2, y: CESTO.y0 + 0.2 + r() * 1.4, f: r(), v: 0.8 + r() * 0.8 }));
  }, []);
  const ondas = useMemo(() => Array.from({ length: 22 }, (_, i) => ({ a: (i / 22) * Math.PI * 2, r: 0.3 + (i % 3) * 0.15 })), []);

  return (
    <group position={e.maqOff}>
      {/* gabinete em raio-x (laterais) e tampo de verdade */}
      <group position={[0, (GAB.h - 0.1) / 2, 0]}>
        <mesh geometry={g.lado} material={m.lado} />
        <Contorno geo={g.lado} largura={2.2} />
      </group>
      <Peca geo={g.tampo} mat={m.tampo} />
      {[-0.8, 0.8].flatMap((x) => [-0.8, 0.8].map((z) => <Peca key={`${x}${z}`} geo={g.pe} mat={m.escuro} position={[x, 0.0, z]} />))}
      {/* painel de trás com botão e visor */}
      <Peca geo={g.painel} mat={m.objeto} position={PAINEL} />
      <Peca geo={g.botao} mat={e.ligada > 0.5 ? m.luz : m.objeto} position={[0.6, PAINEL[1], PAINEL[2] + 0.16]} />
      <mesh geometry={g.visor} material={m.escuro} position={[0, PAINEL[1], PAINEL[2] + 0.16]} />
      {/* tampa de vidro fumê, presa atrás */}
      <group position={[0, GAB.h + 0.13, -0.78]} rotation={[-0.95 * e.tampa, 0, 0]}>
        <mesh geometry={g.tampa} material={m.vidro} />
        <Contorno geo={g.tampa} largura={2} angulo={50} />
      </group>

      {/* válvula, cano, dispenser de sabão */}
      <Peca geo={g.valvula} mat={m.escuro} position={VALVULA} quente={e.destValvula} />
      <mesh geometry={g.cano} material={m.escuro} />
      <Peca geo={g.sabao} mat={m.objeto} position={SABAO} quente={e.destSabao} />
      <Fluxo curva={ENTRADA} n={26} t={t} vel={0.7} v={e.fluxoEntrada} r={0.045} />
      {/* tubinho de ar até o sensor no painel */}
      <Peca geo={g.presso} mat={e.avisa > 0.5 ? m.quente : m.objeto} position={[PRESSO[0], PRESSO[1], PRESSO[2] + 0.16]} quente={e.destTubo} />
      <mesh geometry={g.canoAr} material={e.destTubo > 0.5 ? m.quente : m.escuro} />
      {/* bomba e mangueira de saída */}
      <Peca geo={g.bomba} mat={m.escuro} position={BOMBA} quente={e.destBomba} />
      <mesh geometry={g.canoSaida} material={m.escuro} />
      <Fluxo curva={SAIDA} n={30} t={t} vel={0.8} v={e.fluxoBomba} r={0.05} />

      {/* varetas com molas: o tanque fica pendurado nos quatro cantos */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => {
        const topo: V3 = [sx * 0.86, GAB.h - 0.12, sz * 0.86];
        const base: V3 = add([sx * 0.62, TANQUE.y0 + 0.02, sz * 0.62], tq);
        const molaA: V3 = [base[0], base[1] - 0.05, base[2]];
        const molaB: V3 = [base[0], base[1] - 0.32, base[2]];
        return (
          <group key={i}>
            <Haste a={topo} b={molaB} r={0.018} mat={e.destVaretas > 0.5 ? m.quente : m.escuro} />
            <Mola a={molaB} b={molaA} mat={e.destVaretas > 0.5 ? m.quente : m.escuro} />
          </group>
        );
      })}

      {/* tanque, cesto, batedor, água e roupa (treme junto) */}
      <group position={tq}>
        <group position={[0, (TANQUE.y0 + TANQUE.y1) / 2, 0]}>
          <mesh geometry={g.tanque} material={m.tanque} />
          <Contorno geo={g.tanque} quente={e.destTanque} largura={2} angulo={50} />
        </group>
        <mesh geometry={g.fundoTanque} material={m.escuro} position={[0, TANQUE.y0, 0]} />
        {/* motor embaixo, correia até a polia do eixo */}
        <Peca geo={g.motor} mat={m.objeto} position={MOTOR} quente={e.destMotor} />
        <group position={[0, 0.2, 0]} rotation={[0, e.phi + e.batedorAng, 0]}>
          <Peca geo={g.polia} mat={m.objeto} quente={e.destMotor} />
          <Haste a={[0, 0.03, 0]} b={[0.3, 0.03, 0]} r={0.03} mat={m.escuro} />
        </group>
        <group position={[MOTOR[0], 0.2, MOTOR[2]]}>
          <Peca geo={g.poliaM} mat={m.escuro} />
        </group>
        <CorreiaXZ a={[0, 0]} r1={0.34} b={[MOTOR[0], MOTOR[2]]} r2={0.07} y={0.2} quente={e.destMotor} />
        <Haste a={[0, 0.2, 0]} b={[0, TANQUE.y0, 0]} r={0.05} mat={m.escuro} />

        {/* água no cesto */}
        {e.nivel > 0.01 ? (
          <group>
            <mesh material={m.agua} position={[0, (CESTO.y0 + nivelY) / 2, 0]}>
              <cylinderGeometry args={[CESTO.r - 0.03, CESTO.r - 0.03, Math.max(0.01, nivelY - CESTO.y0), 48]} />
            </mesh>
            {/* redemoinho na superfície */}
            {e.lavando > 0.1
              ? ondas.map((o, i) => {
                  const a = o.a + t * 1.6 + e.batedorAng;
                  return <mesh key={i} position={[Math.sin(a) * o.r, nivelY + 0.01, Math.cos(a) * o.r]} scale={[0.05, 0.012, 0.05]} geometry={g.roupa} material={m.quente} />;
                })
              : null}
          </group>
        ) : null}

        {/* cesto: gira na centrifugação */}
        <group rotation={[0, e.phi, 0]}>
          <group position={[0, (CESTO.y0 + CESTO.y1) / 2, 0]}>
            <mesh geometry={g.cesto} material={m.metal} />
            <Contorno geo={g.cesto} quente={e.destCesto} largura={2} angulo={50} />
          </group>
          <mesh geometry={g.fundoCesto} material={m.metal} position={[0, CESTO.y0, 0]} />
          {furos.map((f, i) => (
            <mesh key={i} geometry={g.furo} material={m.furo} position={f.p} rotation={f.r} />
          ))}
        </group>
        {/* anel de balanceamento na borda, com a água salgada dentro */}
        <group position={[0, ANEL.y, 0]} rotation={[0, e.phi, 0]}>
          <mesh geometry={g.anel} material={m.anel} />
          <Contorno geo={g.anel} quente={e.destAnel} largura={2} angulo={60} />
        </group>
        <group position={[0, ANEL.y, 0]} rotation={[0, ladoAgua - Math.PI / 2, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={m.aguaAnel}>
            <torusGeometry args={[ANEL.r, ANEL.tubo * 0.62, 10, 40, Math.PI]} />
          </mesh>
        </group>

        {/* batedor no meio: vai e vem */}
        <group rotation={[0, e.batedorAng + e.phi, 0]}>
          <group position={[0, (BATEDOR.y0 + BATEDOR.y1) / 2, 0]}>
            <Peca geo={g.batedor} mat={m.batedor} quente={e.destBatedor} />
          </group>
          <Peca geo={g.saia} mat={m.batedor} position={[0, BATEDOR.y0 + 0.05, 0]} quente={e.destBatedor} />
          {[0, 1, 2, 3].map((k) => (
            <group key={k} rotation={[0, (k * Math.PI) / 2, 0]}>
              <Peca geo={g.aleta} mat={m.batedor} position={[0.3, BATEDOR.y0 + 0.28, 0]} quente={e.destBatedor} />
            </group>
          ))}
        </group>

        {/* roupas */}
        {roupas.map((d, i) => {
          const r = posRoupa(i);
          if (r.v < 0.01) return null;
          return (
            <group key={i} position={r.p} rotation={[r.rot, r.rot * 0.6, 0]} scale={d.s}>
              <mesh geometry={g.roupa} material={m.roupas[i % m.roupas.length]} />
            </group>
          );
        })}

        {/* gotas saindo pelos furos na centrifugação */}
        {e.gotas > 0.01
          ? gotas.map((d, i) => {
              const u = (d.f + t * d.v * 1.3) % 1;
              const a = d.a + e.phi * 0.15;
              const rr = CESTO.r + u * (TANQUE.r - CESTO.r + 0.02);
              return <mesh key={i} position={[Math.sin(a) * rr, d.y - u * u * 0.15, Math.cos(a) * rr]} scale={0.022 * (1 - u * 0.4)} geometry={g.roupa} material={m.quente} />;
            })
          : null}
      </group>
    </group>
  );
};

/** correia: laço em volta das duas polias, no plano y (horizontal) */
const CorreiaXZ: React.FC<{ a: [number, number]; r1: number; b: [number, number]; r2: number; y: number; quente: number }> = ({ a, r1, b, r2, y, quente }) => {
  const geo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const beta = Math.acos((r1 - r2) / d);
    for (let i = 0; i <= 40; i++) {
      const t = ang + beta + (i / 40) * (2 * Math.PI - 2 * beta);
      pts.push(new THREE.Vector3(a[0] + Math.cos(t) * (r1 + 0.02), y, a[1] + Math.sin(t) * (r1 + 0.02)));
    }
    for (let i = 0; i <= 16; i++) {
      const t = ang - beta + (i / 16) * 2 * beta;
      pts.push(new THREE.Vector3(b[0] + Math.cos(t) * (r2 + 0.02), y, b[1] + Math.sin(t) * (r2 + 0.02)));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 140, 0.018, 6, true);
  }, [a[0], a[1], r1, b[0], b[1], r2, y]);
  const m = useMemo(() => ({ n: toon(COR.escuro), q: brilho(COR.move, 2.2) }), []);
  return <mesh geometry={geo} material={quente > 0.5 ? m.q : m.n} />;
};
