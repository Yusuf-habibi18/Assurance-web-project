/* Accordion FAQ: tombol membuka/menutup panel dengan animasi tinggi,
   aksesibel lewat keyboard. Tanpa animasi bila pengguna memilih "kurangi gerakan". */

const faqReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animatePanel(panel, open) {
  if (faqReduceMotion || !panel.animate) {
    panel.hidden = !open;
    return;
  }
  panel.hidden = false;
  const full = panel.scrollHeight + "px";
  const frames = open
    ? [{ height: "0px", opacity: 0 }, { height: full, opacity: 1 }]
    : [{ height: full, opacity: 1 }, { height: "0px", opacity: 0 }];
  panel.style.overflow = "hidden";
  const anim = panel.animate(frames, { duration: 300, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" });
  anim.onfinish = () => {
    panel.style.overflow = "";
    if (!open) panel.hidden = true;
  };
}

document.querySelectorAll(".accordion__trigger").forEach((trigger) => {
  const panel = document.getElementById(trigger.getAttribute("aria-controls"));
  if (!panel) return;
  trigger.addEventListener("click", () => {
    const open = trigger.getAttribute("aria-expanded") === "true";
    trigger.setAttribute("aria-expanded", String(!open));
    animatePanel(panel, !open);
  });
});
