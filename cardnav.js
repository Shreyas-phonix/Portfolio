/* CardNav (React Bits) — vanilla JS port with identical GSAP timeline behavior */
(() => {
  const nav = document.querySelector(".card-nav");
  if (!nav) return;

  const container = document.querySelector(".card-nav-container");
  const hamburger = nav.querySelector(".hamburger-menu");
  const cards = [...nav.querySelectorAll(".nav-card")];
  const content = nav.querySelector(".card-nav-content");
  const ease = "power3.out";
  let isExpanded = false;
  let tl = null;

  const calculateHeight = () => {
    if (!window.matchMedia("(max-width: 768px)").matches) return 260;
    // measure content on mobile (desktop height is fixed at 260)
    const was = { visibility: content.style.visibility, pointerEvents: content.style.pointerEvents, position: content.style.position, height: content.style.height };
    content.style.visibility = "visible";
    content.style.pointerEvents = "auto";
    content.style.position = "static";
    content.style.height = "auto";
    void content.offsetHeight; // force reflow
    const h = 60 + content.scrollHeight + 16;
    content.style.visibility = was.visibility;
    content.style.pointerEvents = was.pointerEvents;
    content.style.position = was.position;
    content.style.height = was.height;
    return h;
  };

  const createTimeline = () => {
    gsap.killTweensOf([nav, ...cards]);
    if (!isExpanded) {
      gsap.set(nav, { height: 60, overflow: "hidden" });
      gsap.set(cards, { y: 50, opacity: 0 });
    }
    const t = gsap.timeline({ paused: true });
    t.to(nav, { height: calculateHeight, duration: .4, ease });
    t.to(cards, { y: 0, opacity: 1, duration: .4, ease, stagger: .08 }, "-=0.1");
    return t;
  };

  const rebuild = () => {
    if (!tl) return;
    if (isExpanded) {
      gsap.set(nav, { height: calculateHeight() });
      tl.kill();
      tl = createTimeline();
      tl.progress(1);
    } else {
      tl.kill();
      tl = createTimeline();
    }
  };
  window.addEventListener("resize", rebuild);

  const closeMenu = () => {
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
    nav.querySelector(".card-nav-content").setAttribute("aria-hidden", "true");
    isExpanded = false;
    // animate back down regardless of hidden-tab rAF throttling
    gsap.killTweensOf(nav);
    gsap.to(nav, { height: 60, duration: .35, ease, onComplete: () => { tl = createTimeline(); } });
    gsap.to(cards, { y: 50, opacity: 0, duration: .3, ease, stagger: .05 });
  };

  const toggleMenu = () => {
    if (!tl) return;
    if (!isExpanded) {
      tl.kill();
      tl = createTimeline();
      hamburger.classList.add("open");
      nav.classList.add("open");
      hamburger.setAttribute("aria-expanded", "true");
      nav.querySelector(".card-nav-content").setAttribute("aria-hidden", "false");
      isExpanded = true;
      tl.play(0);
    } else {
      closeMenu();
    }
  };

  hamburger.addEventListener("click", toggleMenu);
  hamburger.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleMenu(); }
  });

  // close the menu after choosing a link
  container.querySelectorAll(".nav-card-link").forEach(a => {
    a.addEventListener("click", e => {
      const href = a.getAttribute("href");
      if (isExpanded) toggleMenu();
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), isExpanded ? 350 : 0);
      }
    });
  });

  tl = createTimeline();
})();
