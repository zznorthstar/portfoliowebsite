/* Progressive enhancement. Content and links work without motion or JavaScript. */
(() => {
  "use strict";
  const root = document.documentElement;
  const scheme = matchMedia("(prefers-color-scheme: dark)");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const theme = document.querySelector(".theme-toggle");
  const currentTheme = () =>
    root.dataset.theme || (scheme.matches ? "dark" : "light");
  function updateShowcaseTheme() {
    document.querySelectorAll(".showcase-picture source").forEach((source) => {
      const size =
        source.dataset.format === "mobile"
          ? "(max-width: 1023px)"
          : "(min-width: 1024px)";
      source.media = source.dataset.color === currentTheme() ? size : "not all";
    });
  }
  function updateThemeLabel() {
    updateShowcaseTheme();
    if (!theme) return;
    theme.textContent = currentTheme() === "dark" ? "Light" : "Dark";
    theme.setAttribute(
      "aria-label",
      `Switch to ${currentTheme() === "dark" ? "light" : "dark"} theme`,
    );
  }
  if (theme) {
    theme.hidden = false;
    updateThemeLabel();
    theme.addEventListener("click", () => {
      root.dataset.theme = currentTheme() === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("hb-theme", root.dataset.theme);
      } catch (_) {}
      updateThemeLabel();
    });
    scheme.addEventListener("change", updateThemeLabel);
  }
  const menu = document.querySelector(".mobile-menu");
  const toggle = document.querySelector(".menu-toggle");
  if (menu && toggle) {
    toggle.hidden = false;
    toggle.addEventListener("click", () => {
      menu.showModal();
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-open");
      if (window.gsap && !reduced.matches)
        gsap.fromTo(
          menu.querySelectorAll("nav a"),
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            stagger: 0.06,
            ease: "power3.out",
            clearProps: "all",
          },
        );
    });
    const close = () => menu.close();
    menu.querySelector(".menu-close").addEventListener("click", close);
    menu
      .querySelectorAll("a")
      .forEach((link) => link.addEventListener("click", close));
    menu.addEventListener("close", () => {
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus({ preventScroll: true });
    });
    matchMedia("(min-width: 768px)").addEventListener("change", (event) => {
      if (event.matches && menu.open) close();
    });
  }
  const imageDialog = document.querySelector(".image-dialog");
  if (imageDialog) {
    let origin;
    const preview = imageDialog.querySelector("img");
    document.querySelectorAll(".proof-gallery img").forEach((img) => {
      function open() {
        origin = img;
        const showcase = img.closest(".showcase-picture");
        preview.src =
          (showcase
            ? `assets/images/showcases/${showcase.dataset.showcase}-${innerWidth < 1024 ? "mobile" : "desktop"}-${currentTheme()}-${innerWidth < 1024 ? 1200 : 1920}.webp`
            : null) ||
          img.dataset.fullSrc ||
          (img.closest("picture") ? img.currentSrc : img.src);
        preview.alt = img.alt;
        imageDialog.showModal();
      }
      img.addEventListener("click", open);
      img.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      });
    });
    imageDialog
      .querySelector("button")
      .addEventListener("click", () => imageDialog.close());
    imageDialog.addEventListener("click", (event) => {
      if (event.target === imageDialog) imageDialog.close();
    });
    imageDialog.addEventListener("close", () => {
      if (origin) origin.focus({ preventScroll: true });
    });
  }
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  // Invert the Figma curve's x coordinate; preserve (.22, 1, .36, 1)
  // rather than substituting a named GSAP ease with a different shape.
  const editorialEase = (progress) => {
    let low = 0,
      high = 1,
      t = progress;
    for (let i = 0; i < 18; i++) {
      t = (low + high) / 2;
      const x =
        3 * 0.22 * (1 - t) ** 2 * t + 3 * 0.36 * (1 - t) * t ** 2 + t ** 3;
      if (x < progress) low = t;
      else high = t;
    }
    return progress === 0 || progress === 1 ? progress : 1 - (1 - t) ** 3;
  };
  const media = gsap.matchMedia();
  media.add("(prefers-reduced-motion: no-preference)", () => {
    const hero = document.querySelector(".home-hero");
    if (hero) {
      // The Figma entrance is native CSS; only the inner photo has scroll motion.
      gsap.to(".portrait-frame img", {
        yPercent: 5,
        scale: 1.05,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }
    gsap.utils
      .toArray(
        ".section > h2, .studio-heading, .about-statement, .page-head, .lib-hero, .research-article > h1",
      )
      .forEach((el) => {
        gsap.from(el, {
          y: 28,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 93%", once: true },
        });
      });
    gsap.utils
      .toArray(
        ".studio-grid > a, .research-preview-grid > *, .paper-card, .range-item",
      )
      .forEach((el) => {
        gsap.from(el, {
          y: 20,
          opacity: 0,
          duration: 0.65,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 95%", once: true },
        });
      });
    // Four arms join into a plus; a turn changes "unite" into "multiply".
    const brand = document.querySelector(".site-header .mark-assembly");
    if (brand) {
      const arms = brand.querySelectorAll(".mark-arm");
      gsap.from(arms, {
        scale: 0.2,
        opacity: 0,
        transformOrigin: "center",
        stagger: 0.07,
        duration: 0.65,
        ease: "back.out(1.4)",
      });
      gsap.to(brand, {
        rotation: 45,
        duration: 1.2,
        delay: 2,
        repeat: -1,
        repeatDelay: 3,
        yoyo: true,
        ease: "power3.inOut",
        transformOrigin: "32px 32px",
      });
    }
    const largeMark = document.querySelector(".hero-symbol .mark-assembly");
    if (largeMark)
      gsap.to(largeMark, {
        rotation: 135,
        duration: 1.3,
        ease: "power2.inOut",
        transformOrigin: "32px 32px",
        scrollTrigger: {
          trigger: ".home-hero",
          start: "top top",
          end: "bottom 20%",
          scrub: 0.8,
        },
      });
    const studioArt = document.querySelector(".monowire-art");
    if (studioArt) {
      gsap.from(studioArt.querySelectorAll(".wire-node"), {
        scale: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.4)",
        scrollTrigger: { trigger: studioArt, start: "top 85%", once: true },
      });
      gsap.from(studioArt.querySelectorAll(".wire"), {
        scaleX: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: studioArt, start: "top 85%", once: true },
      });
    }
    const slideArms = document.querySelectorAll(".morphix-art i");
    if (slideArms.length)
      gsap.from(slideArms, {
        scale: 0.5,
        opacity: 0,
        stagger: 0.05,
        duration: 0.7,
        scrollTrigger: {
          trigger: ".morphix-art",
          start: "top 85%",
          once: true,
        },
      });
  });
  const stage = document.querySelector(".work-stage");
  const track = document.querySelector(".work-track");
  if (stage && track) {
    media.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        stage.classList.add("is-pinned");
        const slides = Array.from(track.children);
        const distance = () =>
          Math.max(0, track.scrollWidth - stage.clientWidth);
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        slides.forEach((slide, index) => {
          const visual = slide.querySelector(".showcase-picture");
          if (!visual) return;
          gsap.fromTo(
            visual,
            { y: 20, scale: 0.98, opacity: 0.55 },
            {
              y: 0,
              scale: 1,
              opacity: 1,
              duration: 0.7,
              ease: editorialEase,
              clearProps: "transform,opacity",
              scrollTrigger:
                index === 0
                  ? { trigger: stage, start: "top 90%", once: true }
                  : {
                      trigger: slide,
                      containerAnimation: tween,
                      start: "left 90%",
                      once: true,
                    },
            },
          );
        });
        // Keyboard users can focus every project even when its slide is off screen.
        const onFocus = (event) => {
          const slide = event.target.closest(".project-slide");
          const index = slides.indexOf(slide);
          if (index < 0 || !tween.scrollTrigger) return;
          const trigger = tween.scrollTrigger;
          const left = slide.getBoundingClientRect().left;
          if (left < -20 || left > innerWidth - 60) {
            window.scrollTo({
              top:
                trigger.start +
                ((trigger.end - trigger.start) * index) / (slides.length - 1),
              behavior: "instant",
            });
            gsap.set(track, { x: (-distance() * index) / (slides.length - 1) });
            ScrollTrigger.update();
          }
        };
        track.addEventListener("focusin", onFocus);
        return () => {
          stage.classList.remove("is-pinned");
          track.removeEventListener("focusin", onFocus);
        };
      },
    );
  }
  media.add(
    "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
    () => {
      document
        .querySelectorAll(".project-media .showcase-picture")
        .forEach((visual) => {
          gsap.fromTo(
            visual,
            { y: 14, opacity: 0.55 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: editorialEase,
              clearProps: "transform,opacity",
              scrollTrigger: { trigger: visual, start: "top 94%", once: true },
            },
          );
        });
    },
  );
  // Hover feedback stays on compositor transforms, and is omitted on touch devices.
  media.add(
    "(hover: hover) and (prefers-reduced-motion: no-preference)",
    () => {
      const cleanups = [];
      document
        .querySelectorAll(".hero-actions .button, .studio-grid > a")
        .forEach((el) => {
          const enter = () =>
            gsap.to(el, { y: -3, duration: 0.25, ease: "power2.out" });
          const leave = () =>
            gsap.to(el, { y: 0, duration: 0.35, ease: "power2.out" });
          el.addEventListener("mouseenter", enter);
          el.addEventListener("mouseleave", leave);
          cleanups.push(() => {
            el.removeEventListener("mouseenter", enter);
            el.removeEventListener("mouseleave", leave);
          });
        });
      return () => cleanups.forEach((fn) => fn());
    },
  );
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener(
    "pagehide",
    (event) => {
      if (!event.persisted) media.revert();
    },
    { once: true },
  );
})();
