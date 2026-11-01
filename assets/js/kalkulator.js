/* Kalkulator protection gap (kalkulator.html): jiwa dan penyakit kritis.
   Hasil dihitung ulang di browser setiap isian berubah; tidak ada data yang dikirim atau disimpan.
   Butuh main.js (buildWaUrl) dimuat lebih dulu. */

const rupiah = new Intl.NumberFormat("id-ID");
const formatRp = (n) => "Rp " + rupiah.format(Math.round(n));
const toNumber = (v) => Number(String(v).replace(/\D/g, "")) || 0;

// Kolom nominal diberi titik pemisah ribuan saat diketik, tanpa memindahkan posisi kursor.
function formatMoneyInput(input) {
  const caret = input.selectionStart;
  const digitsBefore = input.value.slice(0, caret).replace(/\D/g, "").length;
  const digits = input.value.replace(/\D/g, "").replace(/^0+(?=\d)/, "").slice(0, 15);
  input.value = digits ? rupiah.format(Number(digits)) : "";

  let pos = 0;
  for (let seen = 0; pos < input.value.length && seen < digitsBefore; pos++) {
    if (/\d/.test(input.value[pos])) seen++;
  }
  input.setSelectionRange(pos, pos);
}

function readCalcForm(form) {
  const data = {};
  form.querySelectorAll("input, select").forEach((field) => {
    data[field.name] = field.matches("[data-money]") ? toNumber(field.value) : Number(field.value);
  });
  return data;
}

const periodeValid = (n) => Number.isInteger(n) && n >= 1 && n <= 40;

// Bagian yang data utamanya belum diisi (atau periodenya tidak valid) bernilai null dan tidak ditampilkan.
function hitungGap(d) {
  const gap = (butuh, punya) => ({ butuh, punya, gap: Math.max(0, butuh - punya) });
  return {
    jiwa: d.pengeluaran > 0 && periodeValid(d.periode)
      ? gap(d.pengeluaran * 12 * d.periode + d.utang + d.pendidikan + d.darurat, d.upJiwa + d.tabungan)
      : null,
    kritis: d.penghasilan > 0 ? gap(d.penghasilan * 12 * d.pemulihan, d.upKritis) : null,
  };
}

function renderBlock(block, r) {
  block.hidden = !r;
  if (!r) return;
  const persen = Math.min(100, Math.round((r.punya / r.butuh) * 100));
  const covered = r.gap === 0;
  block.classList.toggle("is-covered", covered);
  block.querySelector("[data-out=gap]").textContent = formatRp(r.gap);
  block.querySelector("[data-out=butuh]").textContent = formatRp(r.butuh);
  block.querySelector("[data-out=punya]").textContent = formatRp(r.punya);
  block.querySelector("[data-out=meter]").style.width = persen + "%";
  block.querySelector("[data-out=caption]").textContent = covered
    ? "Perlindungan yang ada sudah menutup estimasi kebutuhan ini."
    : "Yang sudah dimiliki baru menutup " + persen + "% dari estimasi kebutuhan.";
}

function buildCalcMessage(hasil, pemulihan) {
  const lines = ["Halo, saya sudah mencoba kalkulator protection gap di website dan ingin mendiskusikan hasilnya."];
  const bagian = (judul, r) => lines.push(
    "",
    judul,
    "- Estimasi kebutuhan: " + formatRp(r.butuh),
    "- Sudah dimiliki: " + formatRp(r.punya),
    "- Kesenjangan: " + formatRp(r.gap)
  );
  if (hasil.jiwa) bagian("Asuransi jiwa", hasil.jiwa);
  if (hasil.kritis) bagian("Penyakit kritis (" + pemulihan + " tahun penghasilan)", hasil.kritis);
  return lines.join("\n");
}

document.querySelectorAll("[data-calc]").forEach((form) => {
  const result = document.getElementById("hasil");
  const empty = result.querySelector("[data-calc-empty]");
  const output = result.querySelector("[data-calc-output]");
  const status = result.querySelector("[data-calc-status]");
  const periode = form.querySelector("[name=periode]");
  const periodeError = document.getElementById(periode.id + "-error");
  let announceTimer;

  // Pesan error periode tampil setelah kolom ditinggalkan, lalu hilang begitu angkanya benar.
  const checkPeriode = () => {
    const ok = periodeValid(Number(periode.value));
    periode.setAttribute("aria-invalid", ok ? "false" : "true");
    periodeError.textContent = ok ? "" : "Isi angka 1 sampai 40 tahun.";
    periodeError.hidden = ok;
  };
  periode.addEventListener("input", () => {
    periode.value = periode.value.replace(/\D/g, "");
    if (periode.getAttribute("aria-invalid") === "true") checkPeriode();
  });
  periode.addEventListener("blur", checkPeriode);

  const update = () => {
    const data = readCalcForm(form);
    const hasil = hitungGap(data);

    renderBlock(output.querySelector("[data-calc-block=jiwa]"), hasil.jiwa);
    renderBlock(output.querySelector("[data-calc-block=kritis]"), hasil.kritis);
    output.querySelector("[data-out=tahun]").textContent = data.pemulihan;

    const ada = Boolean(hasil.jiwa || hasil.kritis);
    empty.hidden = ada;
    output.hidden = !ada;
    if (ada) output.querySelector("[data-calc-wa]").href = buildWaUrl(buildCalcMessage(hasil, data.pemulihan));

    // Pembaca layar diberi ringkasan setelah pengunjung berhenti mengetik, bukan di setiap ketukan.
    clearTimeout(announceTimer);
    announceTimer = setTimeout(() => {
      const teks = [];
      if (hasil.jiwa) teks.push("Kesenjangan asuransi jiwa " + formatRp(hasil.jiwa.gap) + ".");
      if (hasil.kritis) teks.push("Kesenjangan penyakit kritis " + formatRp(hasil.kritis.gap) + ".");
      status.textContent = teks.join(" ");
    }, 1000);
  };

  form.querySelectorAll("[data-money]").forEach((input) => {
    input.addEventListener("input", () => formatMoneyInput(input));
  });
  form.addEventListener("input", update);
  form.addEventListener("submit", (e) => e.preventDefault()); // tombol Enter tidak memuat ulang halaman
  update();
});
