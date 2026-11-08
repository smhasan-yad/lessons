"""Build js/dsa_figs.js: real DSA figures (from Core Radiology ch.9) with hotspots, plus the figure index for lessons."""
import json, os, sys, math, shutil, subprocess
from PIL import Image, ImageDraw
D, SITE = sys.argv[1], sys.argv[2]
F = {f['id']: f for f in json.load(open(os.path.join(D, 'figs_raw.json'), encoding='utf-8'))}
C = {'blue':'#00adef', 'yellow':'#fff100', 'red':('#d12229','#ed1c24','#be1d2c'), 'green':('#40ad48','#0c9444')}
def is_col(fill, name): c = C[name]; return fill in (c if isinstance(c, tuple) else (c,))
def tip(pts, ar):
    best = (0, None, None)
    for i in range(len(pts)):
        for j in range(i+1, len(pts)):
            dd = math.hypot((pts[i][0]-pts[j][0])*ar, pts[i][1]-pts[j][1])
            if dd > best[0]: best = (dd, pts[i], pts[j])
    L, p, q = best
    if not p: return None
    ux, uy = ((q[0]-p[0])*ar/L, (q[1]-p[1])/L)
    def width(end, sign):
        w = 0
        for r in pts:
            t = ((r[0]-p[0])*ar*ux + (r[1]-p[1])*uy)
            if (sign > 0 and t < 0.35*L) or (sign < 0 and t > 0.65*L):
                w = max(w, abs(-(r[0]-p[0])*ar*uy + (r[1]-p[1])*ux))
        return w
    return p if width(p, 1) > width(q, -1) else q
def arrows(fid, mapping):
    f = F[fid]; ar = f['w']/f['h']; out = []
    for a in f['arrows']:
        for col, name in mapping:
            if a['fill'] and is_col(a['fill'], col) and len(a['pts']) >= 3:
                t = tip(a['pts'], ar)
                if t and not any(o['t']==name and math.hypot(o['x']-t[0], o['y']-t[1]) < 0.04 for o in out):
                    out.append({'t': name, 'x': round(t[0],4), 'y': round(t[1],4)})
    return out
def leaders(fid, keep):
    """labelled figures: hotspot = leader end away from the label phrase (from hotspots.py logic)."""
    sys.argv_backup = None
    import importlib.util
    f = F[fid]; ar = f['w']/f['h']
    L = [l for l in f['labels'] if len(l['t']) > 2 or l['t']=='IMA']
    out = []
    for a in f['arrows']:
        pts = a['pts']
        if len(pts) < 2: continue
        best = (0, None, None)
        for i in range(len(pts)):
            for j in range(i+1, len(pts)):
                dd = math.hypot((pts[i][0]-pts[j][0])*ar, pts[i][1]-pts[j][1])
                if dd > best[0]: best = (dd, pts[i], pts[j])
        if best[0] < 0.02: continue
        _, p, q = best
        def dl(pt):
            return min(((math.hypot((max(l['bx'][0]-pt[0],0,pt[0]-l['bx'][2]))*ar, max(l['bx'][1]-pt[1],0,pt[1]-l['bx'][3])), l['t']) for l in L), default=(9,''))
        dp, tp = dl(p); dq, tq = dl(q)
        tgt, word, dmin = (q, tp, dp) if dp < dq else (p, tq, dq)
        if dmin > 0.06: continue
        name = next((k for k, words in keep if word in words), None)
        if name and not any(o['t']==name and math.hypot(o['x']-tgt[0], o['y']-tgt[1]) < 0.035 for o in out):
            out.append({'t': name, 'x': round(tgt[0],4), 'y': round(tgt[1],4)})
    return out


def phrases(f):
    L = [dict(l) for l in f['labels'] if len(l['t']) > 2 or l['t']=='IMA']; used=[False]*len(L); out=[]
    for i,a in enumerate(L):
        if used[i]: continue
        grp=[a]; used[i]=True; ch=True
        while ch:
            ch=False
            for j,b in enumerate(L):
                if used[j]: continue
                for g in grp:
                    gh=g['bx'][3]-g['bx'][1]
                    if abs(b['bx'][1]-g['bx'][3]) < gh*0.9 and not (b['bx'][0] > g['bx'][2]+0.02 or b['bx'][2] < g['bx'][0]-0.02):
                        grp.append(b); used[j]=True; ch=True; break
        grp.sort(key=lambda g:(g['bx'][1],g['bx'][0]))
        out.append({'t':' '.join(g['t'] for g in grp).replace('- ','-'), 'bx':[min(g['bx'][0] for g in grp),min(g['bx'][1] for g in grp),max(g['bx'][2] for g in grp),max(g['bx'][3] for g in grp)]})
    return out
def leaders2(fid, names):
    f = F[fid]; ar = f['w']/f['h']; P = phrases(f); cand = {}
    def db(pt,bx): return math.hypot(max(bx[0]-pt[0],0,pt[0]-bx[2])*ar, max(bx[1]-pt[1],0,pt[1]-bx[3]))
    for a in f['arrows']:
        pts=a['pts']
        if len(pts)<2: continue
        best=(0,None,None)
        for i in range(len(pts)):
            for j in range(i+1,len(pts)):
                dd=math.hypot((pts[i][0]-pts[j][0])*ar, pts[i][1]-pts[j][1])
                if dd>best[0]: best=(dd,pts[i],pts[j])
        if best[0]<0.02: continue
        _,p,q=best
        opts=[(db(p,ph['bx']),ph,q) for ph in P]+[(db(q,ph['bx']),ph,p) for ph in P]
        if not opts: continue
        d0,ph,tgt=min(opts,key=lambda o:o[0])
        if d0>0.06: continue
        nm = next((v for k,v in names.items() if ph['t'].startswith(k)), None)
        if not nm: continue
        far = db(tgt, ph['bx'])
        if nm not in cand or far > cand[nm][0]: cand[nm]=(far, tgt)
    return [{'t':k,'x':round(v[1][0],4),'y':round(v[1][1],4)} for k,v in cand.items()]

FIGS = [
 {'id':'p598_0', 'title':'Renal DSA: phase 1', 'kind':'phase', 'answer':'Early arterial', 'page':598},
 {'id':'p598_1', 'title':'Renal DSA: phase 2', 'kind':'phase', 'answer':'Late arterial', 'page':598},
 {'id':'p598_2', 'title':'Renal DSA: phase 3', 'kind':'phase', 'answer':'Parenchymal', 'page':598},
 {'id':'p598_3', 'title':'Renal DSA: phase 4', 'kind':'phase', 'answer':'Venous', 'page':598},
 {'id':'p599_0', 'title':'Celiac axis, early arterial', 'kind':'labels', 'page':599,
  'hot': leaders2('p599_0', {'celiac trunk':'Celiac trunk','splenic':'Splenic artery','left gastric':'Left gastric artery','common hepatic':'Common hepatic artery','gastroduodenal':'Gastroduodenal artery','right hepatic':'Right hepatic artery','left hepatic':'Left hepatic artery'})},
 {'id':'p599_2', 'title':'Celiac axis, late arterial', 'kind':'labels', 'page':599,
  'hot': leaders2('p599_2', {'celiac trunk':'Celiac trunk','splenic':'Splenic artery','dorsal pancreatic':'Dorsal pancreatic artery','left gastric':'Left gastric artery','gastroduodenal':'Gastroduodenal artery','right gastroepiploic':'Right gastroepiploic artery','left gastroepiploic':'Left gastroepiploic artery','right hepatic':'Right hepatic artery','left hepatic':'Left hepatic artery','right gastric':'Right gastric artery','superior pancreatico':'Superior pancreaticoduodenal artery'})},
 {'id':'p601_3', 'title':'SMA run: arc of Riolan to an occluded IMA', 'kind':'labels', 'page':601,
  'hot': arrows('p601_3', [('yellow','Arc of Riolan'),('red','IMA (filled retrogradely)')])},
 {'id':'p603_0', 'title':'Pelvic arteriogram', 'kind':'labels', 'page':603, 'hot':[
   {'t':'Aorta','x':0.537,'y':0.034},{'t':'IMA','x':0.615,'y':0.056},{'t':'Common iliac artery','x':0.643,'y':0.341},{'t':'External iliac artery','x':0.716,'y':0.467},
   {'t':'Internal iliac artery','x':0.656,'y':0.479},{'t':'Posterior division','x':0.658,'y':0.589},{'t':'Superior gluteal artery','x':0.808,'y':0.657},{'t':'Anterior division','x':0.693,'y':0.708},
   {'t':'Uterine artery','x':0.350,'y':0.810},{'t':'Obturator artery','x':0.739,'y':0.919},{'t':'Inferior gluteal artery','x':0.920,'y':0.928}]},
 {'id':'p616_0', 'title':'Arm A: axillary', 'kind':'labels', 'page':616, 'hot': arrows('p616_0', [('blue','Axillary artery (third part)')])},
 {'id':'p616_1', 'title':'Arm B: elbow', 'kind':'labels', 'page':616, 'hot': arrows('p616_1', [('blue','Brachial artery'),('yellow','Radial recurrent artery')])},
 {'id':'p616_2', 'title':'Arm C: forearm', 'kind':'labels', 'page':616, 'hot': arrows('p616_2', [('yellow','Radial artery'),('red','Ulnar artery'),('green','Common interosseous artery')])},
 {'id':'p617_0', 'title':'Hand (hypothenar hammer case)', 'kind':'labels', 'page':617,
  'hot': leaders('p617_0', [('Radial artery',['radial','artery']),('Ulnar artery (occluded distally)',['ulnar artery']),('Deep palmar arch',['deep palmar arch']),('Common palmar digital arteries',['common palmar digital arteries']),('Proper palmar digital arteries',['proper palmar digital arteries'])])},
 {'id':'p618_0', 'title':'Leg runoff A: groin and thigh', 'kind':'labels', 'page':618, 'hot': arrows('p618_0', [('yellow','Common femoral artery'),('blue','Profunda femoris artery'),('green','Superficial femoral artery')])},
 {'id':'p618_1', 'title':'Leg runoff B: distal thigh', 'kind':'labels', 'page':618, 'hot': arrows('p618_1', [('green','Superficial femoral artery'),('blue','Descending geniculate artery')])},
 {'id':'p618_2', 'title':'Leg runoff C: calf', 'kind':'labels', 'page':618, 'hot': arrows('p618_2', [('green','Tibioperoneal trunk'),('blue','Anterior tibial artery'),('yellow','Posterior tibial artery'),('red','Peroneal artery')])},
 {'id':'p618_3', 'title':'Leg runoff D: foot', 'kind':'labels', 'page':618, 'hot': arrows('p618_3', [('blue','Dorsalis pedis artery'),('yellow','Posterior tibial artery'),('green','Deep plantar arch')])},
]
# IMA figure is three image strips; stitch the clean strips and keep leader hotspots in page coords
for f in FIGS:
    raw = F[f['id']]; f['caption'] = raw['caption'][0] if raw['caption'] else ''; f['w'] = raw['w']; f['h'] = raw['h']
# overlay checks
for f in FIGS:
    if f['kind'] != 'labels': continue
    im = Image.open(os.path.join(D, 'fig', f['id']+'.jpg')).convert('RGB'); W, H = im.size; dr = ImageDraw.Draw(im)
    for h in f['hot']:
        x, y = h['x']*W, h['y']*H; dr.ellipse([x-7,y-7,x+7,y+7], outline=(255,0,0), width=3); dr.text((x+9,y-6), h['t'], fill=(255,0,0))
    im.save(os.path.join(D, 'chk2_'+f['id']+'.png'))
    print(f['id'], len(f['hot']), [h['t'] for h in f['hot']])
# figure index for lessons: every extracted figure with its caption
ALL = []
for fid, raw in F.items():
    if raw['w'] < 60 or raw['h'] < 60: continue
    ALL.append({'id': fid, 'page': raw['page'], 'cap': (raw['caption'][0] if raw['caption'] else ''), 'lab': True})
os.makedirs(os.path.join(SITE, 'book', 'fig'), exist_ok=True)
for a in ALL:
    for suf in ('', '_lab'):
        src = os.path.join(D, 'fig', a['id']+suf+'.jpg')
        if os.path.exists(src): shutil.copy(src, os.path.join(SITE, 'book', 'fig', a['id']+suf+'.jpg'))
js = '/* Generated by tools/build_dsa.py from Core Radiology 2e ch.9 figures (personal study copy). */\n'
js += 'window.IR_DSA = ' + json.dumps(FIGS, ensure_ascii=False) + ';\n'
js += 'window.IR_FIGS = ' + json.dumps(sorted(ALL, key=lambda a:(a['page'], a['id'])), ensure_ascii=False) + ';\n'
open(os.path.join(SITE, 'js', 'dsa_figs.js'), 'w', encoding='utf-8').write(js)
print('figures indexed', len(ALL))
