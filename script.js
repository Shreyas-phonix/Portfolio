gsap.registerPlugin(ScrollTrigger);

// Entrance animations
gsap.from(".hero-copy > *",{y:40,opacity:0,duration:1,stagger:.12,ease:"power3.out"});
gsap.from(".hero-side",{y:30,opacity:0,duration:1.2,delay:.5,ease:"power3.out"});

document.querySelectorAll(".reveal").forEach(el=>{
  gsap.fromTo(el,{y:50,opacity:0},{y:0,opacity:1,duration:1,ease:"power3.out",
    scrollTrigger:{trigger:el,start:"top 85%",once:true}});
});

// 3D tilt on project cards & design tiles
document.querySelectorAll(".project,.design-tile").forEach(card=>{
  card.addEventListener("mousemove",e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    gsap.to(card,{rotateY:x*6,rotateX:-y*5,transformPerspective:900,duration:.4,ease:"power2.out",overwrite:"auto"});
  });
  card.addEventListener("mouseleave",()=>{
    gsap.to(card,{rotateX:0,rotateY:0,duration:.7,ease:"power3.out",overwrite:"auto"});
  });
});

// Animated stat counters
document.querySelectorAll(".stat").forEach(el=>{
  const target=parseFloat(el.dataset.target), decimals=parseInt(el.dataset.decimals||"0",10), pad=parseInt(el.dataset.pad||"0",10);
  const fmt=v=>{
    let s=v.toFixed(decimals);
    if(pad)s=s.padStart(pad,"0");
    return s;
  };
  const obj={v:0};
  gsap.to(obj,{v:target,duration:1.6,ease:"power2.out",
    scrollTrigger:{trigger:el,start:"top 90%",once:true},
    onUpdate:()=>{el.textContent=fmt(obj.v);}});
});

// Copy email button
const copyBtn=document.querySelector(".copy-btn");
if(copyBtn){
  copyBtn.addEventListener("click",async()=>{
    try{
      await navigator.clipboard.writeText("pvsaishreyas2005@gmail.com");
      copyBtn.textContent="Copied ✓";
      copyBtn.classList.add("copied");
      setTimeout(()=>{copyBtn.textContent="Copy email";copyBtn.classList.remove("copied");},1800);
    }catch(_){
      copyBtn.textContent="⌘C :)";
      setTimeout(()=>copyBtn.textContent="Copy email",1500);
    }
  });
}

// "Click through" toast — teaches visitors that cards & links open live sites
const toast=document.getElementById("tapToast");
if(toast){
  const KEY="tapHintShown";
  let timer=null;
  const show=()=>{
    if(sessionStorage.getItem(KEY))return;
    sessionStorage.setItem(KEY,"1");
    toast.classList.add("show");
    clearTimeout(timer);
    timer=setTimeout(()=>toast.classList.remove("show"),2000);
  };
  // one reminder per visit: re-arm when the page is freshly loaded (incl. back-nav)
  window.addEventListener("pagehide",()=>sessionStorage.removeItem(KEY));
  // 1) the moment a visitor hovers/touches anything tappable
  document.querySelectorAll(".project,.design-tile,.floating-card,.link-hint").forEach(el=>{
    el.addEventListener("mouseenter",show,{once:true});
    el.addEventListener("touchstart",show,{once:true,passive:true});
  });
  // 2) or on first scroll / shortly after arriving
  window.addEventListener("scroll",show,{once:true,passive:true});
  setTimeout(show,2500);
}

// Seamless video loop: two stacked copies crossfading forever (no visible cut, no stall)
(() => {
  const pair = document.querySelector(".video-visual");
  if (!pair) return;
  const vids = [...pair.querySelectorAll(".tile-video")];
  if (vids.length < 2) return;
  let front = vids[0], back = vids[1];
  let fading = false;

  const play = v => { const p = v.play(); if (p && p.catch) p.catch(()=>{}); };

  front.style.opacity = "1";
  back.style.opacity = "0";

  const swap = () => {
    front.pause();
    const t = front; front = back; back = t;
    front.style.opacity = "1";   // explicit inline always — never CSS defaults
    back.style.opacity = "0";
    back.currentTime = 0;
    fading = false;
  };

  // watchdog: drives the whole cycle; fires even if timeupdate is skipped
  setInterval(() => {
    if (!front.duration || Number.isNaN(front.duration)) return;
    const remaining = front.duration - front.currentTime;
    if (remaining <= 0.75 && back.paused) { back.currentTime = 0; play(back); }
    if (remaining <= 0.6 && !fading) {
      fading = true;
      back.style.opacity = "1";
      front.style.opacity = "0";
    }
    if (front.ended || remaining <= 0.03) swap();
  }, 120);

  // absolute fallback: if the front clip ever hits 'ended', swap instantly
  vids.forEach(v => v.addEventListener("ended", () => { if (v === front) swap(); }));

  // restart playback if the browser blocked/stalled it (autoplay policies, tab sleep)
  const kick = () => {
    if (front.paused) play(front);
    if (front.duration && front.duration - front.currentTime <= 0.75 && back.paused) play(back);
  };
  window.addEventListener("click", kick);
  document.addEventListener("visibilitychange", kick);
  kick();
})();

// Smooth anchor scrolling (instant fallback when tab is hidden — rAF smooth-scroll never ticks in background tabs)
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click",e=>{
    const target=document.querySelector(a.getAttribute("href"));
    if(target){e.preventDefault();target.scrollIntoView({behavior:document.hidden?"auto":"smooth"});}
  });
});
