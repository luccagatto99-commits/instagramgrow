import { loadFont as loadArchivoBlack } from '@remotion/google-fonts/ArchivoBlack';
import { loadFont as loadArchivo } from '@remotion/google-fonts/Archivo';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

export const W = 1080;
export const H = 1920;
export const FPS = 30;

// Cada cor tem UM significado (ver CLAUDE.md)
export const COR = {
  amarelo: '#FFD84D', // fundo
  preto: '#111111', // contorno, texto, esteira, placas
  vermelho: '#FF5A36', // máquinas que cortam/transformam; CTA
  azul: '#2F6BFF', // IDs, números, probabilidades
  verde: '#22B573', // o que sai: resposta, token escolhido
  branco: '#FFFFFF', // caixas e balões
} as const;

export const FONTE = {
  titulo: loadArchivoBlack('normal', { weights: ['400'], subsets: ['latin', 'latin-ext'] }).fontFamily,
  rotulo: loadArchivo('normal', { weights: ['700', '900'], subsets: ['latin', 'latin-ext'] }).fontFamily,
  numero: loadMono('normal', { weights: ['700', '800'], subsets: ['latin'] }).fontFamily,
};

export const CONTORNO = 10;
export const RAIO = { caixa: 20, maquina: 36, placa: 40 };
// var(--sombra): o tema preto troca para amarelo (components/Tema.tsx)
export const SOMBRA = `20px 20px 0 var(--sombra, ${COR.preto})`;

// Zona segura do Instagram
export const SEGURA = { topo: 250, base: 420, direita: 140, legendaYMin: 1150, legendaYMax: 1450 };
export const CENTRO_X = W / 2; // 540: centro da tela
export const ESTEIRA_Y = 1000; // topo da esteira (base das caixas)
