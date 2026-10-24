import { useMemo } from 'react';
import * as THREE from 'three';
import { COR, Estado, SENSOR, X_CEL, X_TV } from '../estado';
import { lerp, saida } from '../tempo';
import { Contorno, Peca, brilho, extrudar, retanguloArredondado, toon } from './base';
import { chegando } from './pulsos';

// TV montada olhando para -x (o controle fica à esquerda dela). Coordenadas locais: frente em +z.
const L = 2.7, A = 1.6, P = 0.12, Y0 = 0.66;
const XS = SENSOR.z; // posição do sensor no eixo local x

export const TV: React.FC<{ e: Estado }> = ({ e }) => {
  const g = useMemo(() => ({
    corpo: extrudar(retanguloArredondado(L, A, 0.05, 0, Y0 + A / 2), P, 0.012).translate(0, 0, -P / 2),
    tela: new THREE.PlaneGeometry(L - 0.12, A - 0.14),
    queixo: extrudar(retanguloArredondado(0.36, 0.1, 0.03, XS, 0.6), 0.1, 0.01).translate(0, 0, -0.03),
    janela: new THREE.PlaneGeometry(0.14, 0.045),
    pe: extrudar(retanguloArredondado(0.5, 0.06, 0.03, 0, 0.03), 0.34, 0.01).translate(0, 0, -0.17),
    haste: new THREE.BoxGeometry(0.05, 0.62, 0.04),
    sensorCaixa: new THREE.BoxGeometry(0.09, 0.06, 0.05),
    sensorLente: new THREE.SphereGeometry(0.022, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2).rotateX(Math.PI / 2),
    barra: new THREE.PlaneGeometry(0.05, 0.12),
  }), []);
  const m = useMemo(() => ({
    corpo: toon(COR.objeto, { transparent: true }),
    tela: toon('#17263B'),
    janela: toon('#2A3446'),
    escuro: toon('#2A3446'),
    vol: new THREE.MeshBasicMaterial({ color: COR.rotulo, transparent: true }),
    volApagado: new THREE.MeshBasicMaterial({ color: '#2E4060', transparent: true }),
    lenteAcesa: brilho(COR.move, 2.6),
  }), []);
  if (e.tv <= 0.001) return null;
  const s = saida(e.tv);
  // raio-x: o corpo fica quase transparente para mostrar o sensor
  m.corpo.opacity = 1 - 0.75 * e.raioTV;
  m.corpo.depthWrite = e.raioTV < 0.05;
  const recebe = chegando(e, 'tv');
  const nivel = Math.round(lerp(4, 10, e.volume));
  return (
    <group position={[X_TV, lerp(-2.2, 0, s), 0]} rotation={[0, -Math.PI / 2, 0]}>
      <Peca geo={g.corpo} mat={m.corpo} opacidade={1 - 0.6 * e.raioTV} />
      <mesh geometry={g.tela} material={m.tela} position={[0, Y0 + A / 2, P / 2 + 0.001]} />
      {/* queixo com a janelinha escura do sensor */}
      <Peca geo={g.queixo} mat={m.corpo} opacidade={1 - 0.6 * e.raioTV} largura={1.6} />
      <mesh geometry={g.janela} material={m.janela} position={[XS, 0.6, 0.072]} />
      {/* sensor de infravermelho atrás da janelinha */}
      <group position={[XS, 0.6, 0.02 + 0.1 * e.destaque.sensor]}>
        <Peca geo={g.sensorCaixa} mat={m.escuro} quente={e.destaque.sensor} largura={1.6} />
        <mesh geometry={g.sensorLente} material={recebe ? m.lenteAcesa : m.escuro} position={[0, 0, 0.025]} />
      </group>
      {/* pé */}
      <group position={[0, Y0 - 0.66, 0]}>
        <Peca geo={g.pe} mat={m.corpo} largura={1.6} />
        <mesh geometry={g.haste} material={m.corpo} position={[0, 0.34, -0.02]} />
      </group>
      {/* barra de volume na tela */}
      {e.telaVolume > 0.01 &&
        Array.from({ length: 12 }, (_, i) => (
          <mesh key={i} geometry={g.barra} material={i < nivel ? m.vol : m.volApagado}
            position={[-0.95 + i * 0.075, Y0 + 0.28, P / 2 + 0.004]} scale={[1, 0.5 + i * 0.06, 1]} />
        ))}
    </group>
  );
};

/** o sol: luz parada, que o sensor ignora */
export const Sol: React.FC<{ e: Estado }> = ({ e }) => {
  const m = useMemo(() => ({
    disco: toon(COR.objeto),
    raio: new THREE.MeshBasicMaterial({ color: COR.sombra, transparent: true }),
  }), []);
  const geoDisco = useMemo(() => new THREE.SphereGeometry(0.13, 32, 20), []);
  if (e.sol <= 0.001) return null;
  const c = new THREE.Vector3(X_TV - 0.6, 1.95, 0.35);
  const alvo = new THREE.Vector3(SENSOR.x, SENSOR.y, SENSOR.z);
  m.raio.opacity = 0.55 * e.sol;
  const raios = [-0.12, 0, 0.12].map((dz, i) => {
    const a = c.clone().add(new THREE.Vector3(0, -0.1 * i, dz));
    const b = alvo.clone().add(new THREE.Vector3(0, 0.05 * (i - 1), dz * 0.4));
    const dir = b.clone().sub(a);
    const len = dir.length() * Math.min(1, e.sol * 1.3);
    dir.normalize();
    const meio = a.clone().add(dir.clone().multiplyScalar(len / 2));
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    return (
      <mesh key={i} material={m.raio} position={meio} quaternion={q}>
        <cylinderGeometry args={[0.012, 0.012, len, 8]} />
      </mesh>
    );
  });
  return (
    <group>
      <group position={c} scale={saida(e.sol)}>
        <mesh geometry={geoDisco} material={m.disco} />
        <Contorno geo={geoDisco} largura={1.6} angulo={80} />
      </group>
      {raios}
    </group>
  );
};

/** celular filmando o controle; a luz invisível aparece na tela */
export const Celular: React.FC<{ e: Estado }> = ({ e }) => {
  const g = useMemo(() => ({
    corpo: extrudar(retanguloArredondado(0.86, 1.78, 0.12, 0, 0), 0.085, 0.012).translate(0, 0, -0.0425),
    tela: new THREE.PlaneGeometry(0.78, 1.66),
    modulo: extrudar(retanguloArredondado(0.26, 0.26, 0.07, -0.22, 0.66), 0.03, 0.006).translate(0, 0, -0.07),
    lente: new THREE.CylinderGeometry(0.045, 0.045, 0.02, 24).rotateX(Math.PI / 2),
    canto: new THREE.PlaneGeometry(0.12, 0.012),
    brilho: new THREE.CircleGeometry(0.17, 32),
    nucleo: new THREE.CircleGeometry(0.07, 24),
  }), []);
  const m = useMemo(() => ({
    corpo: toon(COR.objeto),
    tela: toon('#0B1320'),
    escuro: toon('#2A3446'),
    canto: new THREE.MeshBasicMaterial({ color: COR.rotulo }),
    halo: brilho(COR.move, 2.2),
    nucleo: new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false, transparent: true }),
  }), []);
  if (e.cel <= 0.001) return null;
  // pisca no ritmo das rajadas (e um pouco além, para a luz ficar legível)
  const pisca = chegando(e, 'cel') || Math.sin(e.t * 18) > 0.2 ? 1 : 0.25;
  m.halo.opacity = e.brilhoCel * pisca * 0.9;
  m.nucleo.opacity = e.brilhoCel * pisca;
  const s = saida(e.cel);
  const cantos: [number, number, number][] = [[-0.3, 0.73, 0], [0.3, 0.73, 0], [-0.3, -0.73, 0], [0.3, -0.73, 0]];
  return (
    <group position={[X_CEL, lerp(-1.5, 1.25, s), 0.05]} rotation={[0, Math.PI / 2 - 0.35, 0]}>
      <Peca geo={g.corpo} mat={m.corpo} />
      <mesh geometry={g.tela} material={m.tela} position={[0, 0, 0.044]} />
      {/* moldura de câmera na tela */}
      {cantos.map(([x, y], i) => (
        <group key={i} position={[x, y, 0.046]}>
          <mesh geometry={g.canto} material={m.canto} position={[x < 0 ? 0.05 : -0.05, 0, 0]} />
          <mesh geometry={g.canto} material={m.canto} rotation={[0, 0, Math.PI / 2]} position={[0, y < 0 ? 0.05 : -0.05, 0]} />
        </group>
      ))}
      <mesh geometry={g.brilho} material={m.halo} position={[0, 0.05, 0.047]} />
      <mesh geometry={g.nucleo} material={m.nucleo} position={[0, 0.05, 0.048]} />
      {/* câmera traseira */}
      <group position={[0, 0, -0.08 * e.destaque.cameraCel]}>
        <Peca geo={g.modulo} mat={m.escuro} quente={e.destaque.cameraCel} largura={1.6} />
        <mesh geometry={g.lente} material={m.corpo} position={[-0.22, 0.66, -0.075]} />
      </group>
    </group>
  );
};
