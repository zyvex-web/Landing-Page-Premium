/* ============================================================
   AURA — Motor de la demo. Lee config.json y renderiza todo.
   Para personalizar la demo NO se toca este archivo: se edita
   config.json (textos, colores, imágenes, precios).
   ============================================================ */
"use strict";

const $ = (sel) => document.querySelector(sel);
const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const stars = (n = 5) => "★".repeat(n);

function boot() {
  const cfg = window.AURA_CONFIG;
  if (!cfg) {
    document.body.innerHTML = '<p style="padding:40px;font-family:sans-serif">No se encontró js/config.js.</p>';
    return;
  }
  applyColors(cfg.marca.colores);
  renderBrand(cfg.marca);
  renderHero(cfg.hero);
  renderBeneficios(cfg.beneficios);
  renderGaleria(cfg.galeria);
  renderOferta(cfg.oferta, cfg.marca);
  renderTestimonios(cfg.testimonios);
  renderFaq(cfg.faq);
  renderCierre(cfg.cierre, cfg.marca);
  renderFooter(cfg.marca);
  setupWhatsApp(cfg.marca);
  setupReveal();
}

function applyColors(c) {
  if (!c) return;
  const map = { primario: "--primario", secundario: "--secundario", acento: "--acento",
    fondo: "--fondo", superficie: "--superficie", texto: "--texto", textoSuave: "--texto-suave" };
  Object.entries(map).forEach(([k, v]) => { if (c[k]) document.documentElement.style.setProperty(v, c[k]); });
}

function renderBrand(m) {
  document.title = `${m.nombre} · ${m.eslogan || ""}`.trim();
  $("#brandLogo").innerHTML = `${m.nombre}<span class="dot">.</span>`;
}

function renderHero(h) {
  const notas = (h.notas || []).map(n => `<span>${n}</span>`).join("");
  $("#hero").append(el(`
    <div class="hero-copy reveal">
      <span class="hero-badge">${h.etiqueta || ""}</span>
      <h1>${h.titulo} <span class="grad">${h.resaltado}</span></h1>
      <p class="lead">${h.subtitulo}</p>
      <div class="hero-cta">
        <a href="#oferta" class="btn btn-primary">${h.ctaPrimario}</a>
        <a href="#beneficios" class="btn btn-ghost">${h.ctaSecundario}</a>
      </div>
      <div class="hero-notas">${notas}</div>
    </div>`));
  $("#hero").append(el(`
    <div class="hero-visual reveal">
      <img src="${h.imagen}" alt="${h.resaltado}" loading="eager">
      <div class="float-card">
        <div class="stars">${stars(5)}</div>
        <div><b>+1,200</b><br><small>clientas felices</small></div>
      </div>
    </div>`));
}

function head(m, target) {
  $(target).append(el(`<div class="head reveal">
    <span class="eyebrow">${m.etiqueta || ""}</span>
    <h2>${m.titulo || ""}</h2>${m.descripcion ? `<p>${m.descripcion}</p>` : ""}</div>`));
}

function renderBeneficios(b) {
  head(b, "#beneficiosMount");
  const grid = el(`<div class="grid-cards"></div>`);
  b.items.forEach(i => grid.append(el(`
    <div class="card reveal"><div class="ico">${i.icono}</div><h3>${i.titulo}</h3><p>${i.texto}</p></div>`)));
  $("#beneficiosMount").append(grid);
}

function renderGaleria(g) {
  head(g, "#galeriaMount");
  const grid = el(`<div class="gal"></div>`);
  g.imagenes.forEach((src, i) => grid.append(el(`
    <figure class="reveal"><img src="${src}" alt="Paso ${i + 1}" loading="lazy"><figcaption>0${i + 1}</figcaption></figure>`)));
  $("#galeriaMount").append(grid);
}

function renderOferta(o, m) {
  const incluye = (o.incluye || []).map(x => `<li>${x}</li>`).join("");
  const wa = waLink(m, `Hola! Quiero aprovechar la oferta: ${o.titulo}`);
  $("#ofertaMount").append(el(`
    <div class="oferta-box reveal">
      <div class="oferta-left">
        <span class="eyebrow">${o.etiqueta || ""}</span>
        <h2>${o.titulo}</h2><p>${o.descripcion || ""}</p>
        <ul>${incluye}</ul>
      </div>
      <div class="oferta-right">
        ${o.precioAnterior ? `<span class="tag">Ahorra hoy</span>` : ""}
        <div class="price">${o.precio}</div>
        ${o.precioAnterior ? `<div class="old">${o.precioAnterior}</div>` : ""}
        <a href="${wa}" target="_blank" rel="noopener" class="btn">${o.cta}</a>
        <small>Pago seguro · Envío gratis · Garantía 15 días</small>
      </div>
    </div>`));
}

function renderTestimonios(t) {
  head(t, "#testimoniosMount");
  const grid = el(`<div class="tst"></div>`);
  t.items.forEach(i => grid.append(el(`
    <div class="card reveal">
      <div class="stars">${stars(5)}</div>
      <p>“${i.texto}”</p>
      <div class="who"><img src="${i.avatar}" alt="${i.nombre}" loading="lazy"><div><b>${i.nombre}</b><small>${i.rol}</small></div></div>
    </div>`)));
  $("#testimoniosMount").append(grid);
}

function renderFaq(f) {
  head(f, "#faqMount");
  const list = el(`<div class="faq-list"></div>`);
  f.items.forEach(i => {
    const item = el(`
      <div class="faq-item reveal">
        <button class="faq-q">${i.q}<span class="chev">+</span></button>
        <div class="faq-a"><p>${i.a}</p></div>
      </div>`);
    item.querySelector(".faq-q").addEventListener("click", () => {
      const open = item.classList.contains("open");
      list.querySelectorAll(".faq-item").forEach(x => { x.classList.remove("open"); x.querySelector(".faq-a").style.maxHeight = null; });
      if (!open) { item.classList.add("open"); const a = item.querySelector(".faq-a"); a.style.maxHeight = a.scrollHeight + "px"; }
    });
    list.append(item);
  });
  $("#faqMount").append(list);
}

function renderCierre(c, m) {
  const wa = waLink(m, `Hola! ${c.cta || "Quiero más información"}`);
  $("#cierreMount").append(el(`
    <div class="reveal">
      <h2>${c.titulo}</h2><p>${c.texto}</p>
      <a href="${wa}" target="_blank" rel="noopener" class="btn btn-primary">${c.cta}</a>
    </div>`));
}

function renderFooter(m) {
  $("#footerMount").append(el(`<a href="#inicio" class="brand">${m.nombre}<span class="dot">.</span></a>`));
  $("#footerMount").append(el(`<small>© 2026 ${m.nombre}. ${m.eslogan || ""}</small>`));
  $("#footerMount").append(el(`<span class="made">Demo por <a href="https://zyvexweby.com" target="_blank" rel="noopener">ZyvexWeb</a></span>`));
}

function waLink(m, msg) {
  return `https://wa.me/${(m.whatsapp || "").replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
}
function setupWhatsApp(m) { $("#waFloat").href = waLink(m, "Hola! Vi la web y quiero más información 😊"); }

function setupReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: .12 });
  document.querySelectorAll(".reveal").forEach(n => io.observe(n));
}

document.addEventListener("DOMContentLoaded", boot);
