import React from 'react';
import { Composition, Still } from 'remotion';
import { W, H, FPS } from './theme';
import { Ep01, EP01_DURACAO } from './ep01/Ep01';
import { Capa01 } from './ep01/Capa01';
import { Ep02, EP02_DURACAO } from './ep02/Ep02';
import { Ep03, EP03_DURACAO } from './ep03/Ep03';
import { Ep04, EP04_DURACAO } from './ep04/Ep04';
import { Ep05, EP05_DURACAO } from './ep05/Ep05';
import { Capa05 } from './ep05/Capa05';
import { Ep06, EP06_DURACAO } from './ep06/Ep06';
import { Ep07, EP07_DURACAO } from './ep07/Ep07';
import { Ep08, EP08_DURACAO } from './ep08/Ep08';
import { Ep09, EP09_DURACAO } from './ep09/Ep09';
import { Ep10, EP10_DURACAO } from './ep10/Ep10';
import { PreviaCenarios } from './previa/PreviaCenarios';
import { Ep11, EP11_DURACAO } from './ep11/Ep11';
import { PreviaRosto } from './ep12/PreviaRosto';
import { Ep12, EP12_DURACAO } from './ep12/Ep12';
import { Ep13, EP13_DURACAO } from './ep13/Ep13';
import { Ep14, EP14_DURACAO } from './ep14/Ep14';
import { Ep16, EP16_DURACAO } from './ep16/Ep16';
import { Ep17, EP17_DURACAO } from './ep17/Ep17';
import { Ep18, EP18_DURACAO } from './ep18/Ep18';

export const Root: React.FC = () => (
  <>
    <Composition id="Ep01" component={Ep01} durationInFrames={EP01_DURACAO} fps={FPS} width={W} height={H} />
    <Composition id="Ep02" component={Ep02} durationInFrames={EP02_DURACAO} fps={FPS} width={W} height={H} />
    <Composition id="Ep03" component={Ep03} durationInFrames={EP03_DURACAO} fps={FPS} width={W} height={H} />
    <Composition id="Ep04" component={Ep04} durationInFrames={EP04_DURACAO} fps={FPS} width={W} height={H} />
    <Composition id="Ep05" component={Ep05} durationInFrames={EP05_DURACAO} fps={FPS} width={W} height={H} />
    <Composition id="Ep06" component={Ep06} durationInFrames={EP06_DURACAO} fps={FPS} width={W} height={H} />
    <Composition id="Ep07" component={Ep07} durationInFrames={EP07_DURACAO} fps={FPS} width={W} height={H} />
    <Composition id="Ep08" component={Ep08} durationInFrames={EP08_DURACAO} fps={FPS} width={W} height={H} />
    <Composition id="Ep09" component={Ep09} durationInFrames={EP09_DURACAO} fps={FPS} width={W} height={H} />
    <Composition id="Ep10" component={Ep10} durationInFrames={EP10_DURACAO} fps={FPS} width={W} height={H} />
    <Composition id="PreviaCenarios" component={PreviaCenarios} durationInFrames={8} fps={FPS} width={W} height={H} />
    <Composition id="Ep11" component={Ep11} durationInFrames={EP11_DURACAO} fps={FPS} width={W} height={H} />
    <Composition id="Ep12" component={Ep12} durationInFrames={EP12_DURACAO} fps={FPS} width={W} height={H} />
    <Composition id="Ep13" component={Ep13} durationInFrames={EP13_DURACAO} fps={FPS} width={W} height={H} />
    <Composition id="Ep14" component={Ep14} durationInFrames={EP14_DURACAO} fps={FPS} width={W} height={H} />
    <Composition id="Ep16" component={Ep16} durationInFrames={EP16_DURACAO} fps={FPS} width={W} height={H} />
    <Composition id="Ep17" component={Ep17} durationInFrames={EP17_DURACAO} fps={FPS} width={W} height={H} />
    <Composition id="Ep18" component={Ep18} durationInFrames={EP18_DURACAO} fps={FPS} width={W} height={H} />
    <Still id="PreviaRosto" component={PreviaRosto} width={W} height={H} />
    <Still id="Capa01" component={Capa01} width={W} height={H} />
    <Still id="Capa05" component={Capa05} width={W} height={H} />
  </>
);
