import React from 'react';
import { Episodio, type PlacaTrilha } from '../components';
import { PALAVRAS, DUR_TOTAL, DUR_NARRACAO, inicioBloco, durBloco, palavra } from './tempo';
import { Cronometro90 } from '../ep11/comum';
import { Gancho } from './Bloco01Gancho';
import { Sensor } from './Bloco02Sensor';
import { Vermelho } from './Bloco03Vermelho';
import { Dificil } from './Bloco04Dificil';
import { IA } from './Bloco05IA';
import { SaoPaulo } from './Bloco06SaoPaulo';
import { Voce } from './Bloco07Voce';
import { Fechamento } from './Bloco08Fechamento';

const CENAS = [Gancho, Sensor, Vermelho, Dificil, IA, SaoPaulo, Voce, Fechamento];

const TRILHA: PlacaTrilha[] = [
  { nome: 'O SENSOR', termo: 'o celular de quem dirige', de: inicioBloco(1) + 4, ate: inicioBloco(2) - 10 },
  { nome: 'TRÂNSITO AO VIVO', termo: 'muitos celulares devagar', de: inicioBloco(2) + 4, ate: inicioBloco(3) + palavra(3, 'prever') - 10 },
  { nome: 'PREVISÃO', termo: 'quanto tempo até chegar', de: inicioBloco(3) + palavra(3, 'prever') + 2, ate: inicioBloco(4) - 10 },
  { nome: 'SALA DE PREVISÃO', termo: 'IA da DeepMind', de: inicioBloco(4) + 4, ate: inicioBloco(5) - 10 },
  { nome: 'RESULTADO', termo: 'previsão até 50% melhor', de: inicioBloco(5) + 4, ate: inicioBloco(6) - 10 },
  { nome: 'VOCÊ TAMBÉM', termo: 'seu celular avisa', de: inicioBloco(6) + 4, ate: inicioBloco(7) - 10 },
  { nome: 'TURNO ENCERRADO', de: inicioBloco(7) + 4 },
];

export const Ep14: React.FC = () => (
  <Episodio
    cenas={CENAS}
    palavras={PALAVRAS}
    inicioBloco={inicioBloco}
    durBloco={durBloco}
    durTotal={DUR_TOTAL}
    durNarracao={DUR_NARRACAO}
    narracao="narracao-14.mp3"
    musica="musica-tech.mp3"
    musicaVolume={0.22}
    trilha={TRILHA}
    assinatura={false}
    progressoDireita={290}
    extra={<Cronometro90 vira={palavra(0, '90')} fim={inicioBloco(7)} />}
  />
);

export const EP14_DURACAO = DUR_TOTAL;
