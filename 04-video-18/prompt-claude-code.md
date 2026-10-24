# Prompt para colar no Claude Code — Vídeo 17

Antes de colar: copie a pasta `04-video-17` para o projeto e salve a narração do ElevenLabs em `public/narracao.mp3`.

---

Monte o vídeo 17 seguindo o CLAUDE.md deste projeto, no TEMA PRETO (post 24 do feed), reaproveitando os componentes já criados (inclusive **Cronometro90**, as fichas REAL/ILUSTRATIVO e as esteiras). O roteiro está em `04-video-17/roteiro.md` e a narração em `04-video-17/narracao-elevenlabs.txt`.

Este vídeo tem cerca de 86 segundos (se o áudio passar de 92 s, me avise antes de montar). Algo muda na tela a cada 1,5–2 s, a legenda palavra por palavra fica sempre visível, e o frame 0 já mostra o tabuleiro com a peça se movendo sozinha (nada de abertura ou logo).

Componentes novos (reutilizáveis):
- **CerebroContorno**: cérebro de contorno com regiões que acendem e neurônios que soltam faíscas.
- **ChipFios**: chip do tamanho de uma moeda com 64 fios finos saindo; comparação com fio de cabelo; contador de eletrodos.
- **BracoRobo**: braço robótico de contorno que insere fios.
- **GraficoPicos**: várias linhas de sinal com picos (bagunçado → organizado).
- **Decodificador**: máquina em que entram picos e saem setas ← → ●, com barra de acerto.
- **Tabuleiro**: tabuleiro de xadrez simples com cursor que move uma peça.

Sincronização:
1. Duração = duração do `public/narracao.mp3` + 1,5 s parados no final.
2. A narração tem 7 blocos (um por parágrafo). Use `ffmpeg -af silencedetect=noise=-35dB:d=0.35`, escolha as 6 pausas mais longas como divisões e confira a ordem. Se não bater, use os tempos do roteiro e me avise.
3. Legenda palavra por palavra, distribuída pelo número de caracteres.
4. Eventos: a peça anda em "jogou xadrez"; o selo vira cronômetro em "noventa segundos"; a ficha 2016 em "Em 2016"; o corpo fica cinza em "paralisado dos ombros para baixo"; a ficha 1º PACIENTE em "janeiro de 2024"; a moeda em "tamanho de uma moeda"; os fios e o fio de cabelo em "mais finos que um fio de cabelo"; o contador em "mais de mil eletrodos"; o braço robótico em "é um robô"; a região do movimento acende em "pensa em mexer a mão"; o X na medula em "medula lesionada"; os picos em "escutam esses disparos"; a bagunça em "uma bagunça"; a SALA DE DECODIFICAÇÃO em "Aí entra a IA"; as setas em "esquerda, direita e clique"; a barra de acerto em "aprende o dele"; o cursor move o cavalo em "jogando xadrez"; as silhuetas em "dezenas de pacientes"; a cadeira anda em "cadeira de rodas".

Regras: sem logo da Neuralink, Tesla ou X; sem rosto ou foto de pessoas reais (silhuetas de contorno; nomes só em texto). Fatos levam REAL; o gráfico de acerto e os picos levam ILUSTRATIVO. Nada encostando nas bordas: respeite a zona segura em todas as cenas.

A capa já está pronta em `04-video-17/capa.png`; copie para `out/ep17/`.

Entregue em `out/ep17/`: video.mp4, capa.png, legendas.srt e legenda_post.txt. Antes de entregar, extraia um frame do meio de cada bloco com ffmpeg, confira e corrija (texto cortado, zona proibida, elementos encostando nas bordas, cores, logos). Depois me mande um resumo de 3 linhas e os frames.
