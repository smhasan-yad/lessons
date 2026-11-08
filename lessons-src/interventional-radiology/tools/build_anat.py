"""Build js/anatomy_meshes.js from BodyParts3D STL meshes.
1. Put BP3D meshes in a cm frame (X=x/10 patient-left, Y=cranial, Z=anterior).
2. Register the hand-built vessel tree onto real anatomy with a thin-plate-spline warp.
3. Decimate + quantize meshes, emit a classic-script data file (works from file://).
"""
import sys, os, json, base64, re
import numpy as np
from scipy.interpolate import RBFInterpolator
from scipy.sparse import coo_matrix
from scipy.sparse.csgraph import dijkstra
import fast_simplification as fs
sys.path.insert(0, os.path.dirname(__file__))
from stlio import load_stl

BP = sys.argv[1]; OUT = sys.argv[2]
rows = [l.rstrip('\n').split('\t') for l in open(os.path.join(BP, 'want.txt'), encoding='utf-8')]
NAME2FID = {n: fid for p, fid, n in rows}
RAW = {}
def raw(n):
    if n not in RAW: RAW[n] = load_stl(os.path.join(BP, 'stl', NAME2FID[n] + '.stl'))
    return RAW[n]

LVN = ["first thoracic","second thoracic","third thoracic","fourth thoracic","fifth thoracic","sixth thoracic","seventh thoracic","eighth thoracic","ninth thoracic","tenth thoracic","eleventh thoracic","twelfth thoracic","first lumbar","second lumbar","third lumbar","fourth lumbar","fifth lumbar"]
LV = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12","L1","L2","L3","L4","L5"]
def body_center(n):
    v, _ = raw(n); ymin = v[:,1].min()
    m = (v[:,1] < ymin + 30) & (np.abs(v[:,0]) < 22)
    return v[m].mean(0)
bodies = np.array([body_center(n + " vertebra") for n in LVN])        # mm, raw frame
zT12 = bodies[11,2]; y0 = bodies[:,1].mean()
def G(p):
    p = np.atleast_2d(p).astype(float)
    return np.c_[p[:,0]/10.0, (p[:,2]-zT12)/10.0 + 18.0, -(p[:,1]-y0)/10.0 - 0.6]
bodiesG = G(bodies)

# ---------- my model ----------
MY = json.load(open(os.path.join(BP, 'myvessels.json')))
MYD = {v['id']: v for v in MY}
lvY = np.array([51 - 3*i for i in range(17)], float)
def poly(pts, n=400):
    """dense polyline sampled by arc length (approximates the Catmull-Rom tube)."""
    P = np.array(pts, float)
    # simple Catmull-Rom densify
    out = []
    for i in range(len(P)-1):
        p0 = P[max(i-1,0)]; p1 = P[i]; p2 = P[i+1]; p3 = P[min(i+2,len(P)-1)]
        for t in np.linspace(0,1,20,endpoint=False):
            t2, t3 = t*t, t*t*t
            out.append(0.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t2+(-p0+3*p1-3*p2+p3)*t3))
    out.append(P[-1]); D = np.array(out)
    s = np.r_[0, np.cumsum(np.linalg.norm(np.diff(D,axis=0),axis=1))]
    return D, s
def at_arc(D, s, x):
    x = np.clip(x, 0, s[-1]); return np.array([np.interp(x, s, D[:,k]) for k in range(3)])
def my_at_y(ids, y):
    D = np.vstack([poly(MYD[i]['pts'])[0] for i in ids])
    k = np.argmin(np.abs(D[:,1]-y)); return D[k]
def real_z_to_my_y(z):
    zs = bodies[:,2]; o = np.argsort(zs)
    return np.interp(z, zs[o], lvY[o])

src, dst, tag = [], [], []
def pair(s, d, t):
    src.append(np.asarray(s,float)); dst.append(np.asarray(d,float).ravel()); tag.append(t)

for i in range(17): pair([0, lvY[i], -0.6], bodiesG[i], 'body '+LV[i])

def slices(n, z0, z1, step):
    v, _ = raw(n); out = []
    for zz in np.arange(z0, z1, step):
        m = np.abs(v[:,2]-zz) < 4
        if m.sum() > 10: out.append(v[m].mean(0))
    return np.array(out)
desc = slices("descending aorta", raw("descending aorta")[0][:,2].min()+12, 1290, 14)
# descending part of my aorta: points after the arch (index >= 4 of aorta_th) + aorta_ab
myDesc = np.vstack([poly(MYD['aorta_th']['pts'][4:])[0], poly(MYD['aorta_ab']['pts'])[0]])
for c in desc:
    y = real_z_to_my_y(c[2]); k = np.argmin(np.abs(myDesc[:,1]-y)); pair(myDesc[k], G(c), 'aorta desc')
asc = slices("ascending aorta", 1256, 1300, 10); myAsc = poly(MYD['aorta_th']['pts'][:3])[0]
for j, c in enumerate(asc):
    pair(myAsc[int(j/(max(1,len(asc)-1))*(len(myAsc)-1))], G(c), 'aorta asc')
av, _ = raw("arch of aorta"); top = av[av[:,2] > av[:,2].max()-8].mean(0)
pair([0,47.6,4], G(top), 'arch apex')
ivc = slices("inferior vena cava", raw("inferior vena cava")[0][:,2].min()+8, raw("inferior vena cava")[0][:,2].max()-6, 14)
myIvc = poly(MYD['ivc']['pts'])[0]
for c in ivc:
    y = real_z_to_my_y(c[2]); k = np.argmin(np.abs(myIvc[:,1]-y)); pair(myIvc[k], G(c), 'ivc')

# ---------- branch vessels: endpoints along a surface geodesic ----------
MAP = {'brachiocephalic artery, nsn':'bca','right common carotid artery':'rcca','left common carotid artery':'lcca','right subclavian artery':'rsubcl','left subclavian artery':'lsubcl',
 'celiac artery':'celiac','common hepatic artery':'cha','left gastric artery':'lga','splenic artery':'splenic','superior mesenteric artery':'sma','inferior mesenteric artery':'ima',
 'right renal artery':'rrenal','left renal artery':'lrenal','right common iliac artery':'rcia','left common iliac artery':'lcia','right external iliac artery':'reia','left external iliac artery':'leia',
 'right internal iliac artery':'riia','left internal iliac artery':'liia','right renal vein':'rrv','left renal vein':'lrv','right common iliac vein':'rciv','left common iliac vein':'lciv',
 'right external iliac vein':'reiv','left external iliac vein':'leiv','right brachiocephalic vein':'rbrv','left brachiocephalic vein':'lbrv','right internal jugular vein':'rij','left internal jugular vein':'lij',
 'right subclavian vein':'rsubv','left subclavian vein':'lsubv','splenic vein':'splv','superior mesenteric vein':'smv','superior vena cava':'svc','inferior vena cava':'ivc'}
REAL_OF = {v: k for k, v in MAP.items()}
REAL_OF.update({'aorta_th':'descending aorta','aorta_ab':'descending aorta'})
def centerline(n):
    v, f = raw(n); vg = G(v)
    e = np.vstack([f[:,[0,1]], f[:,[1,2]], f[:,[2,0]]]); w = np.linalg.norm(vg[e[:,0]]-vg[e[:,1]], axis=1)
    A = coo_matrix((np.r_[w,w], (np.r_[e[:,0],e[:,1]], np.r_[e[:,1],e[:,0]])), shape=(len(v),len(v))).tocsr()
    c = vg.mean(0); a = np.argmax(np.linalg.norm(vg-c,axis=1))
    d = dijkstra(A, indices=a); d[~np.isfinite(d)] = -1; b = np.argmax(d)
    d2, pred = dijkstra(A, indices=b, return_predecessors=True)
    path = [a]
    while path[-1] != b and pred[path[-1]] >= 0: path.append(pred[path[-1]])
    P = vg[path]
    # pull surface path toward the axis: average of vertices near each path point
    from scipy.spatial import cKDTree
    T = cKDTree(vg); P2 = []
    for p in P:
        idx = T.query_ball_point(p, 0.9)
        P2.append(vg[idx].mean(0) if len(idx) > 3 else p)
    P2 = np.array(P2)
    k = 5; P3 = np.array([P2[max(0,i-k):i+k+1].mean(0) for i in range(len(P2))])
    s = np.r_[0, np.cumsum(np.linalg.norm(np.diff(P3,axis=0),axis=1))]
    return P3, s, vg
CL = {}
residual_skip = []
for n, mid in MAP.items():
    if n not in NAME2FID or mid not in MYD or mid in ('svc','ivc'): continue
    P, s, vg = centerline(n)
    par = MYD[mid]['parent']; parN = REAL_OF.get(par)
    if parN and parN in NAME2FID:
        pv = G(raw(parN)[0])
        d0 = np.min(np.linalg.norm(pv - P[0],axis=1)); d1 = np.min(np.linalg.norm(pv - P[-1],axis=1))
    else:  # orient by my own start
        myS = np.array(MYD[mid]['pts'][0]); d0 = np.linalg.norm(P[0]-myS); d1 = np.linalg.norm(P[-1]-myS)
    if d1 < d0: P = P[::-1]; s = s[-1] - s[::-1]
    CL[mid] = (P, s, n)
    D, sm = poly(MYD[mid]['pts'])
    L = min(s[-1], sm[-1]); fr = [0, .25, .5, .75, 1.0] if L > 2.5 else [0, 1.0]
    for f in fr:
        pair(at_arc(D, sm, f*L), at_arc(P, s, f*L), 'vessel '+mid)

# organs + bones
def cent(n): return G(raw(n)[0].mean(0))
pair([-7.2,12.6,0], cent("right kidney"), 'r kidney'); pair([7.2,13.2,0], cent("left kidney"), 'l kidney')
pair([-4.6,21.5,3.6], cent("liver"), 'liver'); pair([8.6,19.6,0.8], cent("spleen"), 'spleen')
for side, sx in (("right",-1),("left",1)):
    v,_ = raw(side+" femur"); top = v[v[:,2] > v[:,2].max()-45]; med = top[np.abs(top[:,0]) < np.abs(top[:,0]).mean()]
    pair([7.9*sx,-9.8,2.8], G(med.mean(0)), side+' femoral head')
    pair([6.4*sx,-34,1], G(v[v[:,2] < v[:,2].min()+25].mean(0)), side+' knee')
    t,_ = raw(side+" tibia"); pair([5.8*sx,-56,1.4], G(t[t[:,2] < t[:,2].min()+20].mean(0)), side+' ankle')
    h,_ = raw(side+" humerus"); pair([11.5*sx,52,1.6], G(h[h[:,2] > h[:,2].max()-30].mean(0)), side+' humeral head')
    pair([14.6*sx,33,1.2], G(h[h[:,2] < h[:,2].min()+25].mean(0)), side+' elbow')
    r,_ = raw(side+" radius"); pair([17*sx,19.6,2], G(r[r[:,2] < r[:,2].min()+20].mean(0)), side+' wrist')

src = np.array(src); dst = np.array(dst)
# drop near-duplicate sources (TPS needs distinct points)
keep = []; seen = []
for i, p in enumerate(src):
    if all(np.linalg.norm(p - q) > 0.15 for q in seen): keep.append(i); seen.append(p)
src, dst = src[keep], dst[keep]; tag = [tag[i] for i in keep]
tps = RBFInterpolator(src, dst - src, kernel='thin_plate_spline', smoothing=2.0)
res = np.linalg.norm(src + tps(src) - dst, axis=1)
print(f"landmarks {len(src)}  residual mean {res.mean():.2f} cm  max {res.max():.2f} ({tag[int(res.argmax())]})")
warp = lambda P: (np.asarray(P,float) + tps(np.asarray(P,float)))
WARP = {v['id']: np.round(warp(v['pts']), 2).tolist() for v in MY}

# ---------- meshes ----------
def grp(n):
    if re.search(r'vertebra|sacrum|hip bone|femur|tibia|fibula|humerus|radius|ulna|clavicle|rib|sternum', n): return 'bone'
    if re.search(r'artery|aorta', n): return 'art'
    if re.search(r'vein|vena', n): return 'vein'
    return 'organ'
TARGET = {'bone':2600, 'organ':5000, 'art':2500, 'vein':2500}
BIG = {'liver':9000, 'wall of heart':9000, 'colon, nsn':7000, 'sacrum':5000, 'right hip bone':5500, 'left hip bone':5500, 'descending aorta':6000, 'right femur':4000, 'left femur':4000}
meshes = []; tot = 0
for p, fid, n in rows:
    v, f = raw(n); g = grp(n); vg = G(v)
    tgt = BIG.get(n, TARGET[g]);
    if re.search(r' rib$', n): tgt = 1100
    if len(f) > tgt:
        try:
            vg2, f2 = fs.simplify(vg.astype(np.float32), f.astype(np.int32), target_reduction=1 - tgt/len(f))
            vg, f = vg2.astype(float), f2
        except Exception as ex: print('simplify fail', n, ex)
    parts = [(vg, f, n)]
    if n == 'descending aorta':   # split at the diaphragm (T12) so thoracic/abdominal can be picked separately
        cy = vg[f].mean(1)[:,1]; cut = 20.0
        parts = []
        for sel, nm in ((cy >= cut, 'descending thoracic aorta'), (cy < cut, 'abdominal aorta')):
            ff = f[sel]; u, inv = np.unique(ff, return_inverse=True); parts.append((vg[u], inv.reshape(-1,3), nm))
    for vg_, f_, nm in parts:
        lo = vg_.min(0); hi = vg_.max(0); sc = (hi - lo).max() / 65000 or 1
        q = np.round((vg_ - lo) / sc).astype('<u2')
        idx = f_.astype('<u2' if len(vg_) < 65536 else '<u4')
        mid = {'descending thoracic aorta':'aorta_th','abdominal aorta':'aorta_ab','ascending aorta':'aorta_th','arch of aorta':'aorta_th'}.get(nm, MAP.get(nm))
        meshes.append({'n': nm, 'g': g, 'v': mid, 'lo': np.round(lo,4).tolist(), 's': float(sc), 'i32': len(vg_) >= 65536,
                       'p': base64.b64encode(q.tobytes()).decode(), 'f': base64.b64encode(idx.tobytes()).decode()})
        tot += len(f_)
# which of my tubes the real mesh replaces (real centerline at least 60% as long as mine)
hide = []
for mid, (P, s, n) in CL.items():
    sm = poly(MYD[mid]['pts'])[1][-1]
    if s[-1] >= 0.6 * sm: hide.append(mid)
hide += ['aorta_th', 'aorta_ab', 'ivc', 'svc']
levels = [{'n': LV[i], 'y': round(float(bodiesG[i,1]),2), 'z': round(float(bodiesG[i,2]),2)} for i in range(17)]
data = {'credit': 'BodyParts3D, (c) The Database Center for Life Science, licensed under CC Attribution-Share Alike 2.1 Japan',
        'levels': levels, 'warp': WARP, 'hide': sorted(set(hide)), 'meshes': meshes}
js = '/* Generated by build_anat.py from BodyParts3D (CC BY-SA 2.1 JP). Do not edit by hand. */\nwindow.IR_ANAT = ' + json.dumps(data, separators=(',',':')) + ';\n'
open(OUT, 'w', encoding='utf-8').write(js)
print(f"meshes {len(meshes)}  faces {tot}  file {len(js)/1e6:.2f} MB  hidden tubes {len(set(hide))}: {sorted(set(hide))}")
ys = [m for m in levels]; print('T1 y', levels[0]['y'], 'L5 y', levels[-1]['y'])
allv = np.vstack([np.array(w) for w in WARP.values()]); print('warped bbox', allv.min(0).round(1), allv.max(0).round(1))
