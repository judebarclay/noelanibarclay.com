(function(){
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  // nav
  const nav=$('.nav'); const onScroll=()=>nav&&nav.classList.toggle('scrolled',scrollY>8); addEventListener('scroll',onScroll,{passive:true}); onScroll();
  const mb=$('.menu-btn'), links=$('.links'); if(mb) mb.onclick=()=>{const o=links.classList.toggle('open'); mb.setAttribute('aria-expanded',o)};

  // hero letters
  $$('[data-split]').forEach(el=>{const t=el.textContent; el.textContent=''; el.setAttribute('aria-label',t); [...t].forEach((c,i)=>{const s=document.createElement('span'); s.className='ch'; s.setAttribute('aria-hidden','true'); s.textContent=c===' '?' ':c; s.style.animationDelay=(+(el.dataset.delay||0)+i*0.045)+'s'; el.appendChild(s);});});

  setTimeout(()=>$$('[data-shine]').forEach(el=>{el.textContent=el.getAttribute('aria-label'); el.classList.add('shine-on');}),1400);
  // autoplay videos when visible
  const play=v=>{if(!v.src&&v.dataset.src){v.src=v.dataset.src;} const p=v.play(); if(p) p.catch(()=>{});};
  window.__observeVideos=(root=document)=>{
    const vids=$$('video[data-src]',root).filter(v=>!v.__obs);
    if(!('IntersectionObserver' in window)){vids.forEach(play);return;}
    vids.forEach(v=>{v.__obs=1; io.observe(v);});
  };
  const io=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target; if(e.isIntersecting){ if(!reduce) play(v); else if(!v.src){v.src=v.dataset.src; v.preload='metadata';} } else if(v.src) v.pause();}),{rootMargin:'200px 0px',threshold:0.15});
  __observeVideos();

  // reveal
  const ro=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in'); ro.unobserve(e.target);}}),{threshold:.12});
  $$('.reveal').forEach(el=>ro.observe(el));

  // rails arrows
  $$('[data-rail]').forEach(b=>b.onclick=()=>{const r=document.getElementById(b.dataset.rail); r.scrollBy({left:+b.dataset.dir*r.clientWidth*.8,behavior:'smooth'});});

  // lightbox (videos with sound)
  const lb=$('#lb');
  if(lb){
    const stage=$('.lb-stage',lb); let list=[],idx=0,last=null;
    const render=()=>{ $$('video,img',stage).forEach(n=>{if(n.pause)n.pause(); n.remove();}); const it=list[idx];
      if(it.v){const v=document.createElement('video'); v.src=it.v; v.poster=it.p||''; v.controls=true; v.playsInline=true; v.autoplay=true; stage.prepend(v); v.play().catch(()=>{});} else {const im=document.createElement('img'); im.src=it.p; im.alt=it.t||''; stage.prepend(im);}
      $('.lb-title',lb).innerHTML=`${esc(it.t||'')}<small>${esc(it.s||'')}</small>`;
      $('.lb-cap',lb).innerHTML=it.u?`<a href="${it.u}" target="_blank" rel="noopener">View on Instagram ↗</a>`:'';
      $$('.lb-nav',lb).forEach(n=>n.hidden=list.length<2);
    };
    const open=(l,i)=>{list=l; idx=i; last=document.activeElement; lb.hidden=false; document.body.style.overflow='hidden'; $$('video').forEach(v=>{if(!stage.contains(v)) v.pause();}); render(); $('.lb-x',lb).focus();};
    const close=()=>{$$('video',stage).forEach(v=>v.pause()); $$('video,img',stage).forEach(n=>n.remove()); lb.hidden=true; document.body.style.overflow=''; last&&last.focus();};
    const step=d=>{idx=(idx+d+list.length)%list.length; render();};
    $('.lb-x',lb).onclick=close; $('.lb-prev',lb).onclick=()=>step(-1); $('.lb-next',lb).onclick=()=>step(1);
    lb.addEventListener('click',e=>{if(e.target===lb||e.target===stage) close();});
    addEventListener('keydown',e=>{if(lb.hidden)return; if(e.key==='Escape')close(); if(e.key==='ArrowRight')step(1); if(e.key==='ArrowLeft')step(-1);});
    let tx=null; stage.addEventListener('touchstart',e=>tx=e.touches[0].clientX,{passive:true}); stage.addEventListener('touchend',e=>{if(tx==null)return; const dx=e.changedTouches[0].clientX-tx; if(Math.abs(dx)>50) step(dx<0?1:-1); tx=null;});
    document.addEventListener('click',e=>{const c=e.target.closest('[data-lb]'); if(!c) return; e.preventDefault(); const grp=$$(`[data-lb="${c.dataset.lb}"]`); open(grp.map(g=>({v:g.dataset.v,p:g.dataset.p,t:g.dataset.t,s:g.dataset.s,u:g.dataset.u})),grp.indexOf(c));});
  }

  // contact form -> email
  const f=$('#inquiry');
  if(f) f.addEventListener('submit',e=>{e.preventDefault(); const d=Object.fromEntries(new FormData(f)); const subj=`Partnership inquiry${d.brand?' — '+d.brand:''}`; const body=`Hi Noelani,\n\n${d.idea||''}\n\nType: ${d.type||''}\nBudget: ${d.budget||''}\n\n${d.name||''}${d.brand?'\n'+d.brand:''}\n${d.email||''}`; location.href=`mailto:noelanimendoza23@gmail.com?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`; const m=$('#sent'); if(m) m.hidden=false;});
  $$('[data-copy]').forEach(b=>b.onclick=async()=>{const t=b.dataset.copy; try{await navigator.clipboard.writeText(t); b.textContent='Copied';}catch(e){b.textContent=t;} setTimeout(()=>b.textContent='Copy email',2000);});

  function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
  window.__esc=esc;
})();
