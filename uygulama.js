"use strict";
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));
const sayi = (x) => x.toLocaleString("tr-TR");
const guzel = (s) => s.toLocaleLowerCase("tr").split(" ").map((w) => w.charAt(0).toLocaleUpperCase("tr") + w.slice(1)).join(" ");
const buyuk = (s) => s.trim().replace(/\s+/g, " ").toLocaleUpperCase("tr");
const NS = "http://www.w3.org/2000/svg";
function ek(s, e) {
  const k = s.toLocaleLowerCase("tr");
  const sesli = [...k].reverse().find((h) => "aıoueiöü".includes(h)) || "e";
  let x = e.replace("a", "aıou".includes(sesli) ? "a" : "e");
  if ("fstkçşhp".includes(k.slice(-1))) x = x.replace("d", "t");
  return `${s}'${x}`;
}

let V, H, NUF, endeks = {}; // endeks[soy] = [{i, sira, sayi}]

function haritaKur() {
  const s = $("harita");
  s.setAttribute("viewBox", `0 0 ${H.w} ${H.h}`);
  H.iller.forEach((p, i) => {
    const e = document.createElementNS(NS, "path");
    e.setAttribute("d", p.d); e.dataset.i = i;
    e.appendChild(document.createElementNS(NS, "title"));
    s.appendChild(e);
  });
  const g = document.createElementNS(NS, "g"); g.id = "yazi"; s.appendChild(g);
}

function yazi(x, y, t, sinif, renk) {
  const e = document.createElementNS(NS, "text");
  e.setAttribute("x", x); e.setAttribute("y", y); e.setAttribute("text-anchor", "middle"); e.setAttribute("class", sinif);
  if (renk) e.setAttribute("fill", renk);
  e.textContent = t; $("yazi").appendChild(e);
}

// Yakın illerin adları üst üste binmesin: çakışan yazıyı en yakın boş yüksekliğe kaydırır
function carpisma() {
  const dolu = [];
  [...$("yazi").children].forEach((e) => {
    const b = e.getBBox(), y0 = Number(e.getAttribute("y")), h = b.height;
    for (const k of [0, -1, 1, -2, 2, -3, 3]) {
      const dy = k * h * 0.95, r = {x: b.x - 1, y: b.y + dy, w: b.width + 2, h};
      if (!dolu.some((o) => r.x < o.x + o.w && o.x < r.x + r.w && r.y < o.y + o.h && o.y < r.y + r.h)) {
        e.setAttribute("y", y0 + dy); dolu.push(r); return;
      }
    }
    dolu.push({x: b.x, y: b.y, w: b.width, h});
  });
}

function ozelHarita() {
  $("yazi").innerHTML = "";
  $("geri").hidden = true;
  [...$("harita").querySelectorAll("path")].forEach((e) => {
    const i = Number(e.dataset.i), o = V.ozel[i];
    e.style.fill = ""; e.classList.remove("secili");
    e.querySelector("title").textContent = o ? `${H.iller[i].ad}: ${guzel(o[0])} (${sayi(o[1])} kişi, ${o[2]} ilde ilk 30'da)` : H.iller[i].ad;
    e.onclick = () => o && sorgula(o[0]);
  });
  H.iller.forEach((p, i) => { const o = V.ozel[i]; if (o) yazi(p.x, p.y + 3, guzel(o[0]), "ozel"); });
  carpisma();
  $("ozet").innerHTML = `<p class="cumle">81 ilin 57'sinde en çok kullanılan soyadı <b>Yılmaz</b>. Ama her ilin ilk 30'unda, başka illerde pek görülmeyen bir soyadı var. Haritadaki adlar onlar. Birine dokun ya da kendi soyadını yaz.</p>`;
  $("lejant").textContent = "Her ilin üzerinde: o ilin ilk 30'unda olup en az başka ilde görünen soyadı.";
  history.replaceState(null, "", location.pathname);
}

function sorgula(soyYaz) {
  const S = buyuk(soyYaz), k = endeks[S];
  $("geri").hidden = false;
  $("yazi").innerHTML = "";
  if (!k) {
    $("ozet").innerHTML = `<p class="cumle"><b>${esc(guzel(S))}</b> hiçbir ilin en çok kullanılan 30 soyadı arasında değil. TÜİK yalnız ilk 30'u yayımladığı için daha seyrek soyadlarını gösteremiyoruz.</p>`;
    [...$("harita").querySelectorAll("path")].forEach((e) => { e.style.fill = ""; });
    return;
  }
  const renk = getComputedStyle(document.documentElement).getPropertyValue("--vurgu").trim();
  const ilde = new Map(k.map((x) => [x.i, x]));
  [...$("harita").querySelectorAll("path")].forEach((e) => {
    const i = Number(e.dataset.i), x = ilde.get(i);
    e.style.fill = x ? `color-mix(in oklab, ${renk} ${Math.round(100 - (x.sira - 1) * 2.6)}%, var(--il))` : "";
    e.querySelector("title").textContent = x ? `${H.iller[i].ad}: ${x.sira}. sıra, ${sayi(x.sayi)} kişi` : `${H.iller[i].ad}: ilk 30'da değil`;
    e.onclick = null;
  });
  k.forEach((x) => { const p = H.iller[x.i]; yazi(p.x, p.y + 4, x.sira, "sira"); });
  const top = k.reduce((a, b) => a + b.sayi, 0);
  const enSira = [...k].sort((a, b) => a.sira - b.sira || b.sayi - a.sayi)[0];
  const enYogun = [...k].sort((a, b) => b.sayi / NUF[b.i] - a.sayi / NUF[a.i])[0];
  const tr = V.tr.find((x) => x[0] === S);
  let c = `<b>${guzel(S)}</b>, 81 ilin <b>${k.length}</b> tanesinde en çok kullanılan 30 soyadı arasında. En üst sırada olduğu il ${H.iller[enSira.i].ad} (${enSira.sira}.).`;
  c += ` Nüfusa oranla en yoğun olduğu il ${H.iller[enYogun.i].ad}: binde ${sayi(Math.round((10000 * enYogun.sayi) / NUF[enYogun.i]) / 10)}.`;
  if (tr) c += ` Türkiye genelinde ${tr[2]}. sırada, ${sayi(tr[1])} kişi.`;
  else c += ` İlk 30'da olduğu illerde toplam ${sayi(top)} kişi taşıyor.`;
  $("ozet").innerHTML = `<p class="cumle">${c}</p>`;
  $("lejant").textContent = `Sayılar o ildeki sırayı gösteriyor; koyu renk daha üst sıra. Boş iller: ilk 30'da değil.`;
  history.replaceState(null, "", `?soyadi=${encodeURIComponent(guzel(S))}`);
}

function listeler() {
  const yerel = Object.entries(endeks).filter(([, k]) => k.length === 1).map(([s, k]) => [s, k[0]]).sort((a, b) => b[1].sayi - a[1].sayi).slice(0, 15);
  const enb = yerel[0][1].sayi;
  $("yerel").innerHTML = yerel.map(([s, x]) => `<li><button data-s="${s}">${guzel(s)}</button><span class="cubuk" style="width:${(100 * x.sayi) / enb}%;background:var(--vurgu)"></span><span class="deger">${H.iller[x.i].ad}</span></li>`).join("");
  $("yaygin").innerHTML = V.tr.slice(0, 10).map(([s, n]) => `<li><button data-s="${s}">${guzel(s)}</button><span class="cubuk" style="width:${(100 * (endeks[s] || []).length) / 81}%;background:var(--vurgu)"></span><span class="deger">${(endeks[s] || []).length} il</span></li>`).join("");
}

async function baslat() {
  [V, H, NUF] = await Promise.all(["veri/soyadlari.json", "veri/harita.json", "veri/nufus2025.json"].map((u) => fetch(u).then((r) => r.json())));
  V.iller.forEach((liste, i) => liste.forEach(([s, n, r]) => (endeks[s] ||= []).push({ i, sira: r, sayi: n })));
  haritaKur(); listeler();
  $("soylar").innerHTML = Object.keys(endeks).map(guzel).sort((a, b) => a.localeCompare(b, "tr")).map((s) => `<option value="${s}">`).join("");
  $("form").addEventListener("submit", (e) => { e.preventDefault(); sorgula($("soy").value); });
  $("geri").onclick = () => { $("soy").value = ""; ozelHarita(); };
  document.body.addEventListener("click", (e) => { const b = e.target.closest(".liste button"); if (b) { $("soy").value = guzel(b.dataset.s); sorgula(b.dataset.s); $("ozet").scrollIntoView({ behavior: "smooth" }); } });
  const p = new URLSearchParams(location.search).get("soyadi");
  if (p) { $("soy").value = p; sorgula(p); } else ozelHarita();
}
baslat();
