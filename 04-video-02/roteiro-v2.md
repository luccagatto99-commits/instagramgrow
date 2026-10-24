# Ep02 v2 — embeddings, no formato do ep01 v5

Reescrito a partir de `roteiro.md` com o que foi aprovado no ep01: falar com "você", promessa de 3 itens, aprofundamento, dica prática, resumo, fechamento "todo dia", sem selos REAL/ILUSTRATIVO, sem "pra"/gíria. A simplificação do mapa 2D é dita na narração (bloco 5) no lugar do selo.

1. GANCHO — Para a IA, a palavra cachorro é um número perto de 169 mil. Gato, perto de 100 mil. São números bem distantes. Então como ela sabe que os dois são parecidos?

2. PROMESSA — Neste vídeo, você vai entender três coisas. Primeiro: por que o número de uma palavra não diz o que ela significa. Segundo: o que é um embedding. Terceiro: como ela entende você quando você usa outras palavras. Acompanhe até o final.

3. ETIQUETA — Cada pedaço de texto recebe um número fixo, como um código de barras. Só que esse número é apenas uma etiqueta. Pense no CPF: dois CPFs quase iguais não são de pessoas parecidas. O número sozinho não diz nada sobre o significado.

4. A LISTA — Então a IA faz uma segunda coisa. A etiqueta busca, numa tabela enorme, uma lista de outros números. Essa lista funciona como um endereço num mapa. Para localizar uma cidade, bastam dois números: latitude e longitude. Uma palavra tem milhares. No GPT-3, eram 12.288 números para cada token. Essa lista se chama embedding.

5. O MAPA — Nesse mapa, palavras com significado parecido ficam perto umas das outras. Cachorro fica ao lado de gato. Geladeira fica longe, do outro lado. Na tela, o mapa tem só duas direções. O de verdade tem milhares.

6. O TREINO — Mas quem colocou cada palavra no lugar? Ninguém. No começo, os números são sorteados, e o mapa é uma bagunça. No treino, ela lê bilhões de frases. Palavras que aparecem nas mesmas frases vão sendo puxadas para perto. Levei o cachorro para passear. Levei o gato para passear. Ninguém leva a geladeira para passear.

7. A VIRADA — E o mapa guarda até relações. Em 2013, pesquisadores do Google fizeram uma conta. Pegaram rei, tiraram homem e somaram mulher. A palavra mais próxima do resultado foi rainha. Ninguém ensinou isso. Saiu da organização do mapa.

8. POR QUE IMPORTA — Por isso, ela entende você mesmo quando você usa outras palavras. "Como cuidar de um filhote?" e "Dicas para um cachorro novo" são frases diferentes, mas caem na mesma região do mapa. Ela não compara letras. Ela compara posições.

9. A DICA — Uma dica prática: Palavras com dois sentidos, como manga, ficam num lugar entre a fruta e a roupa. São as palavras ao redor que puxam o sentido para um lado. Então, quando houver dúvida, dê contexto. Escreva "manga, a fruta", e não só "manga".

10. RESUMO — Resumindo: o número de cada token é só uma etiqueta. O embedding é uma lista de números que dá a cada palavra um lugar num mapa de significados. E ela entende outras palavras porque compara posições, não letras.

11. FECHAMENTO — Turno encerrado. Para entender a IA por dentro, siga a página. A fábrica abre todo dia.

Narração: Edge TTS pt-BR-AntonioNeural +16%, pausa 0,45 s, loudnorm −16 → `public/narracao-02.mp3` (176,7 s; vídeo 178,2 s). Texto da voz em `narracao-tts.txt`.

## Dados validados (o200k_base, conferidos no render por src/ep02/dados.ts)

| Texto | Tokens | IDs |
| --- | --- | --- |
| ␣cachorro | 1 token | 168983 |
| ␣gato | 1 token | 99767 |
| ␣geladeira | ␣gel · adeira | 8063 · 83302 |
| ␣manga | 1 token | 53844 |

- 12.288 números por token: GPT-3 175B (d_model), "Language Models are Few-Shot Learners", 2020.
- rei − homem + mulher ≈ rainha: word2vec, Mikolov et al., Google, 2013.
- Precisão: o vídeo mostra o embedding de entrada. Dentro do modelo, a lista é ajustada pelo contexto (o "puxar o sentido" do bloco 9); assunto de outro dia.

## Legenda do post

Para a inteligência artificial, cada palavra é um lugar num mapa. Palavras parecidas ficam perto, e foi o treino que organizou tudo.
Comente uma palavra que tem dois sentidos, como manga. A melhor vira exemplo num próximo vídeo.

#inteligenciaartificial #chatgpt #embeddings #comofunciona #ia
