# Vídeo 10 · Como a IA cria uma imagem do zero (difusão)

- **Duração estimada:** cerca de 86 s (máximo 90).
- **Tema:** AMARELO (post 13 do feed; abre a linha amarela 13–15).
- **Vídeo independente.**
- **Capa:** Nº 010 · "COMO A IA CRIA UMA IMAGEM" · "DO ZERO" em bloco preto inclinado · "ela não desenha. ela limpa" · três quadros: pontos aleatórios → meio limpo → paisagem. Arquivo pronto: `capa.png`.

## Estratégia

- Volta à parte técnica com o "uau" visual que fez o GTA e o Elon Musk funcionarem: **ver uma imagem surgir de pontos aleatórios na tela**.
- Gancho direto em forma de pergunta ("Sabe como a IA cria uma imagem?") e resposta surpreendente logo em seguida ("ela não desenha nada").
- Uma analogia só, fácil de lembrar: o escultor que tira pedra até aparecer a estátua.
- Exemplo único do começo ao fim: "um cachorro na praia".

## Técnicas de retenção

| Técnica | Onde |
| --- | --- |
| Pergunta direta + resposta que contraria o esperado ("não desenha") | Bloco 1 |
| Analogia visual simples (escultor) | Bloco 1 |
| Pergunta que abre o resto do vídeo ("como ela sabe o que tirar?") | Bloco 2 |
| Processo visual satisfatório (estragar → limpar) | Blocos 3–4 |
| A imagem nascendo na tela, perto do meio do vídeo | Bloco 5 |
| Explica algo que o público já notou (mãos erradas) | Bloco 6 |
| Desmente o mito "a IA copia fotos" na frase final | Bloco 7 |

## Dados reais (conferidos)

- **Difusão (como funciona):** no treino, ruído é adicionado a imagens em vários passos até virarem ruído puro; o modelo aprende a prever e remover o ruído de cada passo. Para gerar, começa de ruído aleatório e remove ruído passo a passo, guiado pelo texto convertido em números (embeddings). É a técnica de geradores como o Stable Diffusion. ([KDnuggets](https://www.kdnuggets.com/diffusion-and-denoising-explaining-text-to-image-generative-ai))
- **Precisão:** a narração fala do processo de difusão em geral, sem citar marcas. "Mãos erradas" é explicação simplificada: o modelo aprende padrões de pixels, não a estrutura de uma mão.

| Bloco | Tempo est. | Narração (resumo) | Na tela | Som |
| --- | --- | --- | --- | --- |
| 1 · Gancho | 0–15 s | Sabe como a IA cria uma imagem? Ela não desenha. Começa com pontos aleatórios e tira tudo o que não faz parte da imagem, como um escultor tirando pedra. | Frame 0 já em movimento: um quadro cheio de pontos aleatórios piscando. Em "não desenha nada", um lápis aparece e é riscado. Em "vai tirando", os pontos começam a sumir e surge a forma de um cachorro. Em "escultor", tela dividida: um bloco de pedra perdendo pedaços até virar uma estátua simples de contorno, ao lado do quadro limpando no mesmo ritmo. | cartão de ponto, chiado, ✗, cinzel |
| 2 · A pergunta | 15–20 s | Como ela sabe o que tirar? Isso vem do treino. | Um **?** vermelho grande sobre o quadro. Placa **CONTROLE DE QUALIDADE** desce (com "treino" menor). | tranco |
| 3 · Estragar a foto | 20–32 s | Engenheiros pegam milhões de fotos com descrição, como "um cachorro na praia", e estragam cada uma aos poucos com pontos aleatórios até sumir. | Uma foto desenhada (cachorro de contorno + sol + mar) com etiqueta **"um cachorro na praia"**. Uma máquina **ESTRAGADORA** passa 5 vezes; contador **passo 1 → 5**; a foto vai sumindo até só sobrar pontos. Contador **milhões de fotos** no canto. | 5 chiados |
| 4 · Aprender o contrário | 32–45 s | A IA treina fazendo o contrário: recebe a foto estragada e adivinha quais pontos foram colocados. Erra, corrige, repete milhões de vezes. | A esteira anda ao contrário. A IA (mascote) olha a foto estragada e marca os pontos que acha que foram colocados. Primeiro ✗ vermelho (errou), depois ✓ verde. O ciclo ✗ → ✓ acelera com contador **repetições** subindo. | ✗, ✓, tiques acelerando |
| 5 · Criando do zero | 45–64 s | Ao pedir uma imagem, ela começa de pontos aleatórios. O texto vira números e guia cada passo: a cada rodada tira o que não parece cachorro nem praia. Em dezenas de rodadas, surge uma foto que nunca existiu. | Caixa de texto **"um cachorro na praia"** vira caixas com IDs azuis (CARIMBADORA). As caixas viram setas que apontam para um quadro novo, só de pontos, com etiqueta **NENHUMA FOTO AQUI**. O quadro limpa em ~8 etapas visíveis (contador **rodada 1 … 30**); as palavras "cachorro" e "praia" acendem quando a forma correspondente aparece. Imagem final nítida com selo ILUSTRATIVO. | tiques acelerando, ding final |
| 6 · As mãos | 64–75 s | Por isso as primeiras IAs erravam as mãos: não sabem o que é uma mão, só como os pontos de uma mão costumam ficar. | Uma mão de contorno se formando dos pontos com **6 dedos**; contador vermelho conta 1…6. Zoom: setas ligando pontos vizinhos com rótulo **"costuma ficar perto"**. | tiques, buzina curta |
| 7 · Frase final | 75–82 s | A IA não copia fotos da internet. Parte do nada e vai limpando até parecer real. | Uma pilha de fotos com tesoura aparece e é riscada (**não copia**). O quadro final volta a ser pontos por meio segundo e se limpa de novo. Frase palavra por palavra. | silêncio, tique final |
| 8 · Fechamento | 82–86 s | Siga a fábrica. Uma peça nova todo dia. | Esteira acelera e leva tudo para a direita. Placa de aviso + selo FÁBRICA. Últimos 1,5 s parados. | apito |

**Regras:** sem logos de geradores de imagem; os pontos aleatórios podem usar tons de cinza (exceção: são o "material" da cena); imagens geradas usam só a paleta da marca. Animações de difusão levam ILUSTRATIVO.

## Legenda do post

A IA não desenha suas imagens. Ela limpa.

Siga a fábrica. Uma peça nova todo dia.

#inteligenciaartificial #ia #chatgpt
