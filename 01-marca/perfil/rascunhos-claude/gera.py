"""Gera opções de foto de perfil da @fabriqcurio a partir do mascote da Fábrica.
Uso: python gera.py  (salva SVG + PNG 1080 e uma prévia em círculo)"""
import math, pathlib, asyncio
from playwright.async_api import async_playwright

AQUI = pathlib.Path(__file__).parent
import base64
FONTE = 'data:font/woff2;base64,' + base64.b64encode((AQUI / '../../../pagina-ia/01-marca/capa/fonts/archivo-black-latin-400-normal.woff2').resolve().read_bytes()).decode()
AM, PR, AZ, BR, VD = '#FFD84D', '#111', '#2F6BFF', '#fff', '#22B573'
# identidade @fabriqcurio: azul claro, azul escuro, branco e escuro
AC, AE, ES = '#7CC6FE', '#0B3D6E', '#0B1320'

def engrenagem(cx, cy, r, dentes, prof, cor, contorno, furo=None, fase=0):
    pts = []
    n = dentes * 4
    for i in range(n):
        a = fase + 2 * math.pi * i / n
        rr = r + (prof if (i % 4) in (1, 2) else 0)
        pts.append(f'{cx + rr * math.cos(a):.1f},{cy + rr * math.sin(a):.1f}')
    s = f'<polygon points="{" ".join(pts)}" fill="{cor}" stroke="{contorno}" stroke-width="7" stroke-linejoin="round"/>'
    if furo:
        s += f'<circle cx="{cx}" cy="{cy}" r="{r*0.36:.1f}" fill="{furo}" stroke="{contorno}" stroke-width="7"/>'
    return s

def visor_engrenagens():
    return (engrenagem(468, 548, 52, 9, 16, AM, PR, AZ) +
            engrenagem(604, 586, 34, 7, 13, BR, PR, AZ, fase=0.3))

def visor_lupa(aro=AM, miolo=AZ, fundo=PR):
    return (f'<line x1="566" y1="602" x2="640" y2="646" stroke="{aro}" stroke-width="26" stroke-linecap="round"/>'
            f'<circle cx="512" cy="548" r="78" fill="{fundo}" stroke="{aro}" stroke-width="18"/>' +
            engrenagem(512, 548, 34, 8, 12, BR, fundo, miolo))

def visor_interrogacao():
    return (f'<text x="530" y="628" text-anchor="middle" font-family="AB" font-size="200" fill="{BR}" '
            f'stroke="{AM}" stroke-width="6" paint-order="stroke">?</text>'
            f'<circle cx="530" cy="612" r="0" fill="{AZ}"/>')

def mascote(visor, fundo=AM, roletes=AM, tinta=PR, sombra=None, esteira=None):
    sombra = sombra or tinta
    esteira = esteira or tinta
    corpo = (f'<rect x="320" y="440" width="500" height="400" rx="66" fill="{sombra}"/>'
             f'<rect x="280" y="400" width="500" height="400" rx="66" fill="{BR}" stroke="{tinta}" stroke-width="32"/>'
             f'<rect x="336" y="446" width="388" height="215" rx="40" fill="{tinta}"/>' + visor +
             f'<circle cx="430" cy="728" r="36" fill="{tinta}"/><circle cx="630" cy="728" r="36" fill="{tinta}"/>'
             f'<rect x="190" y="870" width="720" height="62" rx="31" fill="{esteira}"/>' +
             ''.join(f'<circle cx="{x}" cy="901" r="13" fill="{roletes}"/>' for x in (250, 370, 490, 610, 730, 850)))
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">'
            f'<defs><style>@font-face{{font-family:AB;src:url({FONTE})}}</style></defs>'
            f'<rect width="1080" height="1080" fill="{fundo}"/>'
            f'<g transform="translate(540 545) scale(1.12) translate(-550 -666)">{corpo}</g></svg>')

OPCOES = {
    # fundo azul claro, traço escuro, lupa azul clara no visor escuro
    'E-fundo-azul-claro': mascote(visor_lupa(aro=AC, miolo=AE, fundo=ES), fundo=AC, roletes=AC, tinta=ES),
    # fundo azul escuro, traço escuro, detalhes em azul claro
    'F-fundo-azul-escuro': mascote(visor_lupa(aro=AC, miolo=AE, fundo=ES), fundo=AE, roletes=AC, tinta=ES),
    # fundo escuro, sombra azul clara no lugar da preta
    'G-fundo-escuro': mascote(visor_lupa(aro=AC, miolo=AE, fundo=ES), fundo=ES, roletes=ES, tinta=ES, sombra=AC, esteira=AC),
}

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe')
        pg = await b.new_page(viewport={'width': 1080, 'height': 1080})
        for nome, svg in OPCOES.items():
            (AQUI / f'{nome}.svg').write_text(svg, encoding='utf-8')
            await pg.set_content(f'<html><body style="margin:0">{svg}</body></html>')
            await pg.evaluate('document.fonts.ready')
            await pg.wait_for_timeout(300)
            await pg.screenshot(path=str(AQUI / f'{nome}.png'))
        await b.close()

asyncio.run(main())

from PIL import Image, ImageDraw
def circulo(p, t):
    a = Image.open(p).convert('RGB').resize((t, t), Image.LANCZOS)
    m = Image.new('L', (t, t), 0); ImageDraw.Draw(m).ellipse((0, 0, t, t), fill=255)
    return a, m
W = 340
im = Image.new('RGB', (len(OPCOES) * W + 20, 420), (238, 238, 238))
for i, n in enumerate(OPCOES):
    a, m = circulo(AQUI / f'{n}.png', 300); im.paste(a, (20 + i * W, 20), m)
    a, m = circulo(AQUI / f'{n}.png', 64); im.paste(a, (20 + i * W + 118, 335), m)
im.save(AQUI / 'previa.png')
print('ok')
