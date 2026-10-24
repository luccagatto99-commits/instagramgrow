# Prompt para colar no Claude Code — Vídeo 14

Antes de colar: copie a pasta `04-video-14` para o projeto e salve a narração do ElevenLabs em `public/narracao.mp3`.

---

Monte o vídeo 14 seguindo o CLAUDE.md deste projeto, no TEMA AMARELO (post 19 do feed), reaproveitando os componentes já criados (inclusive o **Cronometro90** e o **CelularContorno**). O roteiro está em `04-video-14/roteiro.md` e a narração em `04-video-14/narracao-elevenlabs.txt`.

Este vídeo tem cerca de 82 segundos (se o áudio passar de 92 s, me avise antes de montar). Algo muda na tela a cada 1,5–2 s, a legenda palavra por palavra fica sempre visível, e o frame 0 já mostra o mapa com a avenida ficando vermelha (nada de abertura ou logo).

Componentes novos (reutilizáveis):
- **MapaContorno**: mapa genérico de ruas (contorno preto, ruas que mudam de cor verde → laranja → vermelho conforme um parâmetro de velocidade).
- **PontoCelular**: pontinho/celular que anda pelas ruas com velocidade ajustável e solta balões de localização.
- **GrafoRuas**: o mapa vira uma rede de nós ligados; uma "onda" vermelha pode se espalhar de um nó para os vizinhos.
- **GraficoTipico**: barras azuis do trânsito típico por horário.

Sincronização:
1. Duração = duração do `public/narracao.mp3` + 1,5 s parados no final.
2. A narração tem 8 blocos (um por parágrafo). Use `ffmpeg -af silencedetect=noise=-35dB:d=0.35`, escolha as 7 pausas mais longas como divisões e confira a ordem. Se não bater, use os tempos do roteiro e me avise.
3. Legenda palavra por palavra, distribuída pelo número de caracteres.
4. Eventos: a lupa e o NENHUM SENSOR em "sensor nenhum"; o selo vira cronômetro em "noventa segundos"; o celular no carro em "celular de quem está no trânsito"; os balões em "onde estão"; o rótulo anônimo em "anônima"; os pontinhos desaceleram em "andam devagar"; a rua muda de cor em "laranja" e "vermelha"; a placa PREVISÃO em "prever"; o trecho vermelho muda de lugar em "o trânsito já mudou"; a placa SALA DE PREVISÃO em "DeepMind"; o calendário em "dia e horário"; o grafo e a onda vermelha em "ruas vizinhas" e "rua lateral"; "chegada: 18h42" em "já sabe disso"; o mapa de cidades e a barra +50% em "cinquenta por cento" e "São Paulo"; o carro parado avisando os de trás em "avisando quem vem atrás".

Regras: sem logo do Google, do Maps ou da DeepMind (nomes só em texto); sem pessoas reais. Fatos levam REAL; gráficos e horários de exemplo levam ILUSTRATIVO. Nada encostando nas bordas: respeite a zona segura em todas as cenas.

A capa já está pronta em `04-video-14/capa.png`; copie para `out/ep14/`.

Entregue em `out/ep14/`: video.mp4, capa.png, legendas.srt e legenda_post.txt. Antes de entregar, extraia um frame do meio de cada bloco com ffmpeg, confira e corrija (texto cortado, zona proibida, elementos encostando nas bordas, cores, logos). Depois me mande um resumo de 3 linhas e os frames.
