/* Pure helpers: no DOM access at load time, so the build can import them in Node. */
export const store={
  get(k,d){try{const v=localStorage.getItem('np9:'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem('np9:'+k,JSON.stringify(v))}catch(e){}
    if(typeof window!=='undefined'&&!store._q){store._q=1;setTimeout(()=>{store._q=0;window.dispatchEvent(new Event('np:progress'))},0)}}
};
export const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
export const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
export const pick=a=>a[Math.floor(Math.random()*a.length)];
export const ip2int=s=>s.split('.').reduce((a,o)=>a*256+(+o),0)>>>0;
export const int2ip=n=>[n>>>24,(n>>>16)&255,(n>>>8)&255,n&255].join('.');
export const maskInt=c=>c===0?0:(0xFFFFFFFF<<(32-c))>>>0;
export const isIp=s=>/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.test(s||'')&&s.split('.').every(o=>+o<=255);
export const sameNet=(a,b,m)=>((ip2int(a)&ip2int(m))>>>0)===((ip2int(b)&ip2int(m))>>>0);
