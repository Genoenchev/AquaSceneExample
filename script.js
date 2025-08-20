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