# Prompt para colar no Claude Code — Vídeo 15

Antes de colar: copie a pasta `04-video-15` para o projeto e salve a narração do ElevenLabs em `public/narracao.mp3`.

---

Monte o vídeo 15 seguindo o CLAUDE.md deste projeto, no TEMA AMARELO (post 21 do feed), reaproveitando os componentes já criados (inclusive **Cronometro90**, **CelularContorno** e as esteiras). O roteiro está em `04-video-15/roteiro.md` e a narração em `04-video-15/narracao-elevenlabs.txt`.

Este vídeo tem cerca de 86 segundos (se o áudio passar de 92 s, me avise antes de montar). Algo muda na tela a cada 1,5–2 s, a legenda palavra por palavra fica sempre visível, e o frame 0 já mostra o jantar com o balão "cafeteira" subindo (nada de abertura ou logo).

Componentes novos (reutilizáveis):
- **OuvidoTela**: ouvido laranja que aparece dentro da tela do CelularContorno.
- **PastaVazada**: pasta que abre com folha e carimbos (VAZOU, FORA DO PROGRAMA).
- **ScannerApps**: grade de ícones genéricos passando por um scanner com contador.
- **PontoMicrofone**: ponto verde/laranja que acende no topo do celular.
- **MaquinaSinais**: máquina com esteiras de entrada (ícone + rótulo) e um medidor de porcentagem na saída.
- **FeedRebobina**: feed que rola para trás mostrando anúncios antigos em cinza que acendem.

Sincronização:
1. Duração = duração do `public/narracao.mp3` + 1,5 s parados no final.
2. A narração tem 7 blocos (um por parágrafo). Use `ffmpeg -af silencedetect=noise=-35dB:d=0.35`, escolha as 6 pausas mais longas como divisões e confira a ordem. Se não bater, use os tempos do roteiro e me avise.
3. Legenda palavra por palavra, distribuída pelo número de caracteres.
4. Eventos: o ouvido aparece em "perto do celular"; o selo vira cronômetro em "noventa segundos"; a placa ARQUIVO 2024 em "Em 2024"; o carimbo VAZOU em "vazou"; o carimbo FORA DO PROGRAMA em "programa de parceiros"; o scanner e o contador em "dezessete mil aplicativos"; ÁUDIO ESCONDIDO: 0 em "nenhum enviava"; o pontinho acende em "pontinho na tela"; a MÁQUINA DE ANÚNCIOS em "uma IA que prevê"; cada esteira na palavra correspondente ("curte", "onde você está", "sites", "pessoas perto de você"); "ontem" e a busca em "pesquisou uma cafeteira ontem"; os dois celulares no mesmo Wi-Fi em "mesmo Wi-Fi"; o medidor sobe em "chance de você clicar"; o anúncio acende em "o anúncio aparece"; o feed rebobina em "já apareciam antes"; a placa VOCÊ SÓ REPAROU AGORA em "reparou agora".

Regras: sem logo do Instagram, Meta, Google ou da empresa citada (nomes só em texto); pessoas só de contorno, sem pessoas reais. Fatos levam REAL; o exemplo da cafeteira e o 87% levam ILUSTRATIVO. Nada encostando nas bordas: respeite a zona segura em todas as cenas.

A capa já está pronta em `04-video-15/capa.png`; copie para `out/ep15/`.

Entregue em `out/ep15/`: video.mp4, capa.png, legendas.srt e legenda_post.txt. Antes de entregar, extraia um frame do meio de cada bloco com ffmpeg, confira e corrija (texto cortado, zona proibida, elementos encostando nas bordas, cores, logos). Depois me mande um resumo de 3 linhas e os frames.
