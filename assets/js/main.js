/* Skrip umum: menu mobile, link WhatsApp, tahun footer, titik slider, animasi scroll,
   dan penanda kategori di halaman Solusi.
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
    document.body.classList.toggle("nav-open", open); // menggelapkan halaman di belakang menu
  };
  navToggle.addEventListener("click", () => setOpen(navToggle.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      navToggle.focus();
    }
  });
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  // Klik di area gelap (di luar menu) menutup menu.
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("is-open") && !nav.contains(e.target) && !navToggle.contains(e.target)) setOpen(false);
  });
  // Menu ditutup bila layar dilebarkan sampai menu lengkap tampil.
  window.matchMedia("(min-width: 1200px)").addEventListener("change", (e) => {
    if (e.matches) setOpen(false);
  });
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

// Slider kartu di HP: titik penanda posisi di bawahnya (di layar lebar disembunyikan CSS).
document.querySelectorAll(".grid-4, .grid-3, .feature-grid").forEach((slider) => {
  const items = slider.children;
  if (items.length < 2) return;
  const dots = document.createElement("div");
  dots.className = "slider-dots";
  dots.setAttribute("aria-hidden", "true");
  for (let i = 0; i < items.length; i++) dots.append(document.createElement("span"));
  slider.after(dots);

  const update = () => {
    const step = items[0].offsetWidth + (parseFloat(getComputedStyle(slider).columnGap) || 0);
    const atEnd = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 2;
    const active = atEnd ? items.length - 1 : Math.round(slider.scrollLeft / step);
    Array.from(dots.children).forEach((dot, i) => dot.classList.toggle("is-active", i === active));
  };
  let frame;
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  };
  slider.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  update();
});

// Efek muncul saat di-scroll. Dilewati bila pengguna memilih "kurangi gerakan"
// atau browser tidak mendukung IntersectionObserver; konten tetap tampil normal.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion && "IntersectionObserver" in window) {
  const targets = document.querySelectorAll(
    ".section-head, .card, .profile, .cta-band, .featured, .ethics, .accordion__item, " +
    ".pyramid__layer, .callout, .claim-band, .channel, .consult-steps li, .consult-alt, .prose > *, " +
    ".why__item, .steps__item, .calc-promo"
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

// Banner kalkulator: saat terlihat, kartu contoh hasil muncul memantul, angkanya menghitung naik dari Rp 0,
// dan meternya terisi (gayanya di pages.css). Dilewati bila pengunjung memilih "kurangi gerakan".
if (!reduceMotion && "IntersectionObserver" in window) {
  document.querySelectorAll(".calc-promo").forEach((promo) => {
    const value = promo.querySelector(".calc-promo__value");
    if (!value) return;
    const target = Number(value.textContent.replace(/\D/g, "")); // angka diambil dari HTML
    const format = new Intl.NumberFormat("id-ID");
    const show = (n) => (value.textContent = "Rp " + format.format(n));
    promo.classList.add("is-armed");
    show(0);

    const popObserver = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      popObserver.disconnect();
      promo.classList.add("is-popped");
      const start = performance.now() + 450; // mulai setelah kartu muncul
      const tick = (now) => {
        const t = Math.min(1, Math.max(0, (now - start) / 1300));
        const eased = 1 - Math.pow(1 - t, 3);
        show(t < 1 ? Math.round((target * eased) / 1e6) * 1e6 : target); // naik per juta agar rapi
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.35 });
    popObserver.observe(promo);
  });
}

// Solusi: kategori yang sedang dibaca ditandai di bilah kategori (dan digeser ke tengah di HP).
const catNav = document.querySelector(".cat-nav");
if (catNav && "IntersectionObserver" in window) {
  const list = catNav.querySelector("ul");
  const links = catNav.querySelectorAll('a[href^="#"]');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => {
        if (a.hash !== "#" + entry.target.id) {
          a.removeAttribute("aria-current");
          return;
        }
        a.setAttribute("aria-current", "true");
        const offset = a.getBoundingClientRect().left + a.offsetWidth / 2 - (list.getBoundingClientRect().left + list.clientWidth / 2);
        list.scrollBy({ left: offset, behavior: reduceMotion ? "auto" : "smooth" });
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((a) => {
    const section = document.getElementById(a.hash.slice(1));
    if (section) spy.observe(section);
  });
}
