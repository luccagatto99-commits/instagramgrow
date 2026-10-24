# Prompt para colar no Claude Code — Vídeo 12

Antes de colar: copie a pasta `04-video-12` para o projeto e salve a narração do ElevenLabs em `public/narracao.mp3`.

---

Monte o vídeo 12 seguindo o CLAUDE.md deste projeto, no TEMA PRETO (post 16 do feed), reaproveitando os componentes já criados (inclusive o **Cronometro90** do vídeo 11). O roteiro está em `04-video-12/roteiro.md` e a narração em `04-video-12/narracao-elevenlabs.txt`.

Este vídeo tem cerca de 88 segundos (se o áudio passar de 92 s, me avise antes de montar). Algo muda na tela a cada 1,5–2 s, a legenda palavra por palavra fica sempre visível, e o frame 0 já mostra uma mão segurando uma foto impressa na frente do celular, sem conseguir desbloquear (nada de abertura ou logo).

Componentes novos (reutilizáveis):
- **CelularContorno**: celular genérico (sem logo, sem notch idêntico ao da Apple), com tela de bloqueio e cadeado que abre.
- **RostoContorno**: rosto simples de contorno, com variações: normal, com óculos, com barba crescendo, rosto estranho, e foto plana.
- **NuvemDePontos**: pontos azuis projetados sobre o rosto; podem se espaçar (longe) ou juntar (perto) e subir para formar uma malha 3D girando.
- **FitaAssinatura**: fita de números azuis em JetBrains Mono.
- **MedidorSemelhanca**: barra que sobe do vermelho ao verde.

Sincronização:
1. Duração = duração do `public/narracao.mp3` + 1,5 s parados no final.
2. A narração tem 8 blocos (um por parágrafo). Use `ffmpeg -af silencedetect=noise=-35dB:d=0.35`, escolha as 7 pausas mais longas como divisões e confira a ordem. Se não bater, use os tempos do roteiro e me avise.
3. Legenda palavra por palavra, distribuída pelo número de caracteres.
4. Eventos: a mão com a foto impressa aparece no frame 0 e o cadeado treme fechado em "não consegue desbloquear"; a tela escurece e o cadeado abre em "até no escuro"; o selo "em 90s" vira cronômetro em "noventa segundos"; o projetor dispara em "projetor"; o contador 30.000+ em "trinta mil"; a troca para visão infravermelha em "não enxerga"; o rótulo "perto" no nariz em "mais perto"; "longe" na bochecha em "mais longe"; a malha 3D em "mapa em 3D"; a placa CHIP DE IA em "Aí entra a IA"; a fita de números em "sequência de números"; o cofre CADASTRO em "quando você cadastrou"; o medidor sobe em "parecidos o bastante"; o rosto estranho e o contador 1 em 1.000.000 em "um estranho"; a foto plana em "a foto não funciona"; ✗ SEM PROFUNDIDADE em "profundidade"; os óculos em "óculos"; a barba em "barba nova"; o cofre tranca em "nunca sai do seu celular"; a nuvem falha em "Nem a Apple".

Regras: sem logo da Apple, sem foto de iPhone real e sem rostos reais. Fatos da Apple levam REAL; números e animações levam ILUSTRATIVO. Nada encostando nas bordas: respeite a zona segura em todas as cenas.

A capa já está pronta em `04-video-12/capa.png`; copie para `out/ep12/`.

Entregue em `out/ep12/`: video.mp4, capa.png, legendas.srt e legenda_post.txt. Antes de entregar, extraia um frame do meio de cada bloco com ffmpeg, confira e corrija (texto cortado, zona proibida, elementos encostando nas bordas, cores, logos). Depois me mande um resumo de 3 linhas e os frames.
