# Prompt para colar no Claude Code — Vídeo 07

Antes de colar: copie a pasta `04-video-07` para o projeto e salve a narração do ElevenLabs em `public/narracao.mp3`.

---

Monte o vídeo 07 seguindo o CLAUDE.md deste projeto, no TEMA AMARELO (post 8 do feed), reaproveitando os componentes já criados. O roteiro está em `04-video-07/roteiro.md` e a narração em `04-video-07/narracao-elevenlabs.txt`.

Este vídeo tem cerca de 90 segundos (se o áudio passar de 92 s, me avise antes de montar). Algo muda na tela a cada 1,5–2 s, a legenda palavra por palavra fica sempre visível, e o frame 0 já mostra o carro subindo a rampa de cabeça para baixo (nada de abertura ou logo).

Componentes novos (reutilizáveis): **CarroEsportivo** (carro de contorno genérico em cunha, com 10 bicos de jato que acendem individualmente e nuvem de ar), **CicloDeControle** (3 estações MEDE → COMPARA → CORRIGE em círculo, com velocidade ajustável), **Cronometro** (milissegundos correndo), **Contador** (número azul que corre até um valor), **PastaVazia** (pasta com contador em vermelho).

Sincronização:
1. Duração = duração do `public/narracao.mp3` + 1,5 s parados no final.
2. A narração tem 10 blocos (um por parágrafo). Use `ffmpeg -af silencedetect=noise=-35dB:d=0.35`, escolha as 9 pausas mais longas como divisões e confira a ordem. Se não bater, use os tempos do roteiro e me avise.
3. Legenda palavra por palavra, distribuída pelo número de caracteres.
4. Eventos: o velocímetro 0 → 100 e o cronômetro em "zero a cem"; o carro fica de cabeça para baixo em "cabeça para baixo"; o salto sobre os 5 carros em "cinco carros"; o giro e o pouso em "mortal no ar"; o banco vazio + carimbo SEM MOTORISTA em "Sem ninguém dirigindo"; a faixa TESLA ROADSTER em "Tesla Roadster"; o balão da plateia em "provar que não era IA"; o mascote aparece no banco em "computador"; as setas de sucção e o 2G em "duas vezes a gravidade"; os bicos acendem de 1 a 10 em "dez jatos"; a ficha SpaceX em "SpaceX"; o cronômetro em "fração de segundo"; o bonequinho se embola em "Nenhum humano"; o ciclo gira em "repete um ciclo", com cada estação acendendo em "mede", "compara" e "corrige"; o foguete pousa em "foguetes"; a parede de vídeos em "milhões de vídeos"; a pasta vazia em "dando mortal"; a prateleira vazia em "versão limitada"; o balão "senciente" abre em "Não é consciência"; o mortal em câmera lenta em "não teve humano nenhum".

Regras: sem logo da Tesla ou da SpaceX, sem fotos/vídeos reais do evento e sem o rosto de Elon Musk (nomes só em texto). Frases reais do Musk e do designer levam selo REAL e ficha de fonte; o corte do carro, o ciclo de controle e os números de ângulo levam ILUSTRATIVO.

A capa já está pronta em `04-video-07/capa.png`; copie para `out/ep07/`.

Entregue em `out/ep07/`: video.mp4, capa.png, legendas.srt e legenda_post.txt. Antes de entregar, extraia um frame do meio de cada bloco com ffmpeg, confira e corrija (texto cortado, zona proibida, cores, logos). Depois me mande um resumo de 3 linhas e os frames.
