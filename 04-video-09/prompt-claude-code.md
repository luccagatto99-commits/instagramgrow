# Prompt para colar no Claude Code — Vídeo 09

Antes de colar: copie a pasta `04-video-09` para o projeto e salve a narração do ElevenLabs em `public/narracao.mp3`.

---

Monte o vídeo 09 seguindo o CLAUDE.md deste projeto, no TEMA PRETO (post 12 do feed), reaproveitando os componentes já criados. O roteiro está em `04-video-09/roteiro.md` e a narração em `04-video-09/narracao-elevenlabs.txt`.

Este vídeo tem cerca de 90 segundos (se o áudio passar de 92 s, me avise antes de montar). Algo muda na tela a cada 1,5–2 s, a legenda palavra por palavra fica sempre visível, e o frame 0 já mostra a caixa de chat ganhando braços e pernas na esteira (nada de abertura ou logo).

Importante: o CLAUDE.md proíbe robô humanoide realista. O "robô" deste vídeo é o mascote da fábrica com corpo articulado de contorno, e os testes do Google usam um braço robótico simples de contorno.

Componentes novos (reutilizáveis): **MascoteArticulado** (mascote com braços e pernas que encaixam peça por peça), **BracoRobotico** (braço de contorno com articulações amarelas que acendem por número), **FitaAcao** (fita de números azuis em JetBrains Mono), **LinhaDoTempo** (marcos com ano e placa).

Sincronização:
1. Duração = duração do `public/narracao.mp3` + 1,5 s parados no final.
2. A narração tem 9 blocos (um por parágrafo). Use `ffmpeg -af silencedetect=noise=-35dB:d=0.35`, escolha as 8 pausas mais longas como divisões e confira a ordem. Se não bater, use os tempos do roteiro e me avise.
3. Legenda palavra por palavra, distribuída pelo número de caracteres.
4. Eventos: os braços e pernas encaixam em "corpo de gente"; a ficha Sam Altman em "Sam Altman"; a casa em "em casa"; o ? cai em "mexer um corpo"; a fila de tokens em "tudo vira número"; os ícones de movimento entram em "mover o braço, girar o pulso, fechar a mão"; as duas filas se alinham em "igual a uma frase"; a ficha Google em "Google"; a fita 1 128 91… em "números de movimento"; cada número acende uma parte do braço; a pilha de páginas em "internet"; a cozinha em "cozinha"; o saco balança em "prestes a cair"; o braço pega e aparece NUNCA TREINOU ISSO em "nunca tinha treinado"; o chip acende em "cérebro"; o cubo mágico em "cubo mágico"; FECHADO em "desistiu"; VAGAS: 27 em "vinte e sete"; o braço acena em "mexendo um braço".

Regras: sem logos de OpenAI, ChatGPT ou Google; sem rosto do Sam Altman; nada de robô humanoide realista. Fatos levam REAL; animações de movimento levam ILUSTRATIVO.

A capa já está pronta em `04-video-09/capa.png`; copie para `out/ep09/`.

Entregue em `out/ep09/`: video.mp4, capa.png, legendas.srt e legenda_post.txt. Antes de entregar, extraia um frame do meio de cada bloco com ffmpeg, confira e corrija (texto cortado, zona proibida, cores, logos). Depois me mande um resumo de 3 linhas e os frames.
