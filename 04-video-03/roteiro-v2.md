# Ep03 v2 — o Transformer, no formato do ep01/ep02

O gancho abre com o tópico 2 da promessa (o artigo de 2017, título tarjado até o bloco 5), a pedido do user.
Reescrito a partir de `roteiro.md` no formato aprovado (promessa, aprofundamento, dica prática, resumo, fechamento "todo dia", sem "pra"/"Segue").
Ajustes de precisão: "oito pesquisadores, a maioria do Google" (Aidan Gomez era estagiário vindo de Toronto); "todos os oito acabaram saindo do Google" (sem "para outras empresas de IA": Polosukhin fundou a NEAR; Shazeer voltou ao Google em 2024).
Logos reais (simple-icons) quando Google, OpenAI, ChatGPT, Claude e Gemini aparecem, a pedido do user. Claude e Gemini ficam só na tela: a voz do Edge TTS não pronuncia bem esses nomes.

1. GANCHO — Em 2017, oito pesquisadores publicaram um artigo que mudou a IA. O ChatGPT que você usa hoje nasceu dessa ideia. E o curioso é que ela foi inventada no Google, e não na OpenAI.

2. PROMESSA — Neste vídeo, você vai entender três coisas. Primeiro: o que significa cada letra do GPT. Segundo: a invenção de 2017 que mudou a IA. Terceiro: um cuidado prático com textos longos. Acompanhe até o final.

3. A SIGLA — GPT é uma sigla em inglês. O G vem de generativo, porque gera texto. O P vem de pré-treinado, porque leu uma quantidade enorme de texto antes. E o T vem de Transformer, a peça que mudou tudo.

4. ANTES: A FILA — Antes de 2017, a IA lia uma palavra de cada vez, em fila. Imagine ler um livro guardando só um resumo curto de tudo que veio antes. Era lento. E, em textos longos, quando chegava ao fim, o começo já tinha se perdido.

5. 2017: ATENÇÃO — Foi aí que entrou o artigo de 2017. O título era "Atenção é tudo de que você precisa". A ideia foi parar de ler em fila. O Transformer lê a frase inteira de uma vez, e cada palavra olha para todas as outras. Na frase "o gato fugiu porque ele estava com medo", a palavra "ele" olha para todas e descobre que se refere ao gato. Esse olhar se chama atenção.

6. POR QUE FOI GRANDE — Por que isso foi tão importante? Sem a fila, as contas podem ser feitas todas ao mesmo tempo, e a placa de vídeo é feita justamente para isso. Treinar ficou muito mais rápido, com muito mais texto.

7. POR DENTRO — Por dentro, o Transformer repete duas etapas. Primeiro, cada palavra junta o contexto das outras: é assim que "ele" passa a saber que é o gato. Depois, todas as palavras consultam, ao mesmo tempo, o que a IA aprendeu no treino. Por exemplo: gato é um animal que foge quando tem medo. Essas duas etapas formam uma camada, e cada camada entende a frase um pouco melhor. O GPT-3 tinha 96 camadas.

8. A IRONIA (virada) — Agora, a ironia. O Google inventou o Transformer, mas quem lançou o primeiro GPT, em 2018, foi a OpenAI. E todos os oito autores do artigo acabaram saindo do Google. Hoje, o ChatGPT e os concorrentes dele usam a mesma ideia por baixo.

9. A DICA — Agora, o cuidado prático. Em textos muito longos, a IA costuma aproveitar melhor o começo e o fim do que o meio. Um estudo de 2023 mostrou isso. Então, quando mandar um texto grande, coloque o seu pedido no começo e repita no final.

10. RESUMO — Resumindo: GPT é um Transformer generativo pré-treinado. O Transformer lê tudo de uma vez e usa a atenção para ligar as palavras. E, em textos longos, o seu pedido vai no começo e no final.

11. FECHAMENTO — Turno encerrado. Para entender a IA por dentro, siga a página. A fábrica abre todo dia.

Narração: Edge TTS pt-BR-AntonioNeural +16%, pausa 0,45 s, loudnorm −16 → `public/narracao-03.mp3` (177,7 s; vídeo 179,2 s). Texto da voz em `narracao-tts.txt` ("Transfórmer").

## Dados
- "Attention Is All You Need", Vaswani et al., 12/06/2017, 8 autores.
- Primeiro GPT (OpenAI): junho de 2018. GPT-3 175B: 96 camadas (Brown et al., 2020).
- "Lost in the Middle: How Language Models Use Long Contexts", Liu et al. (Stanford e outros), 2023.
- "Por dentro" reescrito a pedido do user: etapa 1 = juntar contexto ("ele" passa a saber que é o gato); etapa 2 = consultar o que aprendeu no treino (a camada feed-forward, que pesquisas descrevem como memória do modelo), todas as palavras ao mesmo tempo.
- O peso dos fios de atenção de "ele" é ilustrativo.
