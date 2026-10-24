# Prompt para colar no Claude Code — Vídeo 10

Antes de colar: copie a pasta `04-video-10` para o projeto e salve a narração do ElevenLabs em `public/narracao.mp3`.

---

Monte o vídeo 10 seguindo o CLAUDE.md deste projeto, no TEMA AMARELO (post 13 do feed), reaproveitando os componentes já criados. O roteiro está em `04-video-10/roteiro.md` e a narração em `04-video-10/narracao-elevenlabs.txt`.

Este vídeo tem cerca de 86 segundos (se o áudio passar de 92 s, me avise antes de montar). Algo muda na tela a cada 1,5–2 s, a legenda palavra por palavra fica sempre visível, e o frame 0 já mostra o quadro cheio de pontos aleatórios piscando (nada de abertura ou logo).

Componentes novos (reutilizáveis):
- **QuadroRuido**: quadro com pontos aleatórios animados (pixels em tons de cinza, semente fixa para ser determinístico) e um parâmetro `nivel` de 0 a 1 que mistura ruído com uma imagem por baixo. É o coração do vídeo: a imagem precisa aparecer e sumir de forma suave e satisfatória.
- **ContadorPassos**: "passo N" em azul.
- **Escultura**: bloco de pedra de contorno que perde pedaços até virar uma estátua simples.
- **Lapis**: ícone de contorno (será riscado).

Sincronização:
1. Duração = duração do `public/narracao.mp3` + 1,5 s parados no final.
2. A narração tem 8 blocos (um por parágrafo). Use `ffmpeg -af silencedetect=noise=-35dB:d=0.35`, escolha as 7 pausas mais longas como divisões e confira a ordem. Se não bater, use os tempos do roteiro e me avise.
3. Legenda palavra por palavra, distribuída pelo número de caracteres.
4. Eventos: o lápis é riscado em "não desenha nada"; os pontos começam a sumir em "vai tirando"; a escultura aparece em "escultor" e ganha forma junto com o quadro; o ? em "como ela sabe"; a placa CONTROLE DE QUALIDADE em "treino"; a foto do cachorro em "um cachorro na praia"; a ESTRAGADORA passa em "estragam" até a foto sumir em "sumir completamente"; a esteira volta em "contrário"; ✗ em "erra", ✓ em "corrige"; o ciclo acelera em "milhões de vezes"; o texto vira números em "vira números"; a limpeza começa em "guia cada passo"; "cachorro" e "praia" acendem quando faladas; a imagem final fica nítida em "nunca existiu"; os 6 dedos em "mãos"; os pontos vizinhos em "costumam ficar"; a pilha de fotos riscada em "não copia"; o quadro se re-limpa em "vai limpando".

Regras: sem logos de geradores de imagem. Animações de difusão levam selo ILUSTRATIVO.

A capa já está pronta em `04-video-10/capa.png`; copie para `out/ep10/`.

Entregue em `out/ep10/`: video.mp4, capa.png, legendas.srt e legenda_post.txt. Antes de entregar, extraia um frame do meio de cada bloco com ffmpeg, confira e corrija (texto cortado, zona proibida, cores, logos). Depois me mande um resumo de 3 linhas e os frames.
