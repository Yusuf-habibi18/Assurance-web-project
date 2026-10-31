/* Skrip umum: menu mobile, link WhatsApp, tahun footer.
   Data kontak diubah di SITE di bawah, bukan di tiap halaman. */

const SITE = {
  // Placeholder: ganti dengan nomor WhatsApp klien (format internasional, tanpa + atau 0 di depan).
  whatsapp: "6281200000000",
  waMessage: "Halo, saya ingin konsultasi gratis mengenai perlindungan asuransi.",
};

function buildWaUrl(message) {
  return "https://wa.me/" + SITE.whatsapp + "?text=" + encodeURIComponent(message || SITE.waMessage);
}

document.querySelectorAll("[data-wa]").forEach((el) => {
  el.href = buildWaUrl(el.dataset.wa || undefined);
  el.target = "_blank";
  el.rel = "noopener noreferrer";
});

const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");

if (navToggle && nav) {
  const setOpen = (open) => {
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    nav.classList.toggle("is-open", open);
  };
  navToggle.addEventListener("click", () => setOpen(navToggle.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      navToggle.focus();
    }
  });
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
}

document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Header berubah (blur + bayangan) setelah halaman di-scroll.
const header = document.querySelector(".site-header");
if (header) {
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// Tandai ikon panah agar bisa bergeser saat tombol disorot.
document.querySelectorAll('use[href="#i-arrow"]').forEach((use) => {
  use.closest("svg").classList.add("icon-arrow");
});

// Efek muncul saat di-scroll. Dilewati bila pengguna memilih "kurangi gerakan"
// atau browser tidak mendukung IntersectionObserver; konten tetap tampil normal.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion && "IntersectionObserver" in window) {
  const targets = document.querySelectorAll(
    ".section-head, .card, .profile, .cta-band, .featured, .ethics, .accordion__item, " +
    ".pyramid__layer, .callout, .claim-band, .channel, .consult-steps li, .consult-alt, .prose > *"
  );

  const show = (el) => {
    el.classList.add("is-visible");
    observer.unobserve(el);
    // Lepas kelas setelah animasi selesai agar efek hover kartu tidak ikut tertunda.
    const delay = parseInt(el.style.getPropertyValue("--reveal-delay"), 10) || 0;
    setTimeout(() => {
      el.classList.remove("reveal", "is-visible");
      el.style.removeProperty("--reveal-delay");
    }, 900 + delay);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const parent = entry.target.parentElement;
      // Di slider mobile, kartu yang masih tersembunyi di samping ikut dimunculkan.
      if (parent.scrollWidth > parent.clientWidth) {
        parent.querySelectorAll(":scope > .reveal:not(.is-visible)").forEach(show);
      } else {
        show(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });

  targets.forEach((el) => {
    // Elemen yang sudah terlihat saat halaman dibuka tidak dianimasikan, supaya tidak berkedip.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    // Kartu bersebelahan muncul berurutan.
    const index = Array.prototype.indexOf.call(el.parentElement.children, el);
    el.style.setProperty("--reveal-delay", Math.min(index, 4) * 90 + "ms");
    el.classList.add("reveal");
    observer.observe(el);
  });
}
