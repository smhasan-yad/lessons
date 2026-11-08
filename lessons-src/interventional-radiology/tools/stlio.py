import numpy as np, struct
def load_stl(path):
    b = open(path,'rb').read()
    n = struct.unpack('<I', b[80:84])[0]
    if 84 + n*50 == len(b):
        a = np.frombuffer(b, dtype=np.dtype([('n','<f4',3),('v','<f4',(3,3)),('a','<u2')]), count=n, offset=84)
        tri = a['v'].reshape(-1,3).astype(np.float64)
    else:  # ascii
        vs = [list(map(float,l.split()[1:4])) for l in b.decode('latin1').splitlines() if l.strip().startswith('vertex')]
        tri = np.array(vs)
    v, inv = np.unique(np.round(tri,4), axis=0, return_inverse=True)
    f = inv.reshape(-1,3)
    return v, f
