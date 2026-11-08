"""Extract chapter figures: image files + captions + vector labels/leaders/arrows in image-relative coords."""
import pymupdf, sys, os, json, re
pdf, out = sys.argv[1], sys.argv[2]
os.makedirs(os.path.join(out, 'fig'), exist_ok=True)
d = pymupdf.open(pdf)
FIGS = []
def inside(b, r, pad=2):
    cx, cy = (b[0]+b[2])/2, (b[1]+b[3])/2
    return r[0]-pad <= cx <= r[2]+pad and r[1]-pad <= cy <= r[3]+pad
for pno in range(599, 661):
    pg = d[pno]; book = pno - 11
    infos = [i for i in pg.get_image_info(xrefs=True) if (i['bbox'][2]-i['bbox'][0]) > 40 and (i['bbox'][3]-i['bbox'][1]) > 40]
    if book == 588: continue
    # merge horizontally adjacent slices (some figures are split into strips)
    groups = []
    for i in sorted(infos, key=lambda i:(round(i['bbox'][1]), i['bbox'][0])):
        b = list(i['bbox'])
        for g in groups:
            gb = g['bbox']
            if abs(gb[1]-b[1]) < 3 and abs(gb[3]-b[3]) < 3 and 0 <= b[0]-gb[2] < 3:   # strip continues to the right
                g['bbox'][2] = b[2]; g['parts'].append(i); break
            if abs(gb[0]-b[0]) < 3 and abs(gb[2]-b[2]) < 3 and 0 <= b[1]-gb[3] < 3:   # strip continues below
                g['bbox'][3] = b[3]; g['parts'].append(i); break
        else: groups.append({'bbox': b, 'parts':[i]})
    dct = pg.get_text('dict'); spans = []
    for bl in dct['blocks']:
        for ln in bl.get('lines', []):
            for sp in ln['spans']:
                t = sp['text'].strip()
                if t: spans.append({'t': t, 'b': sp['bbox'], 'size': sp['size'], 'color': sp['color']})
    blocks = [b for b in pg.get_text('blocks') if b[4].strip()]
    draws = pg.get_drawings()
    for k, g in enumerate(groups):
        r = g['bbox']; W, H = r[2]-r[0], r[3]-r[1]
        clip = pymupdf.Rect(r)
        pix = pg.get_pixmap(clip=clip, dpi=220, annots=False)
        # re-render WITHOUT vector overlays: rasterise only the images by drawing them onto a blank page
        tmp = pymupdf.open(); tp = tmp.new_page(width=W, height=H)
        for part in g['parts']:
            pb = part['bbox']; tp.insert_image(pymupdf.Rect(pb[0]-r[0], pb[1]-r[1], pb[2]-r[0], pb[3]-r[1]), stream=d.extract_image(part['xref'])['image'])
        clean = tp.get_pixmap(dpi=220)
        name = f"p{book}_{k}"
        clean.save(os.path.join(out, 'fig', name+'.jpg'), jpg_quality=88)
        pix.save(os.path.join(out, 'fig', name+'_lab.jpg'), jpg_quality=88)
        # labels inside the image
        labs = []
        for sp in spans:
            if inside(sp['b'], r, 1):
                b = sp['b']; labs.append({'t': sp['t'], 'x': round(((b[0]+b[2])/2-r[0])/W,4), 'y': round(((b[1]+b[3])/2-r[1])/H,4),
                                          'bx': [round((b[0]-r[0])/W,4), round((b[1]-r[1])/H,4), round((b[2]-r[0])/W,4), round((b[3]-r[1])/H,4)], 'col': sp['color']})
        lines, arrows = [], []
        for dr in draws:
            bb = dr['rect']
            if not (r[0]-2 <= bb.x0 and bb.x1 <= r[2]+2 and r[1]-2 <= bb.y0 and bb.y1 <= r[3]+2): continue
            pts = []
            for it in dr['items']:
                if it[0] == 'l': pts += [it[1], it[2]]
                elif it[0] == 'c': pts += [it[1], it[4]]
                elif it[0] == 're': pts += [it[1].tl, it[1].br]
                elif it[0] == 'qu': pts += [it[1].ul, it[1].lr]
            if not pts: continue
            P = [[round((p.x-r[0])/W,4), round((p.y-r[1])/H,4)] for p in pts]
            col = dr.get('fill') or dr.get('color')
            hexc = '#%02x%02x%02x' % tuple(int(c*255) for c in col[:3]) if col else None
            if dr.get('fill') is not None and len(dr['items']) >= 2: arrows.append({'pts': P, 'fill': hexc})
            else: lines.append({'pts': P, 'stroke': hexc})
        # caption: text blocks outside every image on the page, vertically overlapping this figure's row (+/- 60pt), nearest first
        cap = []
        for b in blocks:
            bb = b[:4]
            if any(inside(bb, gg['bbox'], 0) for gg in groups): continue
            if bb[1] > r[1]-8 and bb[1] < r[3]+70 and not (bb[2] < r[0]-240 or bb[0] > r[2]+240):
                t = re.sub(r'\s+', ' ', b[4]).strip()
                if len(t) > 25 and not t.startswith('IR:'): cap.append((abs(bb[1]-r[3]) + abs((bb[0]+bb[2])/2-(r[0]+r[2])/2)*0.3, t))
        cap = [t for _, t in sorted(cap)[:2]]
        FIGS.append({'id': name, 'page': book, 'w': round(W,1), 'h': round(H,1), 'labels': labs, 'lines': lines, 'arrows': arrows, 'caption': cap})
json.dump(FIGS, open(os.path.join(out, 'figs_raw.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print(len(FIGS), 'figures')
for f in FIGS:
    if f['labels'] or f['arrows']: print(f['id'], 'labels', len(f['labels']), 'lines', len(f['lines']), 'arrows', len(f['arrows']), '|', (f['caption'][0][:90] if f['caption'] else ''))
