
function enableDrag(el){
  let isDown=false, startX=0, startY=0;
  el.addEventListener('pointerdown',(e)=>{
    isDown=true; el.setPointerCapture(e.pointerId);
    startX=e.clientX - (el._dx||0); startY=e.clientY - (el._dy||0);
    el.style.cursor='grabbing';
  });
  window.addEventListener('pointermove',(e)=>{
    if(!isDown) return;
    el._dx = e.clientX - startX; el._dy = e.clientY - startY;
    el.style.transform=`translate(${el._dx}px,${el._dy}px)`;
  });
  window.addEventListener('pointerup',()=>{isDown=false; el.style.cursor='grab'});
}

document.addEventListener('DOMContentLoaded', ()=>{
  // Theme slider
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme');
  if(savedTheme){ root.setAttribute('data-theme', savedTheme); toggle.checked = (savedTheme==='light'); }
  else{ root.setAttribute('data-theme','dark'); toggle.checked = false; }
  toggle.addEventListener('change', ()=>{
    const t = toggle.checked ? 'light' : 'dark';
    root.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
  });

  // Configurator scene
  const scene = document.querySelector('.layer.objects');
  const bubbles = document.querySelector('.layer .bubbles');
  const palette = document.querySelector('.swatches');
  const resetBtn = document.querySelector('.tank-reset');
  const baseLayer = document.querySelector('.tank-base');
  const baseImg = document.querySelector('.tank-base img');

  const bv = document.createElement('img');
  bv.src = './assets/bubbles.svg'; bv.className='bubbles';
  bubbles.appendChild(bv);

  const items = [
    {id:'rock1', name:'Slate Peak', src:'./assets/rock1.svg'},
    {id:'rock2', name:'Granite Ridge', src:'./assets/rock2.svg'},
    {id:'plant1', name:'Aqua Fern', src:'./assets/plant1.svg'},
    {id:'plant2', name:'Lotus Sprig', src:'./assets/plant2.svg'},
    {id:'drift', name:'Driftwood', src:'./assets/driftwood.svg'},
    {id:'coral', name:'Soft Coral', src:'./assets/coral.svg'},
    {id:'fish1', name:'Chromis', src:'./assets/fish1.svg'}
  ];

  const grid = document.querySelector('.grid');
  items.forEach(it=>{
    const card = document.createElement('button');
    card.className='item';
    card.innerHTML = `<img src="${it.src}" alt=""><span>${it.name}</span>`;
    card.addEventListener('click', ()=>{
      const el = document.createElement('img');
      el.src = it.src; el.alt = it.name;
      el.style.width = '28%';
      el.style.left = (10 + Math.random()*60) + '%';
      el.style.position='absolute';
      el.style.bottom = '8px';
      el.style.cursor='grab';
      enableDrag(el);
      el.addEventListener('dblclick', ()=> el.remove());
      scene.appendChild(el);
    });
    grid.appendChild(card);
  });

  // Base options (non-movable)
  const baseOptions = [
    {id:'none', name:'No Base', src:''},
    {id:'wood', name:'Wood Cabinet', src:'./assets/base_wood.svg'},
    {id:'black', name:'Matte Black', src:'./assets/base_black.svg'},
    {id:'white', name:'Matte White', src:'./assets/base_white.svg'},
    {id:'float', name:'Floating Shelf', src:'./assets/base_float.svg'}
  ];
  const baseGroup = document.querySelector('.base-grid');
  baseOptions.forEach(opt=>{
    const card = document.createElement('button');
    card.className='item';
    const preview = opt.src ? `<img src="${opt.src}" alt="">` : `<div style="height:66px;border-radius:8px;background:#0b141a;display:grid;place-items:center;color:#9fb5c1">None</div>`;
    card.innerHTML = `${preview}<span>${opt.name}</span>`;
    card.addEventListener('click', ()=>{
      baseGroup.querySelectorAll('.item').forEach(i=>i.classList.remove('active'));
      card.classList.add('active');
      if(opt.id==='none'){ baseLayer.style.display='none'; baseImg.removeAttribute('src'); }
      else { baseLayer.style.display='block'; baseImg.src = opt.src; }
    });
    if(opt.id==='none'){ card.classList.add('active'); }
    baseGroup.appendChild(card);
  });

  const defaultHue = '#3aa7ff';
  const hues = ['#3aa7ff','#66d0ff','#53b3ff','#7ec8ff','#6ee7a7','#8ef3ff'];
  hues.forEach(h=>{
    const s = document.createElement('button');
    s.className='swatch'; s.style.background=h;
    s.addEventListener('click', ()=> setTankHue(h));
    palette.appendChild(s);
  });

  function hexToRgba(hex, a){
    const n = hex.replace('#','');
    const r = parseInt(n.substr(0,2),16),
          g = parseInt(n.substr(2,2),16),
          b = parseInt(n.substr(4,2),16);
    return `rgba(${r},${g},${b},${a})`;
  }
  function setTankHue(h){
    document.documentElement.style.setProperty('--accent', h);
    const tank = document.querySelector('.tank-inner');
    const theme = root.getAttribute('data-theme');
    if(theme==='light'){
      tank.style.background = `radial-gradient(400px 180px at 50% 18%, ${hexToRgba(h,0.30)}, transparent 60%), linear-gradient(180deg, ${hexToRgba(h,0.12)}, rgba(117,205,255,.18) 60%, rgba(240,248,252,1))`;
    }else{
      tank.style.background = `radial-gradient(400px 180px at 50% 18%, ${hexToRgba(h,0.22)}, transparent 60%), linear-gradient(180deg, ${hexToRgba(h,0.12)}, rgba(18,36,45,.55) 60%, rgba(6,12,14,.85))`;
    }
  }
  setTankHue(defaultHue);

  // Reset: clears objects, hue, and base
  resetBtn.addEventListener('click', ()=>{
    scene.innerHTML = '';
    setTankHue(defaultHue);
    baseLayer.style.display='none';
    baseImg.removeAttribute('src');
    baseGroup.querySelectorAll('.item').forEach((i, idx)=> i.classList.toggle('active', idx===0));
  });

  // Chat
  const launcher = document.querySelector('.chat-launcher');
  const panel = document.querySelector('.chat-panel');
  const header = document.querySelector('.chat-header');
  const input = document.querySelector('.chat-input input');
  const sendBtn = document.querySelector('.chat-input button');
  const body = document.querySelector('.chat-body');

  function toggleChat(){ panel.classList.toggle('open'); if(panel.classList.contains('open')) input.focus(); }
  launcher.addEventListener('click', toggleChat);
  header.addEventListener('click', toggleChat);
  // open by default on load
  panel.classList.add('open');

  function addMsg(text, role='bot'){
    const div = document.createElement('div');
    div.className = `msg ${role}`;
    div.innerHTML = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function handleSend(){
    const val = input.value.trim();
    if(!val) return;
    addMsg(val, 'user');
    input.value = '';
    setTimeout(()=>{
      addMsg(`I'm still a <strong>beta version bot</strong> — I don't work yet, but you can go to the <a href="#configurator">Configurator</a>.`, 'bot');
    }, 250);
  }

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e)=>{ if(e.key==='Enter') handleSend(); });

  addMsg('Hi! 👋 Need help? You can configure your fish tank below.', 'bot');
});
