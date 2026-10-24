"""Gera a narração com Edge TTS, um parágrafo por vez, e junta com pausas curtas.
Uso: python scripts/narrar.py texto.txt saida.mp3 pasta_temp [voz] [taxa] [pausa_s]
"""
import sys, asyncio, subprocess, os, edge_tts

txt, saida, tmp = sys.argv[1:4]
voz = sys.argv[4] if len(sys.argv) > 4 else 'pt-BR-AntonioNeural'
taxa = sys.argv[5] if len(sys.argv) > 5 else '+10%'
PAUSA = float(sys.argv[6]) if len(sys.argv) > 6 else 0.35
paras = [p.strip() for p in open(txt, encoding='utf-8').read().split('\n\n') if p.strip()]

async def main():
    for i, p in enumerate(paras):
        await edge_tts.Communicate(p, voz, rate=taxa).save(os.path.join(tmp, f'p{i:02d}.mp3'))
asyncio.run(main())

# normaliza cada trecho para wav e intercala silêncio
lista = []
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', f'anullsrc=r=44100:cl=mono', '-t', str(PAUSA), os.path.join(tmp, 'pausa.wav')], check=True)
for i in range(len(paras)):
    w = os.path.join(tmp, f'p{i:02d}.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(tmp, f'p{i:02d}.mp3'), '-ar', '44100', '-ac', '1', w], check=True)
    lista += [w, os.path.join(tmp, 'pausa.wav')]
with open(os.path.join(tmp, 'lista.txt'), 'w') as f:
    f.write(''.join(f"file '{os.path.abspath(x)}'\n" for x in lista[:-1]))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', os.path.join(tmp, 'lista.txt'), '-b:a', '192k', saida], check=True)
print(len(paras), 'paragrafos ->', saida)
