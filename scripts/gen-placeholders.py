"""Procedural placeholder imagery in the site palette. Replace with client photos later."""
import math, random
from PIL import Image, ImageDraw, ImageFilter

W, H = 1200, 900
BG = (29, 27, 24)
random.seed(7)

def noise_layer(w, h, alpha=18):
    n = Image.effect_noise((w, h), 48).convert("L")
    return n.point(lambda v: int(v * alpha / 255))

def gravel(path, size_px, count, seed):
    rnd = random.Random(seed)
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    for _ in range(count):
        cx, cy = rnd.uniform(-size_px, W + size_px), rnd.uniform(-size_px, H + size_px)
        r = size_px * rnd.uniform(0.55, 1.0)
        k = rnd.randint(5, 8)
        pts = []
        for i in range(k):
            a = 2 * math.pi * i / k + rnd.uniform(-0.25, 0.25)
            rr = r * rnd.uniform(0.7, 1.0)
            pts.append((cx + math.cos(a) * rr, cy + math.sin(a) * rr * rnd.uniform(0.75, 1.0)))
        g = rnd.randint(78, 150)
        warm = (g + 6, g + 2, g - 6)
        shade = tuple(max(0, c - rnd.randint(18, 40)) for c in warm)
        d.polygon(pts, fill=warm, outline=shade)
        # a lit facet
        fx = [(x + r * 0.12, y - r * 0.12) for x, y in pts[: max(3, k // 2)]]
        if len(fx) >= 3:
            d.polygon(fx, fill=tuple(min(255, c + 14) for c in warm))
    img = img.filter(ImageFilter.GaussianBlur(0.4))
    n = noise_layer(W, H, 22)
    img = Image.composite(Image.new("RGB", (W, H), (70, 66, 60)), img, n)
    img.save(path, quality=80, optimize=True)

def strata(path, seed):
    rnd = random.Random(seed)
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    y = 0
    while y < H:
        h = rnd.randint(28, 110)
        g = rnd.randint(70, 135)
        col = (g + 8, g + 3, g - 6)
        pts = [(0, y)] + [(x, y + rnd.uniform(-6, 6)) for x in range(0, W + 1, 60)] + [(W, y + h), (0, y + h)]
        d.polygon(pts, fill=col)
        d.line([(0, y + h), (W, y + h)], fill=tuple(max(0, c - 30) for c in col), width=2)
        y += h
    img = img.filter(ImageFilter.GaussianBlur(0.6))
    n = noise_layer(W, H, 26)
    img = Image.composite(Image.new("RGB", (W, H), (60, 56, 50)), img, n)
    img.save(path, quality=80, optimize=True)

def contours(path, seed, w=900, h=1200):
    rnd = random.Random(seed)
    img = Image.new("RGB", (w, h), (24, 22, 20))
    d = ImageDraw.Draw(img)
    cx, cy = w * 0.55, h * 0.5
    for i in range(1, 16):
        r = i * 48
        pts = []
        for a in range(0, 360, 4):
            t = math.radians(a)
            rr = r * (1 + 0.12 * math.sin(3 * t + i) + 0.06 * math.cos(5 * t - i * 0.7))
            pts.append((cx + math.cos(t) * rr, cy + math.sin(t) * rr * 0.85))
        g = 150 - i * 5
        d.line(pts + [pts[0]], fill=(g, g - 4, g - 10), width=2 if i % 5 else 3)
    n = noise_layer(w, h, 20)
    img = Image.composite(Image.new("RGB", (w, h), (60, 56, 50)), img, n)
    img.save(path, quality=80, optimize=True)

gravel("public/img/gravel-0-4.jpg", 7, 32000, 1)
gravel("public/img/gravel-4-8.jpg", 12, 13000, 2)
gravel("public/img/gravel-8-16.jpg", 20, 5200, 3)
gravel("public/img/gravel-16-32.jpg", 34, 2000, 4)
gravel("public/img/gravel-0-32.jpg", 22, 4200, 5)
gravel("public/img/boulders.jpg", 110, 260, 6)
strata("public/img/strata.jpg", 8)
contours("public/img/contours.jpg", 9)
print("ok")
