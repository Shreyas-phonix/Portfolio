gsap.registerPlugin(ScrollTrigger);

// Entrance animations
gsap.from(".hero-copy > *",{y:40,opacity:0,duration:1,stagger:.12,ease:"power3.out"});
gsap.from(".hero-side",{y:30,opacity:0,duration:1.2,delay:.5,ease:"power3.out"});

document.querySelectorAll(".reveal").forEach(el=>{
  gsap.fromTo(el,{y:50,opacity:0},{y:0,opacity:1,duration:1,ease:"power3.out",
    scrollTrigger:{trigger:el,start:"top 85%",once:true}});
});

// 3D tilt on project cards
document.querySelectorAll(".project").forEach(card=>{
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

// Active nav link on scroll
const navLinks=[...document.querySelectorAll('.nav nav a')];
const targets=navLinks.map(a=>document.querySelector(a.getAttribute("href"))).filter(Boolean);
const setActive=id=>navLinks.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+id));
targets.forEach(t=>{
  ScrollTrigger.create({trigger:t,start:"top 55%",end:"bottom 55%",
    onToggle:self=>{if(self.isActive)setActive(t.id);}});
});
ScrollTrigger.create({trigger:document.body,start:0,end:"max",
  onLeaveBack:()=>setActive("")});

// Smooth anchor scrolling
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click",e=>{
    const target=document.querySelector(a.getAttribute("href"));
    if(target){e.preventDefault();target.scrollIntoView({behavior:"smooth"});}
  });
});
