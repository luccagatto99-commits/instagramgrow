# Dicas para gerar a narração no ElevenLabs

1. **Cole o texto inteiro de `narracao-elevenlabs.txt` de uma vez.** Gerar em uma única peça mantém o mesmo tom do começo ao fim. As quebras de parágrafo viram pausas, e é por essas pausas que o Claude Code sincroniza as cenas.
2. **Voz:** escolha uma voz masculina ou feminina em português do Brasil, grave e calma, e **use sempre a mesma** em todos os vídeos. A voz faz parte da marca, como o som do cartão de ponto.
3. **Modelo:** um modelo multilíngue que fale português do Brasil.
4. **Ajustes para começar** (teste e ajuste ao seu gosto):
   - Estabilidade: entre 45% e 55%. Mais baixo deixa a voz mais expressiva e menos previsível.
   - Similaridade: cerca de 75%.
   - Estilo/exagero: baixo, entre 0% e 15%.
5. **Pronúncia:** os números já estão escritos por extenso e "GPT-4o" está como "GPT quatro ó", para a voz não errar. Se ela pronunciar "token" de um jeito estranho, troque por "tôquen" só no texto da narração.
6. **Pausas curtas demais entre parágrafos?** Acrescente "..." no fim do parágrafo. Se o seu modelo aceitar marcação de pausa, use `<break time="0.6s" />` entre os blocos.
7. **Exportação:** MP3, 44,1 kHz. Salve como `public/narracao.mp3` dentro da pasta do projeto do Claude Code.
8. **Ritmo:** a duração ideal deste vídeo é de 1 min 50 s a 2 min 05 s. Se passar disso, aumente levemente a velocidade da voz em vez de cortar texto.
