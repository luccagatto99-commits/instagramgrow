import React, { createContext, useContext } from 'react';

/**
 * Camadas da cena: o "mundo" (fábrica, esteira, caixas) recebe zoom e cortes de câmera;
 * o "hud" (títulos, quadros, balões) fica fixo por cima. "livre" = sem separação.
 */
export type Camada = 'livre' | 'mundo' | 'hud';
export const CamadaCtx = createContext<Camada>('livre');
export const useCamada = () => useContext(CamadaCtx);

/** Estilo para elementos de texto fixo: somem no mundo, aparecem no hud. */
export const useVisivelNoHud = (): React.CSSProperties => ({ visibility: useCamada() === 'mundo' ? 'hidden' : 'visible' });
