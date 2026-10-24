# Prompt para colar no Claude Code — Vídeo 05

Antes de colar: copie a pasta `04-video-05` para o projeto e salve a narração do ElevenLabs em `public/narracao.mp3`.

---

Monte o vídeo 05 seguindo o CLAUDE.md deste projeto, no TEMA PRETO, reaproveitando os componentes já criados. O roteiro está em `04-video-05/roteiro.md` e a narração em `04-video-05/narracao-elevenlabs.txt`.

Este vídeo tem cerca de 90 segundos (se o áudio passar de 92 s, me avise antes de montar). Algo muda na tela a cada 1,5–2 s, e o primeiro frame já mostra o objeto do gancho em movimento (nada de abertura ou logo).

Componentes novos (reutilizáveis): **Calendario** (calendário de parede que vira páginas e para num ano), **Contador** (número amarelo grande que corre até um valor), **FolhaDatilografada** (documento antigo com texto batendo letra por letra), **PortaChat** (porta fechada com balão de chat e rótulo; usada nos blocos 2 e 8) e **Neve** (flocos brancos caindo, para o inverno da IA).

Sincronização:
1. Duração do vídeo = duração do `public/narracao.mp3` + 1,5 s parados no final.
2. A narração tem 9 blocos (um por parágrafo). Use `ffmpeg -af silencedetect=noise=-35dB:d=0.35`, escolha as 8 pausas mais longas como divisões e confira a ordem. Se não bater, use os tempos do roteiro e me avise.
3. Legenda palavra por palavra, distribuída pelo número de caracteres.
4. Eventos: o calendário dispara em "Erraram"; as rodas de letras viram texto em "quebrar os códigos"; as portas GENTE?/MÁQUINA? aparecem em "propôs um teste"; o carimbo "1ª VEZ" bate em "nasceu o nome"; o contador "20 ANOS" em "vinte anos"; a porta NÃO PERTURBE fecha em "sair da sala"; a placa EFEITO ELIZA desce em "Isso ganhou nome"; a sirene toca em "promessas falharam"; o rei de xadrez cai em "venceu"; o calendário para em 2022 em "ChatGPT"; a porta MÁQUINA? abre em "sem perceber" e o ✓ verde aparece em "Turing imaginou".

Regras: sem fotos de pessoas reais (só silhuetas), sem logos de empresas ou universidades. A conversa da ELIZA leva selo ILUSTRATIVO; datas e nomes levam REAL.

A capa já está pronta em `04-video-05/capa.png`; copie para `out/ep05/`.

Entregue em `out/ep05/`: video.mp4, capa.png, legendas.srt e legenda_post.txt. Antes de entregar, extraia um frame do meio de cada bloco com ffmpeg, confira e corrija (texto cortado, zona proibida, cores, logos). Depois me mande um resumo de 3 linhas e os frames.
