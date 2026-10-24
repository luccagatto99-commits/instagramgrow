import { Composition } from 'remotion';
import { Video, DURACAO_FRAMES } from './Video';

export const Root: React.FC = () => (
  <Composition id="Fechadura" component={Video} durationInFrames={DURACAO_FRAMES} fps={30} width={1080} height={1920} />
);
