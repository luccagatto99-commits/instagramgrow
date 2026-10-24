# 17 · A IA que achou as falhas do PHP (PHP2Shell)

Pedido do user em 2026-10-22 a partir do reel do @odanilogato (instagram.com/reel/Dex3p5uANn1). Tema PRETO (post 22). Capa Nº 016 (numeração do planejamento do user: o "vídeo 15" dele foi o nosso ep16).

## Fatos conferidos (22/10/2026)
- CVE-2026-109618 e CVE-2026-109619 ("PHP2Shell"), execução remota de código sem autenticação; nota oficial 9,2 (o vazamento falava em 10). Correção em 21/10: PHP 8.5.12, 8.4.27, 8.3.36 e 8.2.35. (Tenable, CSO Online, CERT-EU)
- Achadas por Calif com GPT-5.6 Sol (programa Patch the Planet da OpenAI) e, de forma independente, pela Wiz (com IA). (CSO Online, cellcog/OpenAI)
- Uma delas: o PHP aborta o pedido que passa do memory_limit no meio (longjmp) e deixa dados meio inicializados; a outra é use-after-free.
- PHP: ~70% dos sites com linguagem conhecida (W3Techs, ago/2026).
- NSA, NCSC do Reino Unido e CERT-EU: atualizar ou tirar do ar. CISA/FBI NÃO confirmados → não citados.
- Holanda: NCSC (o próprio site), Tweede Kamer, Porto de Roterdã, DigiD etc. Finlândia (Valtori), França (prefeituras), Dinamarca (Kombit) tiraram sites do ar. Canadá NÃO confirmado → não citado.
