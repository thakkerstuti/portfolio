/* ── CURSOR ─────────────────────────────────── */
const dot = document.getElementById('c-dot');
const ring = document.getElementById('c-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX; my=e.clientY;
  dot.style.left=mx+'px'; dot.style.top=my+'px';
});
(function loop(){
  rx+=(mx-rx)*.1; ry+=(my-ry)*.1;
  ring.style.left=Math.round(rx)+'px';
  ring.style.top=Math.round(ry)+'px';
  requestAnimationFrame(loop);
})();

/* ── SPACE CANVAS ────────────────────────────── */
const canvas=document.getElementById('space-canvas');
const ctx=canvas.getContext('2d');
let W,H,stars=[],shooters=[];

function resize(){
  W=canvas.width=window.innerWidth;
  H=canvas.height=window.innerHeight;
}
resize();
window.addEventListener('resize',()=>{resize();initStars()});

function initStars(){
  stars=[];
  const n=Math.floor(W*H/2800);
  for(let i=0;i<n;i++){
    stars.push({
      x:Math.random()*W,y:Math.random()*H,
      r:Math.random()*1.4+0.1,
      a:Math.random(),speed:Math.random()*.008+.002,
      phase:Math.random()*Math.PI*2
    });
  }
}
initStars();

function spawnShooter(){
  if(Math.random()<0.004){
    shooters.push({
      x:Math.random()*W*0.8,y:Math.random()*H*0.3,
      vx:6+Math.random()*4,vy:2+Math.random()*3,
      len:120+Math.random()*80,
      life:1,decay:.025
    });
  }
}

let t=0;
function frame(){
  ctx.clearRect(0,0,W,H);
  t+=.004;

  /* nebula glow */
  const ng=[
    {x:W*.15,y:H*.3,r:W*.35,c:'rgba(79,110,247,'},
    {x:W*.8,y:H*.7,r:W*.3,c:'rgba(139,92,246,'},
    {x:W*.5,y:H*.1,r:W*.25,c:'rgba(6,182,212,'}
  ];
  ng.forEach(n=>{
    const g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r);
    g.addColorStop(0,n.c+'0.055)');
    g.addColorStop(1,'transparent');
    ctx.fillStyle=g;
    ctx.beginPath();ctx.ellipse(n.x,n.y,n.r,n.r*.6,t*.05,0,Math.PI*2);
    ctx.fill();
  });

  /* stars */
  stars.forEach(s=>{
    const twinkle=s.a*.6+Math.sin(t*40*s.speed+s.phase)*.35;
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(210,220,255,${Math.max(0,Math.min(1,twinkle))})`;
    ctx.fill();
  });

  /* shooting stars */
  spawnShooter();
  shooters=shooters.filter(s=>{
    ctx.save();
    const g=ctx.createLinearGradient(s.x-s.vx*s.len/s.vx,s.y-s.vy*s.len/s.vx,s.x,s.y);
    g.addColorStop(0,'transparent');
    g.addColorStop(1,`rgba(150,180,255,${s.life})`);
    ctx.strokeStyle=g;ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(s.x-s.vx*(s.len/8),s.y-s.vy*(s.len/8));
    ctx.lineTo(s.x,s.y);
    ctx.stroke();ctx.restore();
    s.x+=s.vx;s.y+=s.vy;s.life-=s.decay;
    return s.life>0&&s.x<W+200;
  });

  requestAnimationFrame(frame);
}
frame();

/* ── ENTRY SCREEN ────────────────────────────── */
document.getElementById('enterBtn').addEventListener('click',()=>{
  document.getElementById('entry').classList.add('gone');
  document.body.style.overflow='auto';
  triggerReveals();
});
document.body.style.overflow='hidden';

/* ── SCROLL REVEAL ───────────────────────────── */
function triggerReveals(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')});
  },{threshold:.1});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
}

/* ── BENTO CARD MOUSE GLOW ───────────────────── */
document.querySelectorAll('.bcard').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    card.style.setProperty('--mx',(e.clientX-r.left)+'px');
    card.style.setProperty('--my',(e.clientY-r.top)+'px');
  });
});

/* ── KEYBOARD SHORTCUT ───────────────────────── */
document.addEventListener('keydown',e=>{
  if(e.key==='Enter'){
    const entry=document.getElementById('entry');
    if(!entry.classList.contains('gone')){
      entry.classList.add('gone');
      document.body.style.overflow='auto';
      triggerReveals();
    }
  }
});
