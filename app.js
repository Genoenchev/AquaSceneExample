// Aquascene — rebuild v3
document.addEventListener('DOMContentLoaded',()=>{
  const root=document.documentElement;
  const toggle=document.getElementById('themeToggle');
  const saved=localStorage.getItem('theme');
  if(saved){root.setAttribute('data-theme',saved);toggle.checked=(saved==='light')}else{root.setAttribute('data-theme','dark');toggle.checked=false}
  toggle.addEventListener('change',()=>{const t=toggle.checked?'light':'dark';root.setAttribute('data-theme',t);localStorage.setItem('theme',t)});

  // Mobile nav
  const menu=document.getElementById('site-menu'), burger=document.querySelector('.hamburger');
  if(burger && menu){
    burger.addEventListener('click',()=>{const open=menu.classList.toggle('open');burger.setAttribute('aria-expanded',open?'true':'false')});
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');burger.setAttribute('aria-expanded','false')}));
  }

  // Configurator
  const scene=document.querySelector('.layer.objects');
  const tank=document.querySelector('.tank-inner');
  const bubbles=document.querySelector('.layer .bubbles');
  const palette=document.querySelector('.swatches');
  const resetBtn=document.querySelector('.tank-reset');
  const baseLayer=document.querySelector('.tank-base');
  const baseImg=document.querySelector('.tank-base img');

  // Overlays
  const shimmer=document.createElement('div'); shimmer.className='caustics'; tank.appendChild(shimmer);
  const bv=document.createElement('img'); bv.src='./assets/air_stone.svg'; bv.className='bubbles'; bubbles.appendChild(bv);

  // Items
  const items=[
    {name:'Slate Stack',src:'./assets/rock_slate.svg'},
    {name:'River Stones',src:'./assets/rock_river.svg'},
    {name:'Anubias',src:'./assets/plant_anubias.svg'},
    {name:'Vallisneria',src:'./assets/plant_valisneria.svg'},
    {name:'Driftwood',src:'./assets/driftwood.svg'},
    {name:'Castle',src:'./assets/orn_castle.svg'},
    {name:'Chromis',src:'./assets/fish1.svg'},
    {name:'Yellow Tang',src:'./assets/fish_tang.svg'},
    {name:'Clownfish',src:'./assets/fish_clown.svg'},
    {name:'Air Stone',src:'./assets/air_stone.svg'}
  ];
  const grid=document.querySelector('.grid');
  items.forEach(it=>{
    const c=document.createElement('button'); c.className='item';
    c.innerHTML=`<img src="${it.src}" alt=""><span>${it.name}</span>`;
    c.addEventListener('click',()=>{
      const el=document.createElement('img');
      el.src=it.src; el.alt=it.name;
      el.style.width='28%'; el.style.left=(10+Math.random()*60)+'%';
      el.style.position='absolute'; el.style.bottom='8px'; el.style.cursor='grab';
      scene.appendChild(el); makeInteractive(el); sortDepth();
    });
    grid.appendChild(c);
  });

  // Base options
  const baseOptions=[
    {id:'none',name:'No Base',src:''},
    {id:'wood',name:'Wood Trim',src:'./assets/base_wood.svg'},
    {id:'black',name:'Matte Black',src:'./assets/base_black.svg'},
    {id:'white',name:'Matte White',src:'./assets/base_white.svg'},
    {id:'float',name:'Floating Shelf',src:'./assets/base_float.svg'}
  ];
  const baseGroup=document.querySelector('.base-grid');
  baseOptions.forEach(opt=>{
    const card=document.createElement('button'); card.className='item';
    const preview=opt.src?`<img src="${opt.src}" alt="">`:`<div style="height:66px;border-radius:8px;background:#0b141a;display:grid;place-items:center;color:#9fb5c1">None</div>`;
    card.innerHTML=`${preview}<span>${opt.name}</span>`;
    card.addEventListener('click',()=>{
      baseGroup.querySelectorAll('.item').forEach(i=>i.classList.remove('active'));
      card.classList.add('active');
      if(opt.id==='none'){ baseLayer.style.display='none'; baseImg.removeAttribute('src'); }
      else { baseLayer.style.display='block'; baseImg.src=opt.src; }
    });
    if(opt.id==='none') card.classList.add('active');
    baseGroup.appendChild(card);
  });

  // Water hue
  const hues=['#3aa7ff','#66d0ff','#53b3ff','#7ec8ff','#6ee7a7','#8ef3ff'];
  const def=hues[0];
  hues.forEach(h=>{ const s=document.createElement('button'); s.className='swatch'; s.style.background=h; s.addEventListener('click',()=>setHue(h)); palette.appendChild(s); });
  function h2r(hex,a){ const n=hex.replace('#',''); const r=parseInt(n.substr(0,2),16), g=parseInt(n.substr(2,2),16), b=parseInt(n.substr(4,2),16); return `rgba(${r},${g},${b},${a})`; }
  function setHue(h){
    document.documentElement.style.setProperty('--accent',h);
    const th=root.getAttribute('data-theme');
    if(th==='light'){
      tank.style.background=`radial-gradient(420px 190px at 50% 18%, ${h2r(h,.30)}, transparent 60%), linear-gradient(180deg, ${h2r(h,.12)}, rgba(117,205,255,.18) 60%, rgba(240,248,252,1))`;
    }else{
      tank.style.background=`radial-gradient(420px 190px at 50% 18%, ${h2r(h,.22)}, transparent 60%), linear-gradient(180deg, ${h2r(h,.12)}, rgba(18,36,45,.55) 60%, rgba(6,12,14,.85))`;
    }
  }
  setHue(def);

  // Selection + interactions
  let selected=null;
  function select(el){ if(selected) selected.classList.remove('selected'); selected=el; if(el) el.classList.add('selected'); }
  function toNum(s,f=0){ return s?parseFloat(String(s).replace('px','')):f; }
  function sortDepth(){ [...scene.querySelectorAll('img')].sort((a,b)=>toNum(a.style.bottom,8)-toNum(b.style.bottom,8)).forEach(el=>scene.appendChild(el)); }

  function makeInteractive(el){
    el.style.position='absolute'; el.style.cursor='grab';
    el.dataset.angle=el.dataset.angle||'0'; el.dataset.scale=el.dataset.scale||'1';
    let isDown=false,startX=0,startY=0;
    const apply=()=>{ el.style.transform=`translate(${el._dx||0}px,${el._dy||0}px) rotate(${el.dataset.angle}deg) scale(${el.dataset.scale})`; };
    const onMove=(e)=>{ if(!isDown) return; el._dx=e.clientX-startX; el._dy=e.clientY-startY; apply(); };
    const onUp=(e)=>{ if(!isDown) return; isDown=false; try{el.releasePointerCapture(e.pointerId)}catch(_){}
      el.style.cursor='grab'; window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); sortDepth(); };
    el.addEventListener('pointerdown', e=>{ e.preventDefault(); isDown=true; select(el); try{el.setPointerCapture(e.pointerId)}catch(_){}
      startX=e.clientX-(el._dx||0); startY=e.clientY-(el._dy||0); el.style.cursor='grabbing'; window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp); });
    el.addEventListener('wheel', e=>{ e.preventDefault(); select(el); const s=parseFloat(el.dataset.scale||'1'); const next=Math.max(.5,Math.min(2.2,s+(e.deltaY<0?0.05:-0.05))); el.dataset.scale=String(next); apply(); }, {passive:false});
    el.addEventListener('dblclick', ()=>{ el.remove(); if(selected===el) selected=null; });
    el.addEventListener('click', ()=> select(el));
    apply();
  }
  scene.querySelectorAll('img').forEach(makeInteractive);

  // Save/Load + mode
  const btnSave=document.getElementById('saveScene'), btnLoad=document.getElementById('loadScene');
  const modeRadios=document.querySelectorAll('input[name="mode"]');
  btnSave?.addEventListener('click',()=>{
    localStorage.setItem('aquascene_design', JSON.stringify([...scene.querySelectorAll('img')].map(el=>({src:el.getAttribute('src'), left:el.style.left, bottom:el.style.bottom, dx:el._dx||0, dy:el._dy||0, angle:el.dataset.angle||'0', scale:el.dataset.scale||'1'}))));
    btnSave.textContent='Saved ✓'; setTimeout(()=>btnSave.textContent='Save Design',900);
  });
  btnLoad?.addEventListener('click',()=>{
    const raw=localStorage.getItem('aquascene_design'); if(!raw) return;
    const data=JSON.parse(raw); scene.innerHTML='';
    data.forEach(d=>{ const el=document.createElement('img'); el.src=d.src; el.alt=''; el.style.position='absolute'; el.style.left=d.left||(10+Math.random()*60)+'%'; el.style.bottom=d.bottom||'8px'; el._dx=d.dx||0; el._dy=d.dy||0; el.dataset.angle=d.angle||'0'; el.dataset.scale=d.scale||'1'; el.style.transform=`translate(${el._dx}px,${el._dy}px) rotate(${el.dataset.angle}deg) scale(${el.dataset.scale})`; scene.appendChild(el); makeInteractive(el); }); sortDepth();
  });

  let anim=false;
  function loop(){ if(!anim) return;
    const rect=tank.getBoundingClientRect();
    [...scene.querySelectorAll('img')].forEach(el=>{
      if(!/fish/.test(el.src)) return;
      if(!el.dataset.vx){ el.dataset.vx=(Math.random()>.5?40:-40); el.dataset.vy=(Math.random()*.5-0.25)*30; }
      let vx=parseFloat(el.dataset.vx), vy=parseFloat(el.dataset.vy);
      el._dx=(el._dx||0)+vx*0.016; el._dy=(el._dy||0)+vy*0.016;
      const maxX=rect.width*0.45, maxY=rect.height*0.35;
      if(el._dx>maxX||el._dx<-maxX){ vx*=-1; el.dataset.vx=vx; }
      if(el._dy>maxY||el._dy<-maxY){ vy*=-1; el.dataset.vy=vy; }
      el.style.transform=`translate(${el._dx}px,${el._dy}px) rotate(${el.dataset.angle||0}deg) scale(${el.dataset.scale||1})`;
    });
    requestAnimationFrame(loop);
  }
  modeRadios.forEach(r=> r.addEventListener('change', ()=>{ anim=(document.querySelector('input[name="mode"]:checked')?.value==='animate'); if(anim) requestAnimationFrame(loop); }));

  // Reset
  resetBtn.addEventListener('click',()=>{
    scene.innerHTML=''; baseLayer.style.display='none'; baseImg.removeAttribute('src');
    document.querySelectorAll('.base-grid .item').forEach((i,k)=>i.classList.toggle('active',k===0));
  });

  // Chat
  const launcher=document.querySelector('.chat-launcher'), panel=document.querySelector('.chat-panel'), input=document.querySelector('.chat-input input'), send=document.querySelector('.chat-input button'), body=document.querySelector('.chat-body'), header=document.querySelector('.chat-header');
  function toggleChat(){panel.classList.toggle('open'); if(panel.classList.contains('open')) input.focus()}
  launcher.addEventListener('click',toggleChat); header.addEventListener('click',toggleChat);
  function addMsg(t,role='bot'){const d=document.createElement('div');d.className=`msg ${role}`;d.innerHTML=t;body.appendChild(d);body.scrollTop=body.scrollHeight}
  function sendMsg(){const v=input.value.trim();if(!v)return;addMsg(v,'user');input.value='';setTimeout(()=>{addMsg(`I'm still a <strong>beta version bot</strong> — I don't work yet, but you can go to the <a href="#configurator">Configurator</a>.`,'bot')},250)}
  send.addEventListener('click',sendMsg); input.addEventListener('keydown',e=>{if(e.key==='Enter')sendMsg()});
  if(window.matchMedia('(min-width: 821px)').matches){ panel.classList.add('open') }
  addMsg('Hi! 👋 Need help? You can configure your fish tank below.','bot');
});

// Carousel
(function(){
  const track=document.querySelector('.car-track');
  const slides=[...document.querySelectorAll('.car-slide')];
  const prev=document.querySelector('.car-btn.prev');
  const next=document.querySelector('.car-btn.next');
  const dotsC=document.querySelector('.car-dots');
  let idx=0, timer;

  if(track && slides.length){
    slides.forEach((_,i)=>{
      const b=document.createElement('button');
      b.setAttribute('role','tab');
      b.setAttribute('aria-label','Slide '+(i+1));
      b.addEventListener('click',()=>go(i,true));
      dotsC.appendChild(b);
    });

    function update(){
      track.style.transform=`translateX(-${idx*100}%)`;
      dotsC.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-selected', i===idx ? 'true' : 'false'));
    }
    function go(to, pause=false){
      idx=(to+slides.length)%slides.length;
      update();
      if(pause){resetTimer();}
    }
    function nextFn(){ go(idx+1); }
    function prevFn(){ go(idx-1, true); }
    function resetTimer(){
      clearInterval(timer);
      timer=setInterval(nextFn, 6000);
    }
    next && next.addEventListener('click',()=>nextFn());
    prev && prev.addEventListener('click',()=>prevFn());
    let startX=null;
    track.addEventListener('pointerdown',e=>{startX=e.clientX; track.setPointerCapture(e.pointerId)});
    track.addEventListener('pointerup',e=>{
      if(startX!==null){
        const dx=e.clientX-startX;
        if(Math.abs(dx)>40){ dx<0 ? nextFn() : prevFn();}
        startX=null;
      }
    });
    update();
    resetTimer();
    track.addEventListener('mouseenter',()=>clearInterval(timer));
    track.addEventListener('mouseleave',()=>resetTimer());
  }
})();
