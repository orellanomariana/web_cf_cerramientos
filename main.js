// =====================
// CONFIG
// =====================
const WHATSAPP_NUMBER = "54911TU_NUMERO";

const MSG_DEFAULT =
  "Hola! Quiero pedir presupuesto.\n" +
  "Ubicación: ____\n" +
  "Obra: (nueva/reforma)\n" +
  "Tipo de abertura: ____\n" +
  "Medidas aprox: ____\n" +
  "DVH o laminado: (sí/no)\n" +
  "Adjunto fotos del lugar.";

// =====================
// WhatsApp helper
// =====================
function openWA(message = MSG_DEFAULT) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

document.querySelectorAll("[data-wa]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    const raw = el.dataset.wa?.trim();
    const message = !raw || raw === "default" ? MSG_DEFAULT : raw;
    openWA(message);
  });
});

// =====================
// Mobile drawer nav
// =====================
const burger = document.getElementById("burger");
const drawer = document.getElementById("drawer");

function openDrawer() {
  if (!drawer) return;
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  burger?.setAttribute("aria-expanded", "true");
  document.body.classList.add("drawer-open");
}

function closeDrawer() {
  if (!drawer) return;
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  burger?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("drawer-open");
}

function toggleDrawer() {
  if (!drawer) return;
  const isHidden = drawer.getAttribute("aria-hidden") === "true";
  isHidden ? openDrawer() : closeDrawer();
}

if (burger && drawer) {
  burger.addEventListener("click", toggleDrawer);

  drawer.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", closeDrawer);
  });

  document.addEventListener("click", (e) => {
    const insideDrawer = drawer.contains(e.target);
    const insideBurger = burger.contains(e.target);

    if (!insideDrawer && !insideBurger && drawer.classList.contains("is-open")) {
      closeDrawer();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("is-open")) {
      closeDrawer();
    }
  });
}

// =====================
// Smooth scroll
// =====================
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

// =====================
// Navbar on scroll
// =====================
const navbar = document.querySelector(".navbar");

function handleNavbarScroll() {
  if (!navbar) return;
  navbar.classList.toggle("is-scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", handleNavbarScroll, { passive: true });
handleNavbarScroll();

// =====================
// Gallery lightbox
// =====================
const mosaic = document.getElementById("mosaic");
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCap = document.getElementById("lbCap");
const lbClose = document.getElementById("lbClose");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");

let currentShots = [];
let currentIndex = -1;

function openLBByIndex(index) {
  if (!currentShots.length || index < 0 || index >= currentShots.length) return;
  if (!lightbox || !lbImg || !lbCap) return;

  const shot = currentShots[index];
  const img = shot.querySelector("img");
  const cap = shot.dataset.cap || "";
  const src = img?.getAttribute("src");
  const alt = img?.getAttribute("alt") || cap || "Imagen ampliada";

  if (!src) return;

  currentIndex = index;
  lbImg.src = src;
  lbImg.alt = alt;
  lbCap.textContent = cap;

  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
}

function closeLB() {
  if (!lightbox || !lbImg || !lbCap) return;

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");

  lbImg.src = "";
  lbImg.alt = "";
  lbCap.textContent = "";

  currentIndex = -1;
  document.body.classList.remove("lightbox-open");
}

function nextLB() {
  if (currentIndex < currentShots.length - 1) {
    openLBByIndex(currentIndex + 1);
  }
}

function prevLB() {
  if (currentIndex > 0) {
    openLBByIndex(currentIndex - 1);
  }
}

if (mosaic) {
  currentShots = Array.from(mosaic.querySelectorAll(".shot"));

  currentShots.forEach((shot, index) => {
    shot.addEventListener("click", () => openLBByIndex(index));
  });
}

lbClose?.addEventListener("click", closeLB);
lbNext?.addEventListener("click", nextLB);
lbPrev?.addEventListener("click", prevLB);

lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLB();
});

document.addEventListener("keydown", (e) => {
  if (!lightbox?.classList.contains("is-open")) return;

  if (e.key === "Escape") closeLB();
  if (e.key === "ArrowRight") nextLB();
  if (e.key === "ArrowLeft") prevLB();
});

// =====================
// Reveal on scroll
// =====================
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -8% 0px",
  }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));