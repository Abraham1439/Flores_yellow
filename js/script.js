'use strict';
// Personaliza aquí la fecha y la dedicatoria. El mes empieza en 0 (febrero = 1).
const fechaInicio = new Date(2022, 1, 2, 0, 0, 0);
const lineasTexto = [
  'Flores amarillas para el amor de mi vida',
  'Lamento no poder dártelas en persona; sin embargo, jamás serás espectadora.',
  'Así que te regalo estas flores amarillas virtuales. ¡Te amo tres millones!',
  '— I Love You! 💛🦦'
];
const canvas = document.getElementById('treeCanvas'), ctx = canvas.getContext('2d');
const card = document.getElementById('card'), start = document.getElementById('start');
const replay = document.getElementById('replay'), letter = document.getElementById('letter');
const statusText = document.getElementById('status');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const sunflower = start.querySelector('img');
let width = 0, height = 0, startedAt = null, complete = false, frame = 0, writingTimer;
let randomSeed = 57;
const random = () => { randomSeed = (randomSeed * 1664525 + 1013904223) >>> 0; return randomSeed / 4294967296; };
const clamp = x => Math.max(0, Math.min(1, x));
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const mix = (a,b,t) => a + (b-a)*t;
// Coordenadas de diseño: 500 × 520; suelo a y=480.
const crown = new Path2D();
crown.moveTo(250,116);crown.bezierCurveTo(191,25,63,56,67,163);crown.bezierCurveTo(71,254,185,339,250,407);crown.bezierCurveTo(315,339,429,254,433,163);crown.bezierCurveTo(437,56,309,25,250,116);crown.closePath();
const flowers = [];
for(let y=69;y<405;y+=12) for(let x=65;x<436;x+=12){
  const px=x+(random()-.5)*11,py=y+(random()-.5)*11;
  if(ctx.isPointInPath(crown,px,py)) flowers.push({x:px,y:py,r:5+random()*5.2,rotation:random()*6.28,tone:random(),delay:(405-py)/335*.85+random()*.7});
}
flowers.sort((a,b)=>b.y-a.y);
const branches = [
 [250,416,236,361,195,323,150,307,11,0], [250,369,264,310,300,274,340,260,10,.15],
 [252,323,230,273,182,248,126,228,9,.3], [253,289,272,241,317,201,363,193,8,.45],
 [252,248,232,214,202,183,170,154,7,.6], [253,219,263,175,279,143,296,124,6,.75],
 [201,331,180,295,157,279,125,275,4,.4], [200,266,177,238,153,212,141,190,4,.65],
 [301,278,327,254,354,245,385,250,4,.55], [301,220,324,189,341,161,346,136,3,.8],
 [213,199,188,186,169,183,146,184,3,.8], [235,218,228,174,220,136,196,113,3,.9]
];
function size(){const b=canvas.getBoundingClientRect();width=b.width;height=b.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw(performance.now());}
function flower(f,p=1){if(p<=0)return;ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.rotation);ctx.scale(p,p);for(let layer=0;layer<2;layer++){ctx.fillStyle=layer?(f.tone>.45?'#ffdb27':'#ffcf0b'):'#eeb01c';for(let i=0;i<12;i++){const a=i*Math.PI/6+layer*.23;ctx.save();ctx.rotate(a);ctx.beginPath();ctx.ellipse(0,f.r*.60,f.r*.23,f.r*.55,0,0,Math.PI*2);ctx.fill();ctx.restore();}}ctx.fillStyle='#6f3c15';ctx.beginPath();ctx.arc(0,0,f.r*.39,0,7);ctx.fill();ctx.fillStyle='#352210';ctx.beginPath();ctx.arc(0,0,f.r*.26,0,7);ctx.fill();ctx.fillStyle='#c1973b';for(let i=0;i<7;i++){const a=i*2.4;ctx.beginPath();ctx.arc(Math.cos(a)*f.r*.23,Math.sin(a)*f.r*.23,.52,0,7);ctx.fill();}ctx.restore();}
function branch(b,p){if(p<=0)return;ctx.fillStyle='#895020';let prev={x:b[0],y:b[1]};for(let i=1;i<=40;i++){const t=Math.min(i/40,p),v=1-t;const q={x:v*v*v*b[0]+3*v*v*t*b[2]+3*v*t*t*b[4]+t*t*t*b[6],y:v*v*v*b[1]+3*v*v*t*b[3]+3*v*t*t*b[5]+t*t*t*b[7]};ctx.lineWidth=Math.max(.6,b[8]*(1-t));ctx.strokeStyle='#895020';ctx.lineCap='round';ctx.beginPath();ctx.moveTo(prev.x,prev.y);ctx.lineTo(q.x,q.y);ctx.stroke();prev=q;if(t>=p)break;}}
function reveal(){if(complete)return;complete=true;card.classList.add('complete');letter.inert=false;letter.setAttribute('aria-hidden','false');replay.hidden=false;statusText.textContent='Tu árbol ha florecido. Ya puedes leer la dedicatoria.';const box=document.getElementById('typewriter-text');box.replaceChildren();if(reduced.matches){lineasTexto.forEach((s,i)=>{const p=document.createElement('p');p.textContent=s;if(i===3)p.className='signature';box.append(p);});return;}let line=0,char=0,p;function type(){if(line>=lineasTexto.length)return;if(char===0){p=document.createElement('p');if(line===3)p.className='signature';box.append(p);}p.textContent=lineasTexto[line].slice(0,++char);if(char===lineasTexto[line].length){line++;char=0;}writingTimer=setTimeout(type,char===0?260:32);}type();}
function draw(now){ctx.clearRect(0,0,width,height);if(startedAt===null)return;const t=reduced.matches?12:(now-startedAt)/1000;const desktop=width>650;const scale=Math.min((desktop?width*.51:width*.97)/500,(height-22)/520);const center=mix(width/2,desktop?width*.735:width/2,ease((t-7.8)/1.5));const base=height-43;const ox=center-250*scale,oy=base-480*scale;
 ctx.save();ctx.globalAlpha=ease(t/.65);ctx.strokeStyle='#635244';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(18,base);ctx.lineTo(width-18,base);ctx.stroke();ctx.restore();
 if(t<2){const shrink=ease(t/.65),fall=clamp((t-.65)/1.1);const x=width/2,y=mix(height*.48,base-6,fall*fall);ctx.save();ctx.translate(x,y);if(shrink<1){ctx.globalAlpha=1-shrink;ctx.scale(1-shrink*.88,1-shrink*.88);ctx.beginPath();ctx.arc(0,0,48,0,7);ctx.clip();if(sunflower.complete&&sunflower.naturalWidth)ctx.drawImage(sunflower,-60,-60,120,120);}ctx.restore();ctx.save();ctx.globalAlpha=shrink*(1-ease((t-1.75)/.25));ctx.fillStyle='#895020';ctx.beginPath();ctx.arc(x,y,6,0,7);ctx.fill();ctx.restore();}
 ctx.save();ctx.translate(ox,oy);ctx.scale(scale,scale);
 const trunk=ease((t-1.85)/1.8);if(trunk>0){ctx.save();ctx.beginPath();ctx.rect(0,480-365*trunk,500,365*trunk+1);ctx.clip();const g=ctx.createLinearGradient(236,0,262,0);g.addColorStop(0,'#74401b');g.addColorStop(1,'#a3672c');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(235,480);ctx.bezierCurveTo(246,411,249,308,248,240);ctx.bezierCurveTo(247,181,239,139,233,125);ctx.bezierCurveTo(251,142,263,214,262,278);ctx.bezierCurveTo(257,361,258,416,261,480);ctx.closePath();ctx.fill();ctx.restore();}
 branches.forEach(b=>branch(b,ease((t-3.05-b[9]) /1.5)));
 flowers.forEach(f=>flower(f,ease((t-4.7-f.delay)/1.2)));
 // Pocos pétalos: el corazón conserva su silueta y no se oculta tras partículas.
 if(t>8&&!reduced.matches)for(let i=0;i<8;i++){const age=(t-8+i*.71)%5.7;const f=flowers[(i*97)%flowers.length];ctx.save();ctx.globalAlpha=.6*(1-age/5.7);ctx.translate(f.x+Math.sin(age+i)*14-age*5,f.y+age*28);ctx.rotate(age+i);ctx.fillStyle='#e9b21e';ctx.beginPath();ctx.ellipse(0,0,2,4,0,0,7);ctx.fill();ctx.restore();}
 ctx.restore();if(t>=9.3)reveal();}
function tick(now){draw(now);if(!reduced.matches&&!document.hidden)frame=requestAnimationFrame(tick);}
function begin(){if(startedAt!==null)return;startedAt=performance.now();card.classList.add('started');start.disabled=true;statusText.textContent='La semilla cae, el árbol crece y sus flores comienzan a abrirse.';cancelAnimationFrame(frame);tick(startedAt);}
start.addEventListener('click',begin);
replay.addEventListener('click',()=>{cancelAnimationFrame(frame);clearTimeout(writingTimer);startedAt=null;complete=false;card.classList.remove('started','complete');letter.inert=true;letter.setAttribute('aria-hidden','true');document.getElementById('typewriter-text').replaceChildren();replay.hidden=true;start.disabled=false;size();start.focus();statusText.textContent='Pulsa el girasol para comenzar otra vez.';});
window.addEventListener('resize',size);
document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(frame);if(!document.hidden&&startedAt!==null)tick(performance.now());});
function counter(){const n=Math.max(0,Math.floor((Date.now()-fechaInicio)/1000));[['days',Math.floor(n/86400)],['hours',Math.floor(n%86400/3600)],['minutes',Math.floor(n%3600/60)],['seconds',n%60]].forEach(([id,v])=>document.getElementById(id).textContent=id==='days'?v:String(v).padStart(2,'0'));}
counter();setInterval(counter,1000);size();
