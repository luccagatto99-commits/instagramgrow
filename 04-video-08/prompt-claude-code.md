# Prompt para colar no Claude Code — Vídeo 08

Antes de colar: copie a pasta `04-video-08` para o projeto e salve a narração do ElevenLabs em `public/narracao.mp3`.

---

Monte o vídeo 08 seguindo o CLAUDE.md deste projeto, no TEMA PRETO (post 10 do feed), reaproveitando os componentes já criados. O roteiro está em `04-video-08/roteiro.md` e a narração em `04-video-08/narracao-elevenlabs.txt`.

Este vídeo tem cerca de 90 segundos (se o áudio passar de 92 s, me avise antes de montar). Algo muda na tela a cada 1,5–2 s, a legenda palavra por palavra fica sempre visível, e o frame 0 já mostra o celular tocando com o contador de euros subindo (nada de abertura ou logo).

Componentes novos (reutilizáveis): **Celular** (contorno branco, vibra, mostra chamada/disca), **BalaoMensagem** (balão de chat genérico, sem logo), **OndaDeSom** (barras que reagem ao áudio e podem ser cortadas em caixas), **Medidor** (mostrador circular com rótulo), **ImpressaoDigital** (desenho de digital feito de números azuis), **ContadorDinheiro** (valor em euros subindo/descendo).

Sincronização:
1. Duração = duração do `public/narracao.mp3` + 1,5 s parados no final.
2. A narração tem 9 blocos (um por parágrafo). Use `ffmpeg -af silencedetect=noise=-35dB:d=0.35`, escolha as 8 pausas mais longas como divisões e confira a ordem. Se não bater, use os tempos do roteiro e me avise.
3. Legenda palavra por palavra, distribuída pelo número de caracteres.
4. Eventos: o contador sobe em "noventa e cinco milhões"; o balão de ligação em "advogado"; a silhueta vira números em "inteligência artificial"; o balão de mensagem em "WhatsApp"; os ✓ em "transferências urgentes" e "confirmando"; os ✗ + FALSO em "falsas"; a etiqueta VOZ GERADA POR IA em "você está ouvindo agora"; a porta abre em "dentro dessa máquina"; a guilhotina corta em "corta o áudio"; os números azuis em "números"; os medidores em "tom, ritmo, sotaque"; a digital em "impressão digital"; a roleta em "prevendo"; a frase "Pode transferir." forma-se até "aquela voz"; a ficha Microsoft em "três segundos"; os ícones caem em "entrevista ou áudio de WhatsApp"; as barras de recuperado/perdido em "metade" e "criptomoeda"; o ✓ final em "ligar de volta".

Regras: sem logos de bancos, WhatsApp ou Microsoft; sem nomes ou rostos das pessoas reais do caso. Fatos levam selo REAL; números de áudio e porcentagens levam ILUSTRATIVO.

A capa já está pronta em `04-video-08/capa.png`; copie para `out/ep08/`.

Entregue em `out/ep08/`: video.mp4, capa.png, legendas.srt e legenda_post.txt. Antes de entregar, extraia um frame do meio de cada bloco com ffmpeg, confira e corrija (texto cortado, zona proibida, cores, logos). Depois me mande um resumo de 3 linhas e os frames.
