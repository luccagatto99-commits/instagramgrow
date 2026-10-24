import { useMemo } from 'react';
import * as THREE from 'three';
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing';
import { Elevador } from './cena/Elevador';
import { Mundo } from './cena/Mundo';
import { Cam, camera } from './camera';
import { estado } from './estado';
import { Hud } from './Hud';
import { DURACAO, FPS } from './tempo';

const Camera: React.FC<{ c: Cam }> = ({ c }) => {
  const cam = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  cam.fov = c.fov;
  cam.near = 0.03;
  cam.far = 120;
  cam.position.set(...c.pos);
  cam.lookAt(...c.alvo);
  cam.updateProjectionMatrix();
  cam.updateMatrixWorld();
  return null;
};

const Efeitos: React.FC<{ c: Cam }> = ({ c }) => {
  const alvo = useMemo(() => new THREE.Vector3(), []);
  alvo.set(...c.alvo);
  const dist = Math.hypot(c.pos[0] - c.alvo[0], c.pos[1] - c.alvo[1], c.pos[2] - c.alvo[2]);
  return (
    <EffectComposer multisampling={4}>
      <DepthOfField target={alvo} worldFocusRange={Math.max(0.8, dist * 0.6)} bokehScale={2.6} />
      <Bloom luminanceThreshold={1.1} luminanceSmoothing={0.1} intensity={1.1} mipmapBlur />
      <Vignette offset={0.35} darkness={0.55} />
    </EffectComposer>
  );
};

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const t = frame / FPS;
  const c = camera(t);
  const e = estado(t);
  const fim = durationInFrames - 1;
  return (
    <AbsoluteFill style={{ background: '#0E1A2B' }}>
      <ThreeCanvas width={width} height={height} shadows={{ type: THREE.PCFSoftShadowMap }} dpr={1}
        gl={{ antialias: false, powerPreference: 'high-performance' }} camera={{ fov: 36, position: [0, 2, 9] }}>
        <Camera c={c} />
        <Mundo t={t} />
        <Elevador e={e} />
        <Efeitos c={c} />
      </ThreeCanvas>
      <Hud t={t} cam={c} e={e} />
      <Audio src={staticFile('narracao.mp3')} />
      <Audio src={staticFile('musica.mp3')}
        volume={(f) => 0.1 * interpolate(f, [0, 20, fim - 45, fim], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
    </AbsoluteFill>
  );
};

export const DURACAO_FRAMES = Math.ceil(DURACAO * FPS);
