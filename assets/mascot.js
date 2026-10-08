/* A single decorative cat changes perches as their edges enter the viewport. */
(() => {
  "use strict";
  const main = document.querySelector("main");
  if (!main || !window.IntersectionObserver) return;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const cat = document.createElement("div");
  cat.className = "site-mascot";
  cat.setAttribute("aria-hidden", "true");
  cat.dataset.pose = "sleep";
  cat.hidden = true;
  cat.innerHTML =
    '<div class="mascot-facing"><div class="mascot-sprite"></div></div>';
  const facing = cat.firstElementChild;
  const anchors = [];
  const visible = new Map();
  let current = null;
  let timeline = null;
  let entrance = null;

  function perch(parent, mode = "peek") {
    if (!parent) return;
    parent.classList.add("mascot-perch");
    const host = document.createElement("div");
    host.className = "mascot-host";
    host.dataset.mode = mode;
    host.setAttribute("aria-hidden", "true");
    parent.append(host);
    anchors.push(host);
    return host;
  }

  function ledge(after) {
    const line = after?.nextElementSibling;
    if (line?.classList.contains("mascot-ledge")) return perch(line, "sleep");
  }

  if (main.classList.contains("home-main")) {
    ledge(main.querySelector(".hero-copy h1"));
    main.querySelectorAll(".project-media").forEach((el) => perch(el));
    perch(main.querySelector(".studio-grid"));
    perch(main.querySelector(".research-preview-grid"));
    const about = main.querySelector(".about-preview");
    if (about) {
      about.classList.add("mascot-perch");
      const edge = document.createElement("div");
      edge.className = "mascot-section-edge";
      edge.setAttribute("aria-hidden", "true");
      about.prepend(edge);
      perch(edge);
    }
  } else {
    const intro =
      main.querySelector(".page-head, .lib-hero, .demo-page-heading") ||
      main.querySelector("h1");
    ledge(intro);
    main.querySelectorAll(".proof-gallery").forEach((el) => perch(el));
    // Reading pages retain their uninterrupted text column; the companion
    // returns at the shared footer rather than sitting on scholarly content.
  }
  perch(document.querySelector(".footer-bottom"), "sleep");
  if (!anchors.length) return;

  function stop() {
    timeline?.kill();
    entrance?.kill();
    timeline = entrance = null;
    cat.dataset.paused = "true";
    if (window.gsap)
      gsap.set([cat, facing], { clearProps: "transform,opacity" });
  }

  function animate() {
    stop();
    if (!current) return;
    const size = parseFloat(getComputedStyle(cat).width);
    const available = Math.max(0, current.clientWidth - size);
    const travel = Math.min(96, available * 0.3);
    const base =
      current.dataset.mode === "peek"
        ? available
        : Math.max(0, Math.min(available - travel, current.clientWidth * 0.48));
    cat.style.left = `${Math.round(base)}px`;
    cat.dataset.pose = current.dataset.mode === "peek" ? "peek" : "sleep";
    const canMove = !reduced.matches && Boolean(window.gsap);
    cat.dataset.paused = String(document.hidden || !canMove);
    if (!canMove) return;

    const pose = (value) => {
      cat.dataset.pose = value;
    };
    if (current.dataset.mode === "peek") {
      // The image frame covers the lower sprite; its head rises from behind it.
      entrance = gsap.fromTo(
        cat,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: "power3.out",
          paused: document.hidden,
        },
      );
      timeline = gsap
        .timeline({ repeat: -1, repeatDelay: 6, paused: true })
        .to({}, { duration: 5 })
        .to(cat, { y: -3, duration: 0.4, ease: "power2.out" })
        .to(cat, { y: 0, duration: 0.6, ease: "power2.inOut" })
        .to(cat, { y: 28, duration: 0.8, ease: "power2.inOut" })
        .to(cat, { y: 0, duration: 0.8, ease: "power2.out" });
    } else {
      entrance = gsap.fromTo(
        cat,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.35,
          paused: document.hidden,
        },
      );
      timeline = gsap
        .timeline({ repeat: -1, repeatDelay: 5, paused: true })
        .call(() => {
          pose("sleep");
          gsap.set(facing, { scaleX: 1 });
        })
        .to(cat, { x: 0, duration: 6 })
        .call(() => pose("awake"))
        .to(cat, {
          y: -2,
          duration: 0.25,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        })
        .to(cat, { y: 0, duration: 1 })
        .call(() => pose("walk"))
        .to(cat, { x: travel, duration: 4, ease: "none", snap: { x: 2 } })
        .call(() => pose("awake"))
        .to(cat, { x: travel, duration: 1.5 })
        .call(() => {
          gsap.set(facing, { scaleX: -1 });
          pose("walk");
        })
        .to(cat, { x: 0, duration: 4, ease: "none", snap: { x: 2 } })
        .call(() => {
          gsap.set(facing, { scaleX: 1 });
          pose("sleep");
        });
    }
    if (!document.hidden) timeline.play();
  }

  function choose() {
    let best = null;
    let bestScore = -Infinity;
    visible.forEach((entry, host) => {
      if (!entry.isIntersecting) return;
      const rect = host.getBoundingClientRect();
      if (
        rect.bottom <= 0 ||
        rect.top >= innerHeight ||
        rect.right <= 0 ||
        rect.left >= innerWidth
      )
        return;
      const score =
        entry.intersectionRatio * 2 -
        Math.abs(rect.top + rect.height / 2 - innerHeight * 0.55) / innerHeight;
      if (score > bestScore) {
        best = host;
        bestScore = score;
      }
    });
    if (best === current) return;
    stop();
    current = best;
    cat.hidden = !best;
    if (best) {
      best.append(cat);
      animate();
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => visible.set(entry.target, entry));
      choose();
    },
    { rootMargin: "0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
  );
  anchors.forEach((host) => observer.observe(host));
  const onVisibility = () => {
    cat.dataset.paused = String(document.hidden || reduced.matches);
    if (document.hidden) {
      timeline?.pause();
      entrance?.pause();
    } else {
      timeline?.resume();
      entrance?.resume();
    }
  };
  const onResize = () => {
    if (current) animate();
  };
  reduced.addEventListener("change", animate);
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("resize", onResize);
  window.addEventListener(
    "pagehide",
    (event) => {
      if (event.persisted) return;
      stop();
      observer.disconnect();
      reduced.removeEventListener("change", animate);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    },
    { once: true },
  );
})();
