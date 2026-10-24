// Elevador de hoje em corte: poço de contorno, trilhos, cabine, contrapeso, casa de máquinas com motor e polia, seis cabos
// de aço, o limitador de velocidade (rodinha com dois pesinhos e o cabo dele) e as garras que apertam os trilhos.
// E a plataforma do Otis (1854): postes de madeira com dentes, mola em cima da plataforma e duas travas.
import { useMemo } from 'react';
import * as THREE from 'three';
import { CABINE, COR, CONTRA, Estado, LIMIT, N_CABOS, OTIS, PE_LIMIT, POCO, POLIA, TRILHO_X, V3 } from '../estado';
import { Contorno, Peca, brilho, toon } from './base';
import { Haste } from './pecas';
import { aleatorio } from '../tempo';

const CUBO = new THREE.BoxGeometry(1, 1, 1);
const dxCabo = (i: number) => (i - (N_CABOS - 1) / 2) * 0.075; // os seis cabos lado a lado

/** cabo de aço reto entre dois pontos; `laranja` acende (trabalhando); `opac` apaga */
const Cabo: React.FC<{ a: V3; b: V3; m: { aco: THREE.Material; luz: THREE.MeshBasicMaterial }; laranja: number; r?: number }> = ({ a, b, m, laranja, r = 0.02 }) => (
  <>
    <Haste a={a} b={b} r={r} mat={m.aco} />
    {laranja > 0.02 && <Haste a={a} b={b} r={r * 1.5} mat={m.luz} />}
  </>
);

const Opac: React.FC<{ m: THREE.Material; v: number }> = ({ m, v }) => {
  m.opacity = v;
  m.visible = v > 0.005;
  return null;
};

// ------------------------------------------------------------------------------ elevador de hoje
const Hoje: React.FC<{ e: Estado }> = ({ e }) => {
  const g = useMemo(() => {
    const arco = (r: number) => new THREE.TorusGeometry(r, 0.022, 6, 40, Math.PI).rotateZ(0); // meia-volta por cima
    return {
      cabine: new THREE.BoxGeometry(CABINE.w, CABINE.h, CABINE.d),
      porta: new THREE.BoxGeometry(CABINE.w * 0.62, CABINE.h * 0.82, 0.02),
      viga: new THREE.BoxGeometry(CABINE.w + 0.25, 0.12, 0.22),
      contra: new THREE.BoxGeometry(CONTRA.w, CONTRA.h, CONTRA.d),
      trilho: new THREE.BoxGeometry(0.07, POCO.h, 0.12),
      trilhoCw: new THREE.BoxGeometry(0.05, POCO.h, 0.08),
      poco: new THREE.BoxGeometry(POCO.x1 - POCO.x0, POCO.h, POCO.z * 2),
      laje: new THREE.BoxGeometry(POCO.x1 - POCO.x0 + 0.3, 0.1, POCO.z * 2 + 0.3),
      andar: new THREE.BoxGeometry(POCO.x1 - POCO.x0, 0.03, 0.05),
      polia: new THREE.CylinderGeometry(POLIA.r, POLIA.r, 0.42, 48).rotateX(Math.PI / 2),
      eixo: new THREE.CylinderGeometry(0.08, 0.08, 1.1, 16).rotateX(Math.PI / 2),
      motor: new THREE.CylinderGeometry(0.42, 0.42, 0.75, 32).rotateX(Math.PI / 2),
      base: new THREE.BoxGeometry(1.2, 0.18, 1.4),
      raio: new THREE.BoxGeometry(POLIA.r * 1.7, 0.07, 0.44),
      arco: arco(POLIA.r),
      limit: new THREE.CylinderGeometry(LIMIT.r, LIMIT.r, 0.12, 32).rotateX(Math.PI / 2),
      peso: new THREE.BoxGeometry(0.1, 0.16, 0.08),
      peLimit: new THREE.CylinderGeometry(0.14, 0.14, 0.1, 24).rotateX(Math.PI / 2),
      arcoLimit: new THREE.TorusGeometry(LIMIT.r, 0.012, 6, 30, Math.PI),
      arcoPe: new THREE.TorusGeometry(0.14 + 0.06, 0.012, 6, 30, Math.PI).rotateZ(Math.PI),
      garra: new THREE.BoxGeometry(0.14, 0.26, 0.24),
      alav: new THREE.BoxGeometry(0.34, 0.05, 0.05),
      mola: new THREE.CylinderGeometry(0.12, 0.12, 0.35, 16),
    };
  }, []);
  const m = useMemo(() => ({
    objeto: toon(COR.objeto),
    sombra: toon(COR.sombra),
    escuro: toon(COR.escuro),
    cabine: toon(COR.objeto),
    porta: toon('#D9D4C7'),
    poco: toon(COR.rotulo, { transparent: true, opacity: 0.05, depthWrite: false }),
    laje: toon(COR.objeto, { transparent: true, opacity: 0.35, depthWrite: false }),
    aco: toon('#C9CCD2'),
    luz: brilho(COR.move, 2.3),
    apagado: toon('#C9CCD2', { transparent: true, opacity: 0.15, depthWrite: false }),
    faisca: brilho('#FFD9A8', 2.8),
  }), []);

  const yc = e.yc, ycw = e.ycw;
  const topoCab = yc + CABINE.h + 0.06;
  const topoCw = ycw + CONTRA.h + 0.02;
  const xa = CABINE.cx, xb = CONTRA.cx;
  const yP = POLIA.y;
  const xl = LIMIT.x, zl = 0.55;
  // ponto em que a alavanca da cabine pega o cabo do limitador
  const yAlav = yc + CABINE.h - 0.25;
  const giroAlav = e.alavanca * 0.6;
  const fa = useMemo(() => { const r = aleatorio(4); return Array.from({ length: 24 }, () => [r(), r(), r()]); }, []);

  return (
    <group>
      {/* poço: contorno e lajes */}
      <group position={[(POCO.x0 + POCO.x1) / 2, POCO.h / 2, 0]}>
        <mesh geometry={g.poco} material={m.poco} />
        <Contorno geo={g.poco} largura={1.6} opacidade={0.55} />
      </group>
      <Peca geo={g.laje} mat={m.laje} position={[(POCO.x0 + POCO.x1) / 2, POCO.h + 0.05, 0]} sombra={false} />
      {[1.0, 2.8, 4.6].map((y, i) => (
        <group key={i} position={[(POCO.x0 + POCO.x1) / 2, y - 0.02, -POCO.z]}>
          <mesh geometry={g.andar} material={m.sombra} />
        </group>
      ))}

      {/* trilhos */}
      {TRILHO_X.map((x, i) => <Peca key={i} geo={g.trilho} mat={m.sombra} position={[x, POCO.h / 2, 0]} />)}
      {[-1, 1].map((s) => <Peca key={s} geo={g.trilhoCw} mat={m.sombra} position={[xb + s * (CONTRA.w / 2 + 0.06), POCO.h / 2, 0]} />)}

      {/* amortecedores no fundo do poço */}
      <Peca geo={g.mola} mat={m.escuro} position={[xa, 0.18, 0]} />
      <Peca geo={g.mola} mat={m.escuro} position={[xb, 0.18, 0]} />

      {/* cabine */}
      <group position={[xa, yc + CABINE.h / 2, 0]}>
        <Peca geo={g.cabine} mat={m.cabine} quente={e.dest.cabine} />
        <group position={[0, -0.05, CABINE.d / 2 + 0.012]}><Peca geo={g.porta} mat={m.porta} largura={1.6} /></group>
        <Peca geo={g.viga} mat={m.escuro} position={[0, CABINE.h / 2 + 0.06, 0]} />
        {/* alavanca: do lado esquerdo, pega o cabo do limitador */}
        <group position={[-CABINE.w / 2, CABINE.h / 2 - 0.25, zl]} rotation={[0, 0, giroAlav]}>
          <group position={[-0.17, 0, 0]}><Peca geo={g.alav} mat={m.escuro} quente={e.dest.alav} /></group>
        </group>
      </group>
      {/* garras: duas mandíbulas que fecham no trilho */}
      {TRILHO_X.map((x, i) => [-1, 1].map((s) => (
        <group key={`${i}${s}`} position={[x, yc + 0.16, s * (0.1 - 0.035 * e.garras)]}>
          <Peca geo={g.garra} mat={m.escuro} quente={Math.max(e.dest.garras, e.garras * 0.8)} />
        </group>
      )))}
      {/* faíscas nas garras */}
      {e.faiscas > 0.01 && TRILHO_X.map((x, i) => fa.map(([a, b, c], k) => {
        const fase = (e.t * 3 + a) % 1;
        return (
          <mesh key={`${i}-${k}`} geometry={CUBO} material={m.faisca}
            position={[x + (b - 0.5) * 0.6 * fase, yc + 0.1 + fase * 0.9 * (0.4 + c), (c - 0.5) * 0.5 * fase]} scale={0.03 * (1 - fase) * e.faiscas} />
        );
      }))}

      {/* contrapeso */}
      <group position={[xb, ycw + CONTRA.h / 2, 0]}>
        <Peca geo={g.contra} mat={m.escuro} quente={e.dest.contra} />
      </group>

      {/* casa de máquinas: base, motor e polia */}
      <Peca geo={g.base} mat={m.sombra} position={[POLIA.cx, POCO.h + 0.19, -0.05]} />
      <group position={[POLIA.cx, yP, -0.95]}><Peca geo={g.motor} mat={m.objeto} quente={e.dest.motor} /></group>
      <group position={[POLIA.cx, yP, -0.45]}><mesh geometry={g.eixo} material={m.escuro} /></group>
      <group position={[POLIA.cx, yP, 0]} rotation={[0, 0, -e.angPolia]}>
        <Peca geo={g.polia} mat={m.objeto} quente={e.dest.polia} />
        <Peca geo={g.raio} mat={m.escuro} position={[0, 0, 0.0]} contorno={false} />
      </group>

      {/* cabos de aço: sobem da cabine, passam por cima da polia e descem até o contrapeso */}
      {Array.from({ length: N_CABOS }, (_, i) => {
        const c = e.cabos[i];
        const z = 0;
        const dx = dxCabo(i);
        const lar = Math.max(e.puxando, c.conta) * (1 - c.apagado);
        const mat = c.apagado > 0.5 ? m.apagado : m.aco;
        if (!c.vivo) {
          // arrebentou: sobra um pedaço pendurado em cada lado
          return (
            <group key={i}>
              <Haste a={[xa + dx, topoCab, z]} b={[xa + dx + 0.05 * Math.sin(i), topoCab + 0.35, z]} r={0.022} mat={m.aco} />
              <Haste a={[xa + dx, yP, z]} b={[xa + dx + 0.04 * Math.cos(i), yP - 0.6, z]} r={0.022} mat={m.aco} />
              <Haste a={[xb + dx, yP, z]} b={[xb + dx, topoCw, z]} r={0.022} mat={m.aco} />
            </group>
          );
        }
        return (
          <group key={i}>
            <Cabo a={[xa + dx, topoCab, z]} b={[xa + dx, yP, z]} m={{ aco: mat, luz: m.luz }} laranja={lar} />
            <group position={[POLIA.cx + dx, yP, 0.22]}><mesh geometry={g.arco} material={mat} /></group>
            <Cabo a={[xb + dx, yP, z]} b={[xb + dx, topoCw, z]} m={{ aco: mat, luz: m.luz }} laranja={lar} />
          </group>
        );
      })}
      <Opac m={m.luz} v={1} />
      {e.estalo > 0.01 && <mesh geometry={CUBO} material={m.faisca} position={[xa, topoCab + 0.4, 0]} scale={0.5 * e.estalo} />}

      {/* limitador de velocidade: rodinha lá em cima, polia no fundo do poço e o cabo dele em volta */}
      <group position={[xl, LIMIT.y, zl]} rotation={[0, 0, -e.angLimit]}>
        <Peca geo={g.limit} mat={m.objeto} quente={e.dest.limit} />
        {[-1, 1].map((s) => (
          <group key={s} rotation={[0, 0, s * (0.15 + e.pesos * 0.9)]}>
            <group position={[0, s * 0.11, 0.08]}><Peca geo={g.peso} mat={m.escuro} quente={e.dest.limit} /></group>
          </group>
        ))}
      </group>
      <group position={[xl, LIMIT.y, zl]}><mesh geometry={g.arcoLimit} material={m.aco} /></group>
      <group position={[xl, PE_LIMIT, zl]}><Peca geo={g.peLimit} mat={m.objeto} /></group>
      <group position={[xl, PE_LIMIT, zl]}><mesh geometry={g.arcoPe} material={m.aco} /></group>
      <Cabo a={[xl - LIMIT.r, LIMIT.y, zl]} b={[xl - LIMIT.r, PE_LIMIT, zl]} m={{ aco: m.aco, luz: m.luz }} laranja={e.dest.limit * 0.9} r={0.014} />
      <Cabo a={[xl + LIMIT.r, LIMIT.y, zl]} b={[xl + LIMIT.r, PE_LIMIT, zl]} m={{ aco: m.aco, luz: m.luz }} laranja={Math.max(e.dest.limit * 0.9, e.travaLimit ? 0.9 : 0)} r={0.014} />
      {/* ponto onde o cabo do limitador prende na cabine */}
      <Haste a={[xa - CABINE.w / 2, yAlav, zl]} b={[xl + LIMIT.r, yAlav, zl]} r={0.02} mat={m.escuro} />
    </group>
  );
};

// ------------------------------------------------------------------------------ plataforma do Otis
const Otis: React.FC<{ e: Estado }> = ({ e }) => {
  const g = useMemo(() => ({
    poste: new THREE.BoxGeometry(0.18, OTIS.alto, 0.24),
    dente: new THREE.BoxGeometry(0.08, 0.08, 0.2).rotateZ(Math.PI / 4),
    viga: new THREE.BoxGeometry(OTIS.postoX * 2 + 0.3, 0.2, 0.3),
    roldana: new THREE.CylinderGeometry(0.16, 0.16, 0.1, 24).rotateX(Math.PI / 2),
    plat: new THREE.BoxGeometry(OTIS.larg, 0.1, 1.2),
    caixa: new THREE.BoxGeometry(0.5, 0.45, 0.45),
    caixa2: new THREE.BoxGeometry(0.4, 0.32, 0.4),
    trava: new THREE.BoxGeometry(0.2, 0.09, 0.14),
    pe: new THREE.BoxGeometry(0.5, 0.06, 0.5),
  }), []);
  const m = useMemo(() => ({
    madeira: toon(COR.madeira),
    objeto: toon(COR.objeto),
    escuro: toon(COR.escuro),
    corda: toon('#D8C49A'),
    mola: toon('#C9CCD2'),
  }), []);
  const yp = e.yPlat;
  const dentes = useMemo(() => Array.from({ length: 24 }, (_, i) => 0.4 + i * 0.18), []);
  // mola: arco em cima da plataforma; esticada pela corda (curva alta e curta) ou solta (baixa e larga)
  const vao = 0.5 + 0.38 * e.solta;
  const flecha = 0.42 - 0.3 * e.solta;
  const yMola = yp + 0.12;
  const pts = Array.from({ length: 21 }, (_, i) => {
    const u = i / 20 * 2 - 1;
    return new THREE.Vector3(u * vao, yMola + flecha * (1 - u * u), 0);
  });
  const molaGeo = useMemo(() => new THREE.BufferGeometry(), []);
  const tubo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.035, 8);
  molaGeo.copy(tubo);
  tubo.dispose();
  const xTrava = 0.62 + 0.34 * e.travasFora;
  const topoCorda = OTIS.alto - 0.1;
  return (
    <group>
      {[-1, 1].map((s) => (
        <group key={s}>
          <Peca geo={g.poste} mat={m.madeira} position={[s * OTIS.postoX, OTIS.alto / 2, 0]} />
          {dentes.map((y, i) => <Peca key={i} geo={g.dente} mat={m.madeira} position={[s * (OTIS.postoX - 0.1), y, 0]} quente={e.dest.travas * 0.8} largura={1.4} />)}
          <Peca geo={g.pe} mat={m.madeira} position={[s * OTIS.postoX, 0.03, 0]} />
        </group>
      ))}
      <Peca geo={g.viga} mat={m.madeira} position={[0, OTIS.alto, 0]} />
      <group position={[0, topoCorda, 0.2]}><Peca geo={g.roldana} mat={m.escuro} /></group>
      {/* corda: inteira até a mola, ou cortada (um pedaço em cima, outro em baixo) */}
      {e.cordaInteira ? (
        <Haste a={[0, topoCorda, 0.2]} b={[0, yMola + flecha, 0.0]} r={0.03} mat={m.corda} />
      ) : (
        <>
          <Haste a={[0, topoCorda, 0.2]} b={[0, topoCorda - 0.7, 0.2]} r={0.03} mat={m.corda} />
          <Haste a={[0, yMola + flecha, 0]} b={[0.08, yMola + flecha + 0.3, 0.05]} r={0.03} mat={m.corda} />
        </>
      )}
      {/* plataforma, caixas, mola e travas */}
      <Peca geo={g.plat} mat={m.madeira} position={[0, yp, 0]} />
      <Peca geo={g.caixa} mat={m.objeto} position={[-0.42, yp + 0.28, 0.25]} />
      <Peca geo={g.caixa2} mat={m.objeto} position={[0.45, yp + 0.21, 0.28]} />
      <mesh geometry={molaGeo} material={m.mola} />
      <Contorno geo={molaGeo} quente={e.dest.mola} largura={1.6} angulo={60} />
      {[-1, 1].map((s) => (
        <group key={s} position={[s * xTrava, yMola + 0.02, 0]}>
          <Peca geo={g.trava} mat={m.escuro} quente={e.dest.travas} />
        </group>
      ))}
    </group>
  );
};

export const Elevador: React.FC<{ e: Estado }> = ({ e }) => (
  <group rotation={[0, e.giro, 0]}>
    {e.hoje > 0.01 && <group scale={Math.max(0.001, e.hoje)}><Hoje e={e} /></group>}
    {e.otis > 0.01 && <group scale={Math.max(0.001, e.otis)}><Otis e={e} /></group>}
  </group>
);
