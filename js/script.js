/* =========================================================
   VAYORA — plain JavaScript (no build step, no dependencies)
   ========================================================= */

/* ---- 1. Your WhatsApp Business number (international, digits only) ----
   Change this one line to go live. Example: "2348012345678"            */
var WHATSAPP_NUMBER = "2340000000000";

(function () {
  "use strict";

  var waBase = "https://wa.me/" + WHATSAPP_NUMBER;

  /* ---------- footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- whatsapp links ---------- */
  var waLink = document.getElementById("waLink");
  var waSocial = document.getElementById("waSocial");
  if (waLink) waLink.href = waBase;
  if (waSocial) waSocial.href = waBase;

  /* ---------- mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMobile");
  var scrim = document.getElementById("navScrim");

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.hidden = !open;
    if (scrim) scrim.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(menu.hidden);
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    if (scrim) scrim.addEventListener("click", function () { setMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
    // keep the menu honest when the layout switches to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 760) setMenu(false);
    });
  }

  /* ---------- header state on scroll ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 20) header.classList.add("is-stuck");
    else header.classList.remove("is-stuck");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- active section in the nav ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-desktop a[href^='#']"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- reveal on scroll ----------
     IntersectionObserver drives the effect, and a sweep on every scroll
     makes sure nothing can stay invisible (fast flicks, skipped frames). */
  var revealables = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  function show(el) { el.classList.add("is-visible"); }

  function sweep() {
    var limit = window.innerHeight * 0.95;
    for (var i = 0; i < revealables.length; i++) {
      var el = revealables[i];
      if (el.classList.contains("is-visible")) continue;
      var top = el.getBoundingClientRect().top;
      if (top < limit) show(el);
    }
  }

  if (revealables.length) {
    var pending = false;
    var onSweepScroll = function () {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(function () { pending = false; sweep(); });
    };
    window.addEventListener("scroll", onSweepScroll, { passive: true });
    window.addEventListener("resize", onSweepScroll);

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            show(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05 });
      revealables.forEach(function (el) { io.observe(el); });
    }
    sweep();
    window.addEventListener("load", sweep);
    window.setTimeout(sweep, 1200);
  }

  /* ---------- booking form -> WhatsApp ---------- */
  var form = document.getElementById("bookForm");
  var note = document.getElementById("formNote");

  function showNote(text, ok) {
    if (!note) return;
    note.textContent = text;
    note.classList.toggle("ok", !!ok);
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.elements.name.value.trim();
      var service = form.elements.service.value;
      var date = form.elements.date.value;
      var details = form.elements.details.value.trim();

      if (!name) {
        showNote("Please add your name so we know who we're speaking to.");
        form.elements.name.classList.add("invalid");
        form.elements.name.focus();
        return;
      }
      form.elements.name.classList.remove("invalid");

      var lines = [
        "Hello VAYORA, I'm " + name + ".",
        "Service: " + service,
        "Date: " + (date || "Flexible"),
        details ? details : ""
      ];
      var message = lines.filter(Boolean).join("\n");
      var url = waBase + "?text=" + encodeURIComponent(message);

      showNote("Opening WhatsApp — if nothing happens, tap the WhatsApp card.", true);
      var win = window.open(url, "_blank", "noopener");
      if (!win) window.location.href = url;
    });

    form.elements.name.addEventListener("input", function () {
      this.classList.remove("invalid");
      showNote("", false);
    });
  }
})();
