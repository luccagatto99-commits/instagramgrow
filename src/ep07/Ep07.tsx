import React from 'react';
import { Episodio, type PlacaTrilha } from '../components';
import { PALAVRAS, DUR_TOTAL, DUR_NARRACAO, inicioBloco, durBloco, palavra } from './tempo';
import { Gancho } from './Bloco01Gancho';
import { Ironia } from './Bloco02Ironia';
import { ComoVoa } from './Bloco03ComoVoa';
import { Problema } from './Bloco04Problema';
import { Ciclo } from './Bloco05Ciclo';
import { Detalhe } from './Bloco06Detalhe';
import { SemDados } from './Bloco07SemDados';
import { Senciente } from './Bloco08Senciente';
import { Volta } from './Bloco09Volta';
import { Fechamento } from './Bloco10Fechamento';

const CENAS = [Gancho, Ironia, ComoVoa, Problema, Ciclo, Detalhe, SemDados, Senciente, Volta, Fechamento];

const TRILHA: PlacaTrilha[] = [
  { nome: 'TESLA ROADSTER', termo: 'Elon Musk · 15 out 2026', de: palavra(0, 'tesla') - 4, ate: inicioBloco(2) - 10 },
  { nome: 'SALA DE MÁQUINAS', termo: 'ventoinhas + jatos de ar', de: inicioBloco(2) + 4, ate: inicioBloco(4) - 10 },
  { nome: 'SALA DE CONTROLE', termo: 'controle por realimentação', de: inicioBloco(4) + 4, ate: inicioBloco(5) - 10 },
  { nome: 'ALMOXARIFADO DE DADOS', termo: 'o que a IA aprende', de: inicioBloco(5) + 4, ate: inicioBloco(7) - 10 },
  { nome: 'LABORATÓRIO', termo: 'senciente ≠ consciente', de: inicioBloco(7) + 4, ate: inicioBloco(8) - 10 },
  { nome: 'TESLA ROADSTER', termo: 'câmera lenta', de: inicioBloco(8) + 4, ate: inicioBloco(9) - 10 },
  { nome: 'TURNO ENCERRADO', de: inicioBloco(9) + 4 },
];

export const Ep07: React.FC = () => (
  <Episodio
    cenas={CENAS}
    palavras={PALAVRAS}
    inicioBloco={inicioBloco}
    durBloco={durBloco}
    durTotal={DUR_TOTAL}
    durNarracao={DUR_NARRACAO}
    narracao="narracao-07.mp3"
    trilha={TRILHA}
    assinatura={false}
  />
);

export const EP07_DURACAO = DUR_TOTAL;
