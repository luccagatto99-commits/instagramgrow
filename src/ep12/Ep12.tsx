import React from 'react';
import { Episodio, TEMA_PRETO, type PlacaTrilha } from '../components';
import { PALAVRAS, DUR_TOTAL, DUR_NARRACAO, inicioBloco, durBloco, palavra } from './tempo';
import { Cronometro90 } from '../ep11/comum';
import { Gancho } from './Bloco01Gancho';
import { Projetor } from './Bloco02Projetor';
import { Mapa } from './Bloco03Mapa';
import { Chip } from './Bloco04Chip';
import { Desbloqueia } from './Bloco05Desbloqueia';
import { Foto } from './Bloco06Foto';
import { Dica } from './Bloco07Dica';
import { Fechamento } from './Bloco08Fechamento';

const CENAS = [Gancho, Projetor, Mapa, Chip, Desbloqueia, Foto, Dica, Fechamento];

const TRILHA: PlacaTrilha[] = [
  { nome: 'PROJETOR', termo: 'luz infravermelha', de: inicioBloco(1) + 4, ate: inicioBloco(2) - 10 },
  { nome: 'CÂMERA INFRAVERMELHA', termo: 'mapa 3D do rosto', de: inicioBloco(2) + 4, ate: inicioBloco(3) - 10 },
  { nome: 'CHIP DE IA', termo: 'rosto vira números', de: inicioBloco(3) + 4, ate: inicioBloco(4) + palavra(4, 'celular') - 10 },
  { nome: 'PORTARIA', termo: 'libera ou tranca', de: inicioBloco(4) + palavra(4, 'celular') + 4, ate: inicioBloco(5) - 10 },
  { nome: 'CONTROLE DE QUALIDADE', termo: 'a foto é plana', de: inicioBloco(5) + 4, ate: inicioBloco(6) - 10 },
  { nome: 'ALERTA', termo: 'celular sem os pontos', de: inicioBloco(6) + 4, ate: inicioBloco(7) - 10 },
  { nome: 'TURNO ENCERRADO', de: inicioBloco(7) + 4 },
];

export const Ep12: React.FC = () => (
  <Episodio
    cenas={CENAS}
    palavras={PALAVRAS}
    inicioBloco={inicioBloco}
    durBloco={durBloco}
    durTotal={DUR_TOTAL}
    durNarracao={DUR_NARRACAO}
    narracao="narracao-12.mp3"
    musica="musica-tech.mp3"
    musicaVolume={0.22}
    trilha={TRILHA}
    assinatura={false}
    tema={TEMA_PRETO}
    progressoDireita={290}
    extra={<Cronometro90 vira={palavra(0, '90')} fim={inicioBloco(7)} />}
  />
);

export const EP12_DURACAO = DUR_TOTAL;
