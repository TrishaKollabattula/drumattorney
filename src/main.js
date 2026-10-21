import "./style.css";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { work } from "./work.js";
import { contact } from "./contact.js";
import { collabs } from "./collabs.js";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });
const isMobile = window.matchMedia("(max-width: 700px)").matches;

/* ---------- smooth scrolling ---------- */
const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
/* nav hides when scrolling down, returns when scrolling up */
const nav = document.querySelector(".nav");
lenis.on("scroll", ({ scroll, direction }) => {
  nav.classList.toggle("nav--hidden", direction === 1 && scroll > 120);
});

/* ---------- hero intro ---------- */
const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
intro
  .from(".hero__title", { yPercent: 40, opacity: 0, duration: 1.4 })
  .from(".hero__photo", { scale: 0.7, opacity: 0, rotate: 6, duration: 1.2 }, "-=1")
  .from(".hero__script", { x: -80, opacity: 0, duration: 1 }, "-=0.6")
  .from(".hero__kicker, .hero__meta, .hero__scroll", { opacity: 0, y: 20, stagger: 0.1, duration: 0.8 }, "-=0.6");

/* ---------- hero scroll effects ---------- */
const heroScroll = {
  trigger: ".hero",
  start: "top top",
  end: "bottom top",
  scrub: true,
};

gsap.to(".hero__title", { scale: isMobile ? 1.05 : 1.35, yPercent: isMobile ? -15 : -10, ease: "none", scrollTrigger: heroScroll });
gsap.to(".hero__photo", { yPercent: -18, rotate: 3, ease: "none", scrollTrigger: heroScroll });
gsap.to(".hero__photo img", { yPercent: -8, ease: "none", scrollTrigger: heroScroll });
gsap.to(".hero__script", { xPercent: 60, ease: "none", scrollTrigger: heroScroll });

/* ---------- work: build cards from work.js ---------- */
const track = document.querySelector("#workTrack");

track.innerHTML =
  work
    .map((item, i) => {
      const num = String(i + 1).padStart(2, "0");
      const file = item.src.split("/").pop();
      const media =
        item.type === "video"
          ? `<video src="${item.src}" ${item.poster ? `poster="${item.poster}"` : ""} muted loop playsinline preload="metadata"></video>
             <span class="card__sound">tap for sound</span>`
                    : `<img src="${item.src}" alt="${item.caption}" loading="lazy" />
             ${item.story ? '<span class="card__sound card__sound--left">read my story ↗</span>' : ""}`;
      return `
        <article class="card card--${item.type} ${item.tall ? "card--tall" : ""}">
          <div class="card__media" data-file="${file}">${media}</div>
          <div class="card__cap"><span>${num}</span><p>${item.caption}</p></div>
        </article>`;
    })
    .join("") +
  `<a href="#contact" class="card card--cta">
     <p>let's make the next show count.</p>
     <span>book me →</span>
   </a>`;

/* missing files show a placeholder instead of a broken image */
track.querySelectorAll("img, video").forEach((el) => {
  el.addEventListener("error", () => el.closest(".card").classList.add("card--missing"));
});

/* videos only play while they're on screen (saves battery + data) */
const videos = [...track.querySelectorAll("video")];
const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.play().catch(() => {});
      else e.target.pause();
    });
  },
  { threshold: 0.5 }
);
videos.forEach((v) => videoObserver.observe(v));

/* tap a video card to turn its sound on/off (one at a time) */
videos.forEach((v) => {
  v.closest(".card").addEventListener("click", () => {
    const turnOn = v.muted;
    videos.forEach((o) => {
      o.muted = true;
      const c = o.closest(".card");
      c.classList.remove("is-on");
      c.querySelector(".card__sound").textContent = "tap for sound";
    });
    if (turnOn) {
      v.muted = false;
      const c = v.closest(".card");
      c.classList.add("is-on");
      c.querySelector(".card__sound").textContent = "sound on";
    }
  });
});

/* ---------- work: pinned horizontal scroll (laptop only) ---------- */
const mm = gsap.matchMedia();
mm.add("(min-width: 901px)", () => {
  const distance = () => track.scrollWidth - window.innerWidth;
  gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: ".work",
      pin: true,
      scrub: 1,
      end: () => "+=" + distance(),
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  });
});

window.addEventListener("load", () => ScrollTrigger.refresh());

/* ---------- story overlay ---------- */
const storyEl = document.querySelector("#story");

function openStory(s) {
  document.querySelector("#storyKicker").textContent = s.kicker;
  document.querySelector("#storyTitle").textContent = s.title;
  document.querySelector("#storyBody").innerHTML = s.paragraphs.map((p) => `<p>${p}</p>`).join("");
  storyEl.hidden = false;
  storyEl.scrollTop = 0;
  lenis.stop();
  gsap.fromTo(storyEl, { opacity: 0, yPercent: 6 }, { opacity: 1, yPercent: 0, duration: 0.6, ease: "power3.out" });
  gsap.from(".story__text > *", { y: 40, opacity: 0, stagger: 0.12, duration: 0.8, delay: 0.15, ease: "power3.out" });
}

function closeStory() {
  gsap.to(storyEl, {
    opacity: 0,
    yPercent: 4,
    duration: 0.35,
    ease: "power2.in",
    onComplete: () => {
      storyEl.hidden = true;
      lenis.start();
    },
  });
}

work.forEach((item, i) => {
  if (!item.story) return;
  track.querySelectorAll(".card")[i].addEventListener("click", () => openStory(item.story));
});
storyEl.querySelector(".story__close").addEventListener("click", closeStory);
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !storyEl.hidden) closeStory();
});

/* ---------- contact ---------- */
const waBase = `https://wa.me/${contact.whatsapp}`;
document.querySelector("#linkWa").href = `${waBase}?text=${encodeURIComponent("Hi Prathik, I found your website and I'd like to talk about a show.")}`;
document.querySelector("#linkIg").href = `https://instagram.com/${contact.instagram}`;
document.querySelector("#linkMail").href = `mailto:${contact.email}?subject=${encodeURIComponent("Booking enquiry — Drumattorney")}`;

document.querySelector("#bookForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const msg =
    `Hi Prathik, this is ${f.get("name")}.\n` +
    `I'd like to book you for: ${f.get("type")}.\n` +
    (f.get("when") ? `Date & city: ${f.get("when")}.\n` : "") +
    `Found you through your website.`;
  window.open(`${waBase}?text=${encodeURIComponent(msg)}`, "_blank");
});

gsap.from(".contact__title, .book, .big-link, .contact__note", {
  y: 60,
  opacity: 0,
  stagger: 0.1,
  duration: 0.9,
  ease: "power3.out",
  scrollTrigger: { trigger: ".contact", start: "top 70%" },
});

/* ---------- collabs wall ---------- */
const wallGrid = document.querySelector("#wallGrid");

wallGrid.innerHTML = collabs
  .map(
    (c) => `
    <figure class="polaroid">
      <div class="polaroid__img" data-file="${c.src.split("/").pop()}">
        <img src="${c.src}" alt="${c.name}, ${c.role || "collaborator"}" loading="lazy" />
      </div>
      <figcaption><b>${c.name}</b><span>${c.role || ""}</span></figcaption>
    </figure>`
  )
  .join("");

wallGrid.querySelectorAll("img").forEach((img) =>
  img.addEventListener("error", () => img.closest(".polaroid").classList.add("polaroid--missing"))
);

/* photos drop in as you scroll to them */
gsap.set(".polaroid", { opacity: 0, y: 70 });
ScrollTrigger.batch(".polaroid", {
  start: "top 92%",
  once: true,
  onEnter: (els) =>
    gsap.to(els, { opacity: 1, y: 0, stagger: 0.12, duration: 0.9, ease: "power3.out" }),
});

/* ---------- about: reveal ---------- */
gsap.from(".about__title, .vinyl-wrap, .about__text > *", {
  y: 60,
  opacity: 0,
  stagger: 0.12,
  duration: 1,
  ease: "power3.out",
  scrollTrigger: { trigger: ".about__inner", start: "top 70%" },
});

/* ---------- about: vinyl spins as you scroll ---------- */
gsap.to(".vinyl", {
  rotate: 720,
  ease: "none",
  scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: true },
});

/* ---------- about: number counters ---------- */
document.querySelectorAll("[data-count]").forEach((el) => {
  const counter = { value: 0 };
  gsap.to(counter, {
    value: Number(el.dataset.count),
    duration: 2.2,
    ease: "power2.out",
    onUpdate: () => (el.textContent = Math.round(counter.value)),
    scrollTrigger: { trigger: el, start: "top 85%", once: true },
  });
});