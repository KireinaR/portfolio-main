from PIL import Image, ImageOps

img = Image.open('wanderer_src.jpg').convert('L')
img = ImageOps.autocontrast(img, cutoff=2)
# gentle gamma to deepen the darks (make the silhouette read)
img = img.point(lambda v: int((v / 255) ** 1.15 * 255))
W, H = img.size

cols = 100
# rows tuned so that with CSS line-height ~1.1 the block matches the
# painting's portrait proportion (W/H ~ 0.78)
rows = max(1, int(cols * (H / W) * 0.55))
small = img.resize((cols, rows))
px = small.load()

# density ramp: index 0 = space (dark) -> last = dense/bright glyph
ramp = " .'`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@"
n = len(ramp)


def esc(ch):
    return {"&": "&amp;", "<": "&lt;", ">": "&gt;"}.get(ch, ch)


raw_lines, html_lines = [], []
for y in range(rows):
    raw, htm = [], []
    for x in range(cols):
        c = ramp[int(px[x, y] / 255 * (n - 1))]
        raw.append(c)
        htm.append(esc(c))
    raw_lines.append("".join(raw))
    html_lines.append("".join(htm))

with open('wanderer_ascii.txt', 'w', encoding='utf-8') as f:
    f.write("\n".join(raw_lines))
with open('wanderer_ascii.html', 'w', encoding='utf-8') as f:
    f.write("\n".join(html_lines))

print('cols', cols, 'rows', rows)
print("\n".join(raw_lines))
