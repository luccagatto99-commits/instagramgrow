# Projeto: reels da página — identidade "A Fábrica"

Este projeto produz reels verticais que explicam como a IA funciona por dentro. TODO vídeo segue a identidade abaixo. Não invente outro estilo.

## Conceito
Dentro de toda IA existe uma fábrica que transforma o que a pessoa digita em resposta. Cada mecanismo real vira uma máquina:
- Tokenização → TOKENIZADOR (guilhotina que corta palavras em caixas)
- IDs → CARIMBADORA (prensa que carimba um número em cada caixa)
- Embeddings → ALMOXARIFADO (prateleiras; caixas parecidas guardadas perto)
- Posição → ETIQUETADORA
- Atenção → SALA DE REUNIÃO (caixas ligadas por fios de espessura diferente)
- Camadas → LINHA DE MONTAGEM (prédio de vários andares)
- Logits → PAINEL DE APOSTAS · Softmax → BALANÇA · Amostragem/temperatura → ROLETA
- Loop de geração → EXPEDIÇÃO (a caixa escolhida volta para o começo da esteira)
- System prompt → SALA DA DIRETORIA (um manual que entra na esteira antes da pergunta)
- Treino/RLHF → CONTROLE DE QUALIDADE · Alucinações → DEPÓSITO DE DEFEITOS
- Pesquisas de interpretabilidade → LABORATÓRIO · História → ARQUIVO HISTÓRICO

Regras do mundo:
1. Tudo que entra vira caixa (token). Tudo que sai também.
2. Toda máquina tem placa com o nome e, menor, o termo técnico real.
3. PROIBIDO: robô humanoide, cérebro brilhante, código verde caindo, circuitos azuis, fundo escuro, degradê, brilho, textura.
4. A fábrica não tem rosto. O MASCOTE da página (a foto de perfil, arquivo 01-marca/logo/mascote.svg) é uma caixa branca com contorno preto sobre a esteira, com um VISOR preto na testa mostrando uma rede neural (camadas 3-4-2 da esquerda para a direita, linhas amarelas, nós brancos, um ou dois nós azuis) e dois olhos redondos pretos embaixo. Ele aparece em momentos de humor ou reação (~1–2 s), sempre igual. Nos momentos em que a IA "pensa", os nós do visor podem acender em sequência. Componente: Mascote.
5. NÃO usar selos "REAL"/"ILUSTRATIVO" nem etiquetas do tipo na tela (dão cara de vídeo feito por IA). Os dados continuam reais e validados.
6. Logos reais de empresas (Google, OpenAI, Claude, Gemini) podem aparecer quando forem citadas: componente SeloMarca/Logo (simple-icons), sempre em preto num selo branco.
7. Composição centralizada no meio da tela (x=540). Legenda com no máx. 760 px de largura para não ficar sob os botões do Instagram.

## Formato técnico
- Remotion + TypeScript. 1080×1920, 30 fps, H.264.
- Zona segura do Instagram: nada importante nos 250 px do topo, 420 px da base, 140 px da direita. Legendas entre y=1150 e y=1450.
- Tamanho dos objetos do mundo (cena): no máx. ~760 px de largura (x entre 160 e 920) e de y≈600 até a esteira (y=1000). Com Calendario no hud, começar abaixo de y≈640. Nada encosta na placa de área, no calendário, na faixa de alerta nem nas bordas — e conferir também com o zoom do plano FECHADO (foco no centro, zoom ≤ 1,1 em objetos grandes).

## Cores (cada cor tem UM significado — nunca troque)
| Cor | Hex | Significado |
|---|---|---|
| Amarelo Fábrica | #FFD84D | fundo de todo vídeo |
| Preto Contorno | #111111 | contornos, texto, esteira, placas |
| Vermelho Corte | #FF5A36 | máquinas que cortam/transformam; placa de aviso (CTA) |
| Azul Número | #2F6BFF | tudo que é ID, número, nota, probabilidade |
| Verde Saída | #22B573 | o que sai da fábrica: resposta, token escolhido |
| Branco Caixa | #FFFFFF | caixas (tokens) e balões |
Se uma cor não tem papel na cena, ela não aparece.

## Tipografia (Google Fonts via @remotion/google-fonts)
- Archivo Black: legendas, títulos, texto nas caixas (64–84 px)
- Archivo 700/900: placas e rótulos de máquina, caixa alta, letter-spacing +2 (36–44 px)
- JetBrains Mono: IDs, números, porcentagens (40–56 px)

## Logo e assinatura da marca (arquivos em 01-marca/logo/)
- Símbolo: galpão com telhado em serra, "IA" na fachada e fumaça de caixas (tokens). Arquivo: simbolo.svg.
- Nome: FÁBRICA em Big Shoulders Stencil Display 900 (só para o nome; nada mais usa essa fonte), com a faixa zebrada preta e amarela embaixo e "IA POR DENTRO" em Archivo 900 espaçado.
- Faixa zebrada: listras a −45°, #111111 e #FFD84D, 34 px cada. É elemento de marca: aparece no topo e na base da tela final.
- Nos vídeos:
  - O PRIMEIRO frame NUNCA é o logo: é o gancho (retenção).
  - public/marca/selo-transparente.png (cópia de 01-marca/logo) pequeno (largura ~360 px) no canto superior esquerdo durante todo o vídeo, dentro da zona segura (x ≥ 40, y ≥ 260), com opacidade 0.9. Se colidir com algo do roteiro, mova para o canto superior direito (x ≤ 1080−140−largura).
  - Tela final: usar public/marca/fundo-tela-final.png (faixas zebradas no topo e na base) como fundo da Placa de Aviso, com o logo vertical pequeno acima do @.
- Nunca recolorir o símbolo, nunca esticar, nunca aplicar sombra além da sombra dura padrão.

## Formas
- Contorno 10 px #111111 em todo objeto.
- Cantos: caixas 20 px, máquinas 36 px, placas 40 px.
- Sombra dura: 20 px para baixo e direita, #111111, sem desfoque — só em placas e caixas em destaque.
- Ilustração plana. Sem degradê.

## Componentes reutilizáveis (crie em src/components e reuse sempre)
- PlacaDeArea: retângulo preto, texto amarelo, ex. "TOKENIZADOR" — topo da cena.
- CaixaToken: caixa branca com contorno e texto; ID em azul (JetBrains Mono) embaixo quando houver.
- Esteira: barra preta arredondada com roletes amarelos, base da cena.
- Maquina: bloco contornado, cor pelo papel, ícone de traço e placa com nome.
- Quadro: lista de 3 itens — "HOJE NA FÁBRICA" (promessa, após o gancho) e "RESUMO DO TURNO" (antes do fechamento).
- PlacaDeAviso: placa branca com sombra dura + faixa vermelha com o CTA.
- Legenda: palavra por palavra, máx. 4 palavras visíveis, palavra atual em #FF5A36 com leve pop.
- Episodio: esqueleto de todo episódio (narração, música, cenas mundo/hud, placas de setor, progresso, legenda). Cada epNN só passa cenas, tempo e trilha (ver src/ep02/Ep02.tsx).
- CenaEp / ABERTO / FECHADO: tipo de cena e planos de câmera. Carimbadora: prensa do ID.
- MapaSemantico (+ AnelMapa): quadro branco com palavras como pontos e rótulo em caixinha; posições animadas por quem usa.
- SetaVetor: seta preta grossa entre dois pontos (relações no mapa, eixos, "puxar").
- FitaDeNumeros: fita de decimais em azul que estica e rola para a direita (lista de um embedding).
- SeloMarca / Logo: logo real da empresa num selo branco. FichaArquivo: cartão do arquivo histórico (ano, título, logo). Predio: andares empilhados (camadas). TelaDividida: comparação lado a lado. FiosAtencao: fios de espessura variável entre caixas. Relogio, FundoReuniao.
- Bonequinho (personagem de traço, maleta, triste), FichaDocumento (processo/documento com rótulo, nome, número; `revela` para escrever), Carimbo (vermelho, bate no frame), Roleta (fatias azuis = probabilidade, vencedora verde; `giroPara` em src/ep04/Bloco04Escreve.tsx), FolhaDeProva (questões, ✓/✗, pontos em azul).
- CarroEsportivo (carro genérico de contorno com 10 bicos de jato, `giro` = mortal lateral, corte com tanques e ventoinhas), Velocimetro + Cronometro, CicloDeControle (MEDE → COMPARA → CORRIGE), PastaVazia. Manobra da rampa (caminho, pista que torce, salto e pouso): src/ep07/comum.tsx.
- Celular (+ AvatarTerno, que se desfaz em números), BalaoMensagem (chat genérico, sem logo), OndaDeSom (barras; reage à narração com src/ep08/envelope.json), Medidor, ImpressaoDigital, ContadorDinheiro, Visto (✓ verde / ✗ vermelho, `vira`). Som `toque` (celular) em scripts/sfx.py. MascoteArticulado (mascote com pernas/braços de contorno e juntas amarelas, encaixe peça por peça, aceno), BracoRobotico (+ poseParaAlvo/misturaPose para pegar coisas), FitaAcao (números de ação em grupos), MarcoTempo (linha do tempo).
- Calendario (+ rolaAno): folha de calendário com o ano em azul, fica no hud logo abaixo da placa de área; Balao: balão de conversa com rabinho (esq/dir). Teste de Turing, parede, caixa oculta, sol, flocos: src/ep05/comum.tsx.
- 3D (desde o ep11, pedido do user: "mais 3D sem perder a identidade"): src/components/Palco3D.tsx em CSS 3D — Palco3D (câmera rx/ry/zoom/foco/centra), No3D, Caixa3D (bloco com volume: frente branca com contorno, laterais pretas no lugar da sombra dura), Chao3D, Parede3D (cenário de traço ao fundo), Esteira3D (em segmentos: faces 3D muito compridas são cortadas pelo Chrome), PoeiraRuido. Cena 3D usa `esteira: false` no CenaEp. Palco pronto com recorte acima da legenda, `cameraPor` (chaves de câmera), Tela3D, QuadroFilme3D, Mesa3D, Cronometro90: src/ep11/comum.tsx. QuadroRuido aceita `cols` (20 = mais leve). Equipamentos da fábrica 3D (Maquina3D com medidor/engrenagem/prensa, Palete3D, EsteiraCorredor, VigaTeto, FaixaChao, BatenteZebrado): src/ep11/fabrica.tsx — o user quer o caminho da câmera cheio, "o mais parecido com uma fábrica possível".

## Movimento
1. Tudo anda da esquerda para a direita, como a esteira (voltar só na EXPEDIÇÃO).
2. Entradas com spring e leve overshoot.
3. Máquinas trabalham com tranco: descem rápido, sobem devagar.
4. Algo muda a cada 2–3 s; um objeto principal por vez.
5. Transição: a esteira acelera e leva tudo para fora pela direita (6–10 frames).
6. Cada estação tem um CENÁRIO próprio (src/components/Cenarios.tsx: Portaria, Galpão, Prateleiras, Prensa, Alerta, Saída, Mapa, Escritório) e a câmera corta entre planos abertos e fechados a cada 2–3 s (src/components/Camera.tsx, zoom máx. 1,2). Títulos, quadros e balões ficam na camada fixa (hud), sem zoom.
7. Barra de progresso do turno no topo (Progresso).

## Som (arquivos em public/sfx/ — se faltarem, siga sem som e avise)
- frame 0: cartao_ponto.mp3 (assinatura da marca, em TODO vídeo)
- caixa entra: tique.mp3 · corte: guilhotina.mp3 · carimbo: carimbo.mp3
- virada: sirene.mp3 (1 s) · fechamento: apito.mp3
- fundo: maquina_loop.mp3 em volume 0.05 + trilha public/musica.mp3 (scripts/musica.py) em 0.13
- trilha eletrônica mais presente (pedida no ep11, clima dos reels de tecnologia): scripts/musica_tech.py segundos public/musica-tech.mp3, `musica="musica-tech.mp3" musicaVolume={0.22}` no Episodio (~12 dB abaixo da voz)
- sons gerados por scripts/sfx.py (síntese própria, sem licença de terceiros); sirene 0.2 e apito 0.3 para não cobrir a voz
- narração: public/narracao-NN.mp3 (ep01 usa public/narracao.mp3); se não existir, renderize só com legendas e gere narracao.txt.

## Estrutura de todo vídeo
1. Gancho (0–3 s): primeiro frame já com movimento e texto.
2. Loop aberto (3–8 s): promessa de explicação até o fim.
3. Entrada na área (placa desce).
4. A máquina trabalha (mecanismo real).
5. Virada com sirene.
6. Fechamento padrão (últimos 4–5 s): narração "Turno encerrado." + apito + PlacaDeAviso:
   "Cansado de só colar prompt e não aprender nada?" / faixa vermelha: "SIGA A FÁBRICA. UMA PEÇA NOVA TODO DIA." (um assunto diferente por dia; nada de "episódio X de Y") / "@fabriqia"
   Últimos 1,5 s parados.

## Dados reais
Tokens e IDs mostrados na tela são gerados com o pacote npm `gpt-tokenizer` (`gpt-tokenizer/encoding/o200k_base`, tokenizador do GPT-4o). Nunca invente IDs. Se um roteiro trouxer um ID que não bate com o tokenizador, pare e avise.

## Entregáveis de cada vídeo (pasta out/epNN/)
- video.mp4 · capa.png (fundo amarelo + placa + frase de 3–5 palavras em Archivo Black) · legendas.srt · legenda_post.txt (2 linhas + CTA de comentário + 5 hashtags em português)
- Antes de entregar: renderize, extraia um frame do meio de cada cena com ffmpeg e confira: texto cortado, zona proibida, cores fora do significado, IDs errados. Corrija e só então entregue.

## Como pedir um vídeo
O usuário vai colar um roteiro (tabela Tempo · Narração · Na tela) e o número do episódio. Monte o vídeo seguindo este arquivo, reaproveitando os componentes.

## Roteiro (estratégia)
- Falar com o espectador ("você"), em tom de conversa: "pensa comigo", "olha o que acontece com uma pergunta sua", "lembra do...".
- Logo após o gancho: dizer o que a pessoa vai aprender (3 itens, quadro "HOJE NA FÁBRICA") + "fica até o fim".
- Aprofundar o mecanismo (por quê → problema → solução → exemplo real → virada) e dar uma dica prática que a pessoa possa usar.
- Antes do fechamento: resumo que responde os 3 itens da promessa (quadro "RESUMO DO TURNO") + CTA (seguir/salvar). Não prometer continuação de série.
- Narração: scripts/narrar.py (Edge TTS, pt-BR-AntonioNeural, +16%, pausa 0,45 s; +22% ficou rápido demais) quando não houver ElevenLabs; escrever "inteligência artificial", "tôuken", "tôukenizador", "Transfórmer", "Ôupenêiái" (OpenAI), "Álan Tiúring", "Élon Môsque" (Elon Musk) e "Espêis Ékis" (SpaceX) no texto da voz (04-video-NN/narracao-tts.txt).

## Capa (padrão fixo para todos os vídeos)
Modelo: `01-marca/capa/modelo-capa.html` (1080×1920). Troque só três campos:
- `__NUM__`: número do vídeo com 3 dígitos (001, 002…).
- `__TITULO__`: a ideia do vídeo em 4–7 palavras, sem ponto final. A palavra-chave vai dentro de `<em>…</em>` (fica em faixa preta). Máximo 3 linhas.
- `__VISUAL__`: o elemento principal do vídeo dentro da caixa branca, usando `<div class="cx">texto<small>ID</small></div>` para caixas-token. No máximo 3 elementos. Sem frases.
Tudo que importa fica entre y=240 e y=1680 (corte 3:4 da grade do perfil). Nada de texto fora disso. Renderize o elemento #capa com Playwright e salve como `out/epNN/capa.png`. Exemplo pronto: `01-marca/capa/capa-001.png`.

## Temas por trio (feed)
O feed alterna a cor principal a cada 3 vídeos, para formar linhas inteiras no perfil:
- O que conta é a POSIÇÃO DO POST no perfil (vídeos e carrosséis juntos), não o número do vídeo.
- Posts 1–3, 7–9, 13–15… → TEMA AMARELO (o padrão descrito acima).
- Posts 4–6, 10–12, 16–18… → TEMA PRETO.
Regra: tema preto se ((número do post − 1) ÷ 3) for ímpar, considerando só a parte inteira da divisão.
Sequência atual: post 1 = vídeo 01 · post 2 = vídeo 02 · post 3 = vídeo 03 · post 4 = vídeo 04 · post 5 = carrossel 01 · post 6 = vídeo 05 (deveria ser preto; foi produzido no amarelo em 2026-10-16) · post 7 = vídeo 06 (amarelo) · post 8 = vídeo 07 (amarelo) · post 9 = carrossel 02 · post 10 = vídeo 08 (preto) · post 11 = carrossel 03 · post 12 = vídeo 09 (preto) · posts 13–15 amarelos.

TEMA PRETO (troca de papéis, o resto do sistema não muda):
- Fundo: #111111.
- Texto solto (legendas, títulos): #FFFFFF; palavra destacada em faixa #FFD84D com texto #111111.
- Contornos dos objetos continuam #111111, mas todo objeto claro (caixas, máquinas, placas brancas) ganha sombra dura #FFD84D em vez de preta, para se destacar do fundo.
- Esteira: barra #FFD84D com roletes #111111.
- Placas de área: fundo #FFD84D, texto #111111.
- Faixa zebrada: listras #FFD84D e #111111.
- Selo FÁBRICA: fundo #FFD84D, símbolo e nome em #111111.
- Vermelho, azul e verde mantêm os mesmos significados. Azul sobre fundo preto só dentro de caixas brancas (contraste).
- Capa: usar `01-marca/capa/modelo-capa-preto.html` (mesmos campos do modelo amarelo).
- No código: `<Episodio tema={TEMA_PRETO}>` (src/components/Tema.tsx). O Episodio define variáveis CSS (--sombra, --tinta, --traco, --esteira, --placa...) que SOMBRA, Esteira, PlacaDeArea, Legenda, Progresso, Roleta e Cenários já leem; texto solto novo deve usar `var(--tinta)` ou `useTema()`. Exemplo: src/ep08.

## Duração e retenção (a partir do vídeo 05)
- Padrão: até 45 segundos. Quando o roteiro pedir, até 90 segundos (o roteiro informa a duração). Nunca passar de 90 s.
- A surpresa do gancho vem na primeira frase (0–3 s). O primeiro frame já mostra o objeto do gancho em movimento; nunca logo, título ou contexto antes.
- Algo muda na tela a cada 1,5–2 s.
- Fechamento curto: "Siga a fábrica. Uma peça nova todo dia." (sem "Turno encerrado." quando o tempo apertar).
