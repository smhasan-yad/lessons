const fs=require('fs'); global.window={}; eval(fs.readFileSync(process.argv[2],'utf8'));
const V=window.IR3D.vessels.map(v=>({id:v.id,name:v.name,sys:v.sys,parent:v.parent,pts:v.pts,variant:v.variant||null}));
fs.writeFileSync(process.argv[3], JSON.stringify(V));
console.log(V.length);
