/* One companion, curated scenes, native touch/keyboard interaction. */
(async () => {
  "use strict";
  const main = document.querySelector("main");
  if (!main || !window.gsap || !window.IntersectionObserver) return;
  const scriptURL = document.currentScript.src;
  // Decode once before displaying anything. Integer source rectangles avoid
  // percentage rounding/adjacent-frame bleed in mobile sprite backgrounds.
  const atlas = new Image();
  atlas.src = new URL("mascot/cat-atlas.webp", scriptURL).href;
  try {
    await atlas.decode();
  } catch {
    return;
  }
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const coarse = matchMedia("(pointer: coarse)");
  const phone = matchMedia("(max-width: 767px)");
  const pageKey = document.body.className;
  const pageSeed = [...pageKey].reduce(
    (n, c) => (n * 31 + c.charCodeAt(0)) >>> 0,
    7,
  );
  let visits = 0;
  try {
    visits = Number(sessionStorage.getItem(`cat-visit:${pageKey}`)) || 0;
    sessionStorage.setItem(`cat-visit:${pageKey}`, String(visits + 1));
  } catch {
    /* Private browsing still gets the same complete experience. */
  }

  const position = document.createElement("div");
  position.className = "mascot-position";
  const cat = document.createElement("button");
  cat.type = "button";
  cat.className = "site-mascot";
  cat.setAttribute("aria-label", "Pet the pixel cat");
  cat.hidden = true;
  cat.innerHTML = `<span class="mascot-facing" aria-hidden="true">
    <canvas class="mascot-sprite" width="96" height="96"></canvas>
    <span class="cat-snore"><i></i><i></i></span>
    <svg class="cat-bubble" viewBox="0 0 20 20"><path d="M6 2h8v2h4v4h2v6h-2v4h-4v2H6v-2H2v-4H0V8h2V4h4z"/><path class="bubble-shine" d="M6 5h5v2H6v4H4V7h2z"/></svg>
    <span class="cat-pop"><i></i><i></i><i></i><i></i></span>
    <svg class="cat-heart" viewBox="0 0 12 12"><path d="M1 2h4v2h2V2h4v2h1v3h-2v2H8v2H4V9H2V7H0V4h1z"/></svg>
    <span class="cat-steam"><i></i><i></i></span>
  </span>`;
  position.append(cat);
  const facing = cat.firstElementChild;
  const canvas = cat.querySelector("canvas");
  const painter = canvas.getContext("2d");
  if (!painter) return;
  painter.imageSmoothingEnabled = false;
  const status = document.createElement("span");
  status.className = "cat-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  document.body.append(status);

  const scenes = [];
  let current = null;
  let story = null;
  let reaction = null;
  let snapshot = null;
  let queued = false;
  let destroyed = false;
  let direction = 1;
  let poseName = "sleep";
  let frameIndex = 16;
  let paintedFrame = -1;
  let walkElapsed = 0;
  let ticking = false;
  const travel = { fraction: 0.5 };
  let pokes = [];
  let lastMood = "";
  let haptics = null;
  let hapticsPromise = null;
  let activated = false;
  let lastPulse = -Infinity;
  let lastAmbient = -Infinity;

  // Vendored, pinned WebHaptics. Nothing buzzes before a real interaction.
  function loadHaptics() {
    if (!coarse.matches || reduced.matches) return Promise.resolve(null);
    return (hapticsPromise ||= import(
      new URL("vendor/web-haptics/index.mjs", scriptURL).href
    )
      .then(({ WebHaptics }) => {
        if (destroyed) return null;
        return (haptics = new WebHaptics({ debug: false, showSwitch: false }));
      })
      .catch(() => null));
  }
  if (coarse.matches && !reduced.matches) loadHaptics();
  function pulse(kind = "pet") {
    if (!activated || reduced.matches || !coarse.matches || document.hidden)
      return;
    const now = performance.now();
    if (now - lastPulse < 650) return;
    if (kind === "ambient" && now - lastAmbient < 14000) return;
    lastPulse = now;
    if (kind === "ambient") lastAmbient = now;
    loadHaptics().then((engine) => {
      if (!engine || document.hidden || reduced.matches || destroyed) return;
      const pattern =
        kind === "grumpy"
          ? [
              { duration: 9, intensity: 0.3 },
              { delay: 65, duration: 9, intensity: 0.3 },
            ]
          : [{ duration: kind === "ambient" ? 8 : 12, intensity: 0.3 }];
      engine.trigger(pattern);
    });
  }
  function unlock(event) {
    if (event.isTrusted) activated = true;
  }
  document.addEventListener("pointerdown", unlock, { passive: true });
  document.addEventListener("keydown", unlock);

  function addScene(parent, kind, index = 0, bottom = false) {
    if (!parent) return;
    parent.classList.add("mascot-perch");
    parent.removeAttribute("aria-hidden");
    const host = document.createElement("div");
    host.className = "mascot-host";
    host.dataset.scene = kind;
    if (bottom) host.classList.add("mascot-host-bottom");
    parent.append(host);
    const seed = (pageSeed + visits * 13 + index * 19) >>> 0;
    const scene = {
      host,
      kind,
      variant: seed % 6,
      start: 0.12 + (seed % 17) * 0.045,
      seen: false,
      pulsed: false,
    };
    host.dataset.variant = String(scene.variant);
    scenes.push(scene);
  }
  // Sibling boundaries keep buttons outside linked cards and leave text untouched.
  function boundaryBefore(element, index) {
    if (!element) return;
    const edge = document.createElement("div");
    edge.className = "mascot-cue-edge";
    element.before(edge);
    addScene(edge, "cue", index);
  }
  addScene(main.querySelector(".intro-mascot-ledge"), "opening");
  if (main.classList.contains("home-main")) {
    addScene(main.querySelector(".work-intro"), "cue", 1, true);
    addScene(main.querySelector(".studio-grid"), "cue", 2);
    addScene(main.querySelector(".research-preview-grid"), "cue", 3);
    addScene(main.querySelector(".about-preview"), "cue", 4);
  } else if (main.classList.contains("work-main")) {
    addScene(main.querySelector("#recruiterai"), "cue", 1);
    addScene(main.querySelector("#asksql"), "cue", 2);
  } else if (main.classList.contains("about-main")) {
    addScene(main.querySelector(".stats-grid"), "cue", 1);
    addScene(main.querySelector(".current-list"), "cue", 2);
  } else if (main.classList.contains("research-library")) {
    boundaryBefore(main.querySelectorAll(".paper-card")[3], 1);
  } else if (main.classList.contains("project-main")) {
    boundaryBefore(
      main.querySelector("article .paper-card, article .placeholder"),
      1,
    );
  } else if (main.classList.contains("research-article")) {
    const figure = main.querySelector(".figure");
    if (figure) addScene(figure, "cue", 1);
    else boundaryBefore(main.querySelector("article > h2:nth-of-type(2)"), 1);
  } else if (main.classList.contains("demo-main")) {
    // Keep the companion outside the scrolling board without adding grid items.
    if (main.querySelector(".board"))
      addScene(main.querySelector(".layout"), "cue", 1);
    else boundaryBefore(main.querySelector(".candidates-grid"), 1);
  }
  addScene(document.querySelector(".footer-bottom"), "ending");
  if (!scenes.length) return;

  function renderPosition() {
    if (!current) return;
    const size = cat.getBoundingClientRect().width || 96;
    const distance = Math.max(0, current.host.clientWidth - size);
    position.style.transform = `translate3d(${distance * travel.fraction}px,0,0)`;
  }
  function setFacing(value) {
    direction = value;
    facing.style.transform = `scaleX(${value})`;
  }
  function pose(name, frame) {
    if (poseName !== name && name === "walk") walkElapsed = 0;
    poseName = name;
    frameIndex = frame;
    cat.dataset.pose = name;
    cat.dataset.frame = String(frame);
    paintFrame(frame);
    syncFrames();
  }
  function paintFrame(frame) {
    if (paintedFrame === frame) return;
    painter.clearRect(0, 0, 96, 96);
    painter.drawImage(atlas, frame * 96, 0, 96, 96, 0, 0, 96, 96);
    paintedFrame = frame;
    canvas.dataset.frame = String(frame);
  }
  function animateFrame(_time, elapsed) {
    if (poseName !== "walk" || cat.dataset.paused === "true") return;
    walkElapsed += Math.min(elapsed, 100) / 1000;
    paintFrame(Math.floor(walkElapsed / 0.1) % 8);
  }
  function syncFrames() {
    const active =
      poseName === "walk" &&
      cat.dataset.paused !== "true" &&
      !document.hidden &&
      !reduced.matches;
    if (active && !ticking) gsap.ticker.add(animateFrame);
    if (!active && ticking) gsap.ticker.remove(animateFrame);
    ticking = active;
  }
  function walk(tl, target, speed = 36) {
    const from = tl.walkFrom ?? travel.fraction;
    const distance = Math.max(0, current.host.clientWidth - cat.offsetWidth);
    const duration = Math.max(
      1.1,
      (Math.abs(target - from) * distance) / speed,
    );
    tl.call(() => {
      setFacing(target > from ? 1 : -1);
      pose("walk", 0);
    });
    tl.to(travel, {
      fraction: target,
      duration,
      ease: "none",
      onUpdate: renderPosition,
    });
    tl.walkFrom = target;
  }
  function groom(tl, rounds = 3) {
    for (let n = 0; n < rounds; n++) {
      tl.call(() => pose("groom", 8)).to({}, { duration: 0.48 });
      tl.call(() => pose("groom", 9)).to({}, { duration: 0.55 });
    }
    tl.call(() => pose("turn", 10)).to({}, { duration: 0.45 });
    tl.call(() => {
      setFacing(1);
      pose("gaze", 11);
    });
  }
  function retire() {
    if (current?.kind !== "cue") return;
    current.seen = true;
    cat.hidden = true;
    queueChoose();
  }
  function buildStory(scene) {
    cat.hidden = false;
    cat.dataset.scene = scene.kind;
    cat.dataset.reaction = "";
    cat.dataset.bubble = "";
    gsap.set(cat, { y: 0, rotation: 0, scale: 1, clearProps: "opacity" });
    setFacing(1);
    travel.fraction =
      scene.kind === "opening"
        ? 0.45
        : scene.kind === "ending"
          ? 0.72
          : scene.start;
    renderPosition();
    if (reduced.matches) {
      pose(
        scene.kind === "opening" ? "sleep" : "gaze",
        scene.kind === "opening" ? 16 : 11,
      );
      return;
    }
    story = gsap.timeline({ paused: true });
    if (scene.kind === "opening") {
      pose("sleep", 16);
      cat.dataset.bubble = "grow";
      story
        .to({}, { duration: 5.8 })
        .call(() => {
          cat.dataset.bubble = "pop";
          pulse("ambient");
        })
        .to({}, { duration: 0.23 })
        .call(() => {
          cat.dataset.bubble = "";
          pose("startled", 14);
        })
        .to(cat, {
          y: phone.matches ? -2 : -13,
          duration: 0.18,
          ease: "power2.out",
        })
        .to(cat, { y: 0, duration: 0.26, ease: "power2.in" })
        .call(() => pose("stretch", 15))
        .to({}, { duration: 0.8 })
        .addLabel("stroll");
      walk(story, 0.95);
      story.call(() => pose("awake", 17)).to({}, { duration: 0.8 });
      walk(story, 0.04);
      story.call(() => pose("awake", 17)).to({}, { duration: 0.7 });
      walk(story, 0.48);
      groom(story, 2);
    } else if (scene.kind === "ending") {
      groom(story, 4);
    } else {
      // Mobile entrances stay in the space vetted below; no sideways path
      // through a paragraph to reach an otherwise clear resting position.
      const v = phone.matches ? [0, 1, 3, 4][scene.variant % 4] : scene.variant;
      pose("peek", 18);
      // Six entrances: peek, hop, side-step, shy lean, stretch, and a quick stroll.
      if (v === 0) {
        gsap.set(cat, { y: 70 });
        story.to(cat, { y: 0, duration: 0.75, ease: "power2.out" });
      } else if (v === 1) {
        pose("startled", 14);
        gsap.set(cat, { y: 75, rotation: -8 });
        story
          .to(cat, { y: -10, rotation: 4, duration: 0.5, ease: "power2.out" })
          .to(cat, { y: 0, rotation: 0, duration: 0.3 });
      } else if (v === 2) {
        travel.fraction = scene.start > 0.5 ? 0.98 : 0.02;
        renderPosition();
        walk(story, scene.start, 62);
      } else if (v === 3) {
        gsap.set(cat, { y: 62, rotation: scene.start > 0.5 ? -12 : 12 });
        story
          .to(cat, { y: 14, duration: 0.75, ease: "power2.out" })
          .to(cat, { y: 0, rotation: 0, duration: 0.4 });
      } else if (v === 4) {
        pose("stretch", 15);
        gsap.set(cat, { y: 78 });
        story
          .to(cat, { y: 0, duration: 0.6, ease: "power2.out" })
          .to({}, { duration: 0.5 });
      } else {
        pose("awake", 17);
        gsap.set(cat, { y: 80 });
        story.to(cat, { y: 0, duration: 0.35, ease: "power2.out" });
        walk(
          story,
          scene.start > 0.5 ? scene.start - 0.14 : scene.start + 0.14,
          50,
        );
      }
      story
        .call(() => pose("gaze", 11))
        .to({}, { duration: 2.2 })
        .call(() => pose("peek", 18))
        .to(cat, { y: 84, duration: 0.65, ease: "power2.in" })
        .call(retire);
      if (!scene.pulsed) {
        scene.pulsed = true;
        pulse("ambient");
      }
    }
    story.play();
    syncPlayback();
  }

  function isOnscreen(element) {
    const r = element.getBoundingClientRect();
    return (
      r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth
    );
  }
  function mobileClearance(scene) {
    if (!phone.matches || scene.kind !== "cue") return true;
    const host = scene.host.getBoundingClientRect();
    const key = `${innerWidth}:${host.width}:${Math.round(host.top + scrollY)}:${document.documentElement.scrollHeight}`;
    if (scene.clearanceKey === key) return scene.clearance;
    const size = parseFloat(
      getComputedStyle(scene.host).getPropertyValue("--mascot-size"),
    );
    const available = Math.max(0, host.width - size);
    const overlaps = (a, b) =>
      a.left < b.right &&
      a.right > b.left &&
      a.top < b.bottom &&
      a.bottom > b.top;
    const band = {
      left: host.left,
      right: host.right,
      top: host.top - 18,
      bottom: host.top + size * 0.8125 + 2,
    };
    const occupied = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          return node.textContent.trim() &&
            !node.parentElement.closest(
              "script, style, .mascot-host, .cat-status, dialog:not([open])",
            )
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        },
      },
    );
    const range = document.createRange();
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!overlaps(band, node.parentElement.getBoundingClientRect())) continue;
      range.selectNodeContents(node);
      for (const rect of range.getClientRects()) {
        if (rect.width && rect.height && overlaps(band, rect))
          occupied.push(rect);
      }
    }
    document
      .querySelectorAll(
        "main a, main button, main input, main textarea, main summary, footer a",
      )
      .forEach((element) => {
        if (element.closest(".mascot-host")) return;
        const rect = element.getBoundingClientRect();
        if (rect.width && rect.height && overlaps(band, rect))
          occupied.push(rect);
      });
    scene.clearanceKey = key;
    scene.clearance = false;
    for (const fraction of [scene.start, 0.96, 0.04, 0.72, 0.28]) {
      const left = host.left + available * fraction;
      const area = { ...band, left: left - 12, right: left + size + 12 };
      if (occupied.some((rect) => overlaps(area, rect))) continue;
      scene.start = fraction;
      scene.clearance = true;
      break;
    }
    scene.host.dataset.mobileClearance = scene.clearance ? "clear" : "blocked";
    return scene.clearance;
  }
  function choose() {
    queued = false;
    if (destroyed) return;
    // A visible character owns its scene, regardless of scroll direction or ratio.
    if (current && !cat.hidden && isOnscreen(cat)) {
      syncPlayback();
      return;
    }
    const candidates = scenes.filter((s) => {
      if (s.seen) return false;
      const r = s.host.getBoundingClientRect();
      // Delay arrival until the ledge has cleared the sticky navigation.
      return (
        r.bottom > 115 &&
        r.top < innerHeight - 24 &&
        r.right > 0 &&
        r.left < innerWidth &&
        mobileClearance(s)
      );
    });
    candidates.sort(
      (a, b) =>
        Math.abs(a.host.getBoundingClientRect().bottom - innerHeight * 0.65) -
        Math.abs(b.host.getBoundingClientRect().bottom - innerHeight * 0.65),
    );
    const next = candidates[0];
    if (!next || (next === current && !cat.hidden)) {
      syncPlayback();
      return;
    }
    story?.kill();
    reaction?.kill();
    snapshot = null;
    current = next;
    next.host.append(position);
    buildStory(next);
  }
  function queueChoose() {
    if (queued || destroyed) return;
    queued = true;
    requestAnimationFrame(choose);
  }
  function syncPlayback() {
    const paused =
      document.hidden ||
      reduced.matches ||
      !current ||
      cat.hidden ||
      !isOnscreen(cat);
    cat.dataset.paused = String(paused);
    if (paused) {
      story?.pause();
      reaction?.pause();
    } else {
      if (!snapshot) story?.resume();
      reaction?.resume();
    }
    syncFrames();
  }

  cat.addEventListener("click", (event) => {
    unlock(event);
    const now = performance.now();
    pokes = pokes.filter((time) => now - time < 6500);
    pokes.push(now);
    const mood = pokes.length >= 4 ? "grumpy" : "happy";
    pulse(mood === "grumpy" ? "grumpy" : "pet");
    if (!snapshot) {
      snapshot = {
        pose: poseName,
        frame: frameIndex,
        direction,
        bubble: cat.dataset.bubble,
      };
      story?.pause();
    }
    reaction?.kill();
    cat.dataset.bubble = "";
    cat.dataset.reaction = mood;
    pose(mood, mood === "happy" ? 12 : 13);
    if (lastMood !== mood) {
      status.textContent =
        mood === "happy"
          ? "The cat leans into your hand and purrs."
          : "A little space, please. The cat flicks its tail.";
      lastMood = mood;
    }
    reaction = gsap.timeline({
      onComplete: () => {
        cat.dataset.reaction = "";
        const saved = snapshot;
        snapshot = null;
        if (!saved) return;
        setFacing(saved.direction);
        pose(saved.pose, saved.frame);
        cat.dataset.bubble = saved.bubble;
        gsap.set(cat, { rotation: 0, scale: 1 });
        syncPlayback();
      },
    });
    if (!reduced.matches) {
      reaction
        .to(cat, {
          rotation: mood === "happy" ? -5 : 3,
          scale: 1.035,
          duration: 0.16,
        })
        .to(cat, { rotation: 0, scale: 1, duration: 0.25 });
    }
    reaction.to({}, { duration: mood === "happy" ? 1.15 : 1.7 });
  });

  const observer = new IntersectionObserver(queueChoose, {
    threshold: [0, 0.25, 0.5, 1],
  });
  scenes.forEach(({ host }) => observer.observe(host));
  // Width-only registration: mobile address-bar height changes never restart a scene.
  let previousWidth = 0;
  const resize = new ResizeObserver(() => {
    if (!current) return;
    const width = current.host.clientWidth;
    if (width !== previousWidth) {
      previousWidth = width;
      renderPosition();
    }
  });
  scenes.forEach(({ host }) => resize.observe(host));
  const onVisibility = () => {
    if (document.hidden) haptics?.cancel();
    syncPlayback();
    if (!document.hidden) queueChoose();
  };
  const onMotionChange = () => {
    haptics?.cancel();
    story?.kill();
    reaction?.kill();
    snapshot = null;
    if (current) buildStory(current);
  };
  document.addEventListener("visibilitychange", onVisibility);
  reduced.addEventListener("change", onMotionChange);
  // A single RAF check catches a cat crossing the viewport edge; it never animates scroll.
  window.addEventListener("scroll", queueChoose, { passive: true });
  window.addEventListener("resize", queueChoose, { passive: true });
  window.addEventListener("pageshow", queueChoose);
  window.addEventListener("pagehide", (event) => {
    story?.pause();
    reaction?.pause();
    gsap.ticker.remove(animateFrame);
    ticking = false;
    haptics?.cancel();
    if (event.persisted) return;
    destroyed = true;
    story?.kill();
    reaction?.kill();
    gsap.ticker.remove(animateFrame);
    haptics?.destroy();
    observer.disconnect();
    resize.disconnect();
    window.removeEventListener("scroll", queueChoose);
    window.removeEventListener("resize", queueChoose);
    document.removeEventListener("pointerdown", unlock);
    document.removeEventListener("keydown", unlock);
    document.removeEventListener("visibilitychange", onVisibility);
    reduced.removeEventListener("change", onMotionChange);
  });
  queueChoose();
})();
