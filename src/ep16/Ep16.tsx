import React from 'react';
import { Episodio, type PlacaTrilha } from '../components';
import { PALAVRAS, DUR_TOTAL, DUR_NARRACAO, inicioBloco, durBloco, palavra } from './tempo';
import { Cronometro90 } from '../ep11/comum';
import { Gancho } from './Bloco01Gancho';
import { Motivo } from './Bloco02Motivo';
import { Teste } from './Bloco03Teste';
import { Maquina } from './Bloco04Maquina';
import { Exemplo } from './Bloco05Exemplo';
import { Resumo } from './Bloco06Resumo';
import { Fechamento } from './Bloco07Fechamento';

const CENAS = [Gancho, Motivo, Teste, Maquina, Exemplo, Resumo, Fechamento];

const TRILHA: PlacaTrilha[] = [
  { nome: 'ARQUIVO 2024', termo: 'a desconfiança tem motivo', de: inicioBloco(1) + 4, ate: inicioBloco(2) - 10 },
  { nome: 'LABORATÓRIO', termo: 'teste com 17 mil apps', de: inicioBloco(2) + 4, ate: inicioBloco(3) - 10 },
  { nome: 'MÁQUINA DE ANÚNCIOS', termo: 'IA que adivinha o que você quer', de: inicioBloco(3) + 4, ate: inicioBloco(4) - 10 },
  { nome: 'O EXEMPLO', termo: 'a cafeteira do jantar', de: inicioBloco(4) + 4, ate: inicioBloco(5) - 10 },
  { nome: 'OU SEJA', termo: 'adivinhou, não ouviu', de: inicioBloco(5) + 4, ate: inicioBloco(6) - 10 },
  { nome: 'TURNO ENCERRADO', de: inicioBloco(6) + 4 },
];

export const Ep16: React.FC = () => (
  <Episodio
    cenas={CENAS}
    palavras={PALAVRAS}
    inicioBloco={inicioBloco}
    durBloco={durBloco}
    durTotal={DUR_TOTAL}
    durNarracao={DUR_NARRACAO}
    narracao="narracao-16.mp3"
    musica="musica-tech-16.mp3"
    musicaVolume={0.22}
    trilha={TRILHA}
    assinatura={false}
    progressoDireita={290}
    extra={<Cronometro90 vira={palavra(0, '90')} fim={inicioBloco(6)} />}
  />
);

export const EP16_DURACAO = DUR_TOTAL;
