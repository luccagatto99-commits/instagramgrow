import type React from 'react';
import { CENTRO_X } from '../theme';
import type { Plano } from './Camera';

/** Uma cena do episódio: o conteúdo, o cenário de fundo e os planos de câmera. */
export type CenaEp = {
  Conteudo: React.FC;
  Fundo: React.FC;
  planos: () => Plano[];
  /** Frames da saída pela esteira no fim da cena (padrão 8; 0 = a próxima cena continua o mesmo quadro). */
  transicao?: number;
  /** -1 = a esteira anda ao contrário (caminho de volta). */
  sentido?: 1 | -1;
  /** false = sem a esteira 2D (cenas em 3D desenham a própria Esteira3D). */
  esteira?: boolean;
};

/** Plano aberto padrão. */
export const ABERTO = (de: number): Plano => ({ de, zoom: 1, foco: [CENTRO_X, 760] });
/** Plano fechado num ponto. */
export const FECHADO = (de: number, x: number, y: number, zoom = 1.3): Plano => ({ de, zoom, foco: [x, y] });
