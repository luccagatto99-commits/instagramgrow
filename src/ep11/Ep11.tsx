import React from 'react';
import { Episodio, type PlacaTrilha } from '../components';
import { PALAVRAS, DUR_TOTAL, DUR_NARRACAO, inicioBloco, durBloco, palavra } from './tempo';
import { Cronometro90 } from './comum';
import { Gancho } from './Bloco01Gancho';
import { Treino } from './Bloco02Treino';
import { Problema } from './Bloco03Problema';
import { Solucao } from './Bloco04Solucao';
import { Movimento } from './Bloco05Movimento';
import { Fisica } from './Bloco06Fisica';
import { Fechamento } from './Bloco07Fechamento';

const CENAS = [Gancho, Treino, Problema, Solucao, Movimento, Fisica, Fechamento];

const TRILHA: PlacaTrilha[] = [
  { nome: 'ESTÚDIO DE VÍDEO', termo: 'difusão', de: palavra(0, 'tela') - 4, ate: palavra(0, 'cena') - 12 },
  { nome: 'CONTROLE DE QUALIDADE', termo: 'treino', de: inicioBloco(1) + palavra(1, 'treino,'), ate: inicioBloco(2) - 10 },
  { nome: 'ESTÚDIO DE VÍDEO', termo: 'difusão + atenção', de: inicioBloco(2) + 4, ate: inicioBloco(5) - 10 },
  { nome: 'DEPÓSITO DE DEFEITOS', termo: 'erros de física', de: inicioBloco(5) + 4, ate: inicioBloco(6) - 10 },
  { nome: 'TURNO ENCERRADO', de: inicioBloco(6) + 4 },
];

export const Ep11: React.FC = () => (
  <Episodio
    cenas={CENAS}
    palavras={PALAVRAS}
    inicioBloco={inicioBloco}
    durBloco={durBloco}
    durTotal={DUR_TOTAL}
    durNarracao={DUR_NARRACAO}
    narracao="narracao-11.mp3"
    musica="musica-tech.mp3"
    musicaVolume={0.22}
    trilha={TRILHA}
    assinatura={false}
    progressoDireita={290}
    halo
    extra={<Cronometro90 vira={palavra(0, '90')} fim={inicioBloco(6)} />}
  />
);

export const EP11_DURACAO = DUR_TOTAL;
