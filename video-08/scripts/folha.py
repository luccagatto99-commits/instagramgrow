# junta quadros de uma pasta numa folha: python scripts/folha.py pasta colunas
import sys, glob
from PIL import Image
pasta, cols = sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 4
fs = sorted(glob.glob(pasta + '/t*.jpg'), key=lambda f: float(f.split('t')[-1][:-4].replace('_', '.')))
for k in range(0, len(fs), cols):
    im = Image.new('RGB', (cols * 360, 640))
    for i, f in enumerate(fs[k:k + cols]):
        im.paste(Image.open(f).resize((360, 640)), (i * 360, 0))
    im.save(f'{pasta}/folha{k // cols}.jpg', quality=85)
print(len(fs))
