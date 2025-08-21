// Carousel + dots + auto + responsive
(function(){
  const root=document.querySelector('.tcar'); if(!root) return;
  const track=root.querySelector('.tcar-track');
  const slides=[...root.querySelectorAll('.tcar-slide')];
  const prev=root.querySelector('.tcar-btn.prev');
  const next=root.querySelector('.tcar-btn.next');
  const dots=root.querySelector('.tcar-dots');
  let idx=0, timer;

  slides.forEach((_,i)=>{
    const b=document.createElement('button');
    b.addEventListener('click',()=>{ idx=i; update(); reset(); });
    dots.appendChild(b);
  });

  function width(){ return root.getBoundingClientRect().width }
  
function update(){
    slides.forEach((s,i)=> s.classList.toggle('active', i===idx));

    track.style.transform='translateX(' + (-idx*width()) + 'px)';
    [...dots.children].forEach((b,i)=> b.classList.toggle('active', i===idx));
  }
  function nextFn(){ idx=(idx+1)%slides.length; update(); }
  function prevFn(){ idx=(idx-1+slides.length)%slides.length; update(); }
  function start(){ timer=setInterval(nextFn, 6000); }
  function reset(){ clearInterval(timer); start(); }

  prev.addEventListener('click', ()=>{ prevFn(); reset(); });
  next.addEventListener('click', ()=>{ nextFn(); reset(); });
  window.addEventListener('resize', ()=> requestAnimationFrame(update));
  update(); start();

  // Pause on tab hidden / reduced motion
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) { clearInterval(timer); }
  document.addEventListener('visibilitychange', ()=>{
    if (document.hidden) { clearInterval(timer); }
    else if (!prefersReduced) { reset(); }
  });

})();

// Gallery lightbox
(function(){
  const lb=document.getElementById('lightbox'); if(!lb) return;
  const img=lb.querySelector('img'); const close=()=>{ lb.classList.remove('open'); img.src=''; };
  document.querySelectorAll('.gallery-grid img').forEach(el=> el.addEventListener('click', ()=>{ img.src=el.src; lb.classList.add('open'); }));
  lb.addEventListener('click', e=>{ if(e.target===lb) close(); });
  document.querySelector('.lb-close').addEventListener('click', close);
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') close(); });
})();

// Mobile nav toggle
(function(){
  const btn = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav');
  const links = document.querySelector('.nav-links');
  if(!btn || !links) return;
  btn.addEventListener('click', ()=>{
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();


// Header.nav mobile toggle
(function(){
  const header = document.querySelector('header.nav');
  const btn = header && header.querySelector('.nav-toggle');
  if(!header || !btn) return;
  btn.addEventListener('click', ()=>{
    const open = header.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();
