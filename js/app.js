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
  renderContacto(cfg.contacto, cfg.marca);
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

const ICONS = {
  facebook: '<path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.7-1.6 1.5V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/>',
  instagram: '<path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM18 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/>',
  tiktok: '<path d="M16 3c.6 2.3 2.2 4 4.5 4.6V11c-1.8-.1-3.5-.7-4.9-1.7v5.6A5.9 5.9 0 1 1 10 9.1v3a2.9 2.9 0 1 0 2 2.7V3h4z"/>'
};
function socialHTML(redes) {
  if (!redes) return "";
  const items = Object.entries(redes).filter(([k, v]) => v && ICONS[k])
    .map(([k, v]) => `<a href="${v}" target="_blank" rel="noopener" aria-label="${k}"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">${ICONS[k]}</svg></a>`).join("");
  return items ? `<div class="socials">${items}</div>` : "";
}

function renderContacto(c, m) {
  if (!c) return;
  head(c, "#contactoMount");
  const info = `<div class="form-info"><h3>${c.infoTitulo || "Escríbenos"}</h3><p>${c.infoTexto || ""}</p>
    <ul class="form-contact">${m.email ? `<li>✉️ ${m.email}</li>` : ""}${m.whatsapp ? `<li>📱 +${m.whatsapp.replace(/\D/g, "")}</li>` : ""}</ul>${socialHTML(m.redes)}</div>`;
  const form = `<form class="form-box" novalidate>
      <div class="frow"><input required name="nombre" placeholder="Tu nombre"><input required type="email" name="email" placeholder="Tu correo"></div>
      <textarea required name="mensaje" rows="4" placeholder="Cuéntanos qué necesitas..."></textarea>
      <button type="submit" class="btn btn-primary">${c.boton || "Enviar mensaje"}</button>
      <p class="form-ok" style="display:none">✅ ¡Gracias! Tu mensaje se preparó. Te contactaremos pronto.</p></form>`;
  const grid = el(`<div class="form-grid reveal">${info}${form}</div>`);
  const f = grid.querySelector("form");
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!f.checkValidity()) { f.reportValidity(); return; }
    const d = new FormData(f);
    window.open(waLink(m, `Hola ${m.nombre}! Soy ${d.get("nombre")} (${d.get("email")}).\n${d.get("mensaje")}`), "_blank");
    grid.querySelector(".form-ok").style.display = "block";
    f.reset();
  });
  $("#contactoMount").append(grid);
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
  if (m.redes) $("#footerMount").append(el(socialHTML(m.redes) || "<span></span>"));
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
