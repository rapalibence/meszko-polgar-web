"""tmp/frames-png/*.png -> public/frames/lg/*.webp (1280w) and public/frames/sm/*.webp (720w)."""
import glob, os
from PIL import Image
os.makedirs('public/frames/lg', exist_ok=True); os.makedirs('public/frames/sm', exist_ok=True)
files = sorted(glob.glob('tmp/frames-png/*.png'))
total = 0
for f in files:
    im = Image.open(f).convert('RGB'); name = os.path.basename(f)[:-4]
    lg = im.resize((1280, int(1280 * im.height / im.width)), Image.LANCZOS); lg.save(f'public/frames/lg/{name}.webp', quality=72, method=6)
    sm = im.resize((720, int(720 * im.height / im.width)), Image.LANCZOS); sm.save(f'public/frames/sm/{name}.webp', quality=68, method=6)
    total += os.path.getsize(f'public/frames/lg/{name}.webp') + os.path.getsize(f'public/frames/sm/{name}.webp')
print(f'{len(files)} frames, {total/1024/1024:.1f} MB total (lg+sm)')
