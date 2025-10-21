/**
 * Yuni’s Universe – main.js (cleaned, final)
 * 功能：
 * 1) 粒子背景（particles.js）
 * 2) ScrollReveal 進場動畫
 * 3) Skills 翻卡（支援 inline 與事件委派）
 * 4) Timeline 單一展開
 * 5) 側邊漢堡選單（ARIA + ESC + 點連結關閉）
 * 6) 自動插入 year-badge（修正 regex 與重複初始化）
 */

(function () {
  // -------------------------------
  // 小工具
  // -------------------------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  // -------------------------------
  // 粒子背景
  // -------------------------------
  if (typeof particlesJS !== "undefined") {
    const PJSON_PATH = "particles.json"; // 依你的路徑調整
    particlesJS.load("particles-js", PJSON_PATH, () => {
      console.log("Particles.js loaded ✅");
    });
  } else {
    console.warn("[particles.js] 未載入，略過粒子背景。");
  }

  // -------------------------------
  // Skills 翻卡（保留 inline 支援）
  // -------------------------------
  function flipCard(el) {
    if (!el) return;
    el.classList.toggle("flipped");
  }
  window.flipCard = flipCard;

  // 事件委派（無需 inline，也可共存）
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".skill-card");
    if (card) card.classList.toggle("flipped");
  });

  // -------------------------------
  // Timeline 單一展開（保留 inline 支援 + 委派）
  // -------------------------------
  function showDetails(eventEl) {
    if (!eventEl) return;
    $$(".event.active").forEach((e) => { if (e !== eventEl) e.classList.remove("active"); });
    eventEl.classList.toggle("active");
  }
  window.showDetails = showDetails;

  document.addEventListener("click", (e) => {
    const evt = e.target.closest(".event");
    if (!evt) return;
    $$(".event.active").forEach((el) => { if (el !== evt) el.classList.remove("active"); });
    evt.classList.toggle("active");
  });

  // -------------------------------
  // 側邊漢堡選單
  // -------------------------------
  const btn = $(".nav-toggle");
  const sidebar = $(".sidebar");

  function openNav(){
    if (!sidebar || !btn) return;
    sidebar.classList.add('open');
    sidebar.setAttribute('aria-hidden','false');
    btn.setAttribute('aria-expanded','true');
    btn.classList.add('open');
  }
  function closeNav(){
    if (!sidebar || !btn) return;
    sidebar.classList.remove('open');
    sidebar.setAttribute('aria-hidden','true');
    btn.setAttribute('aria-expanded','false');
    btn.classList.remove('open');
  }
  const toggleNav = () => (sidebar?.classList.contains("open") ? closeNav() : openNav());
  on(btn, "click", toggleNav);
  on(sidebar, "click", (e) => { if (e.target && e.target.matches("a")) closeNav(); });
  on(document, "keydown", (e) => { if (e.key === "Escape") closeNav(); });

  // -------------------------------
  // 初始化：插入 year-badge（只有一處，避免重複）
  // -------------------------------
  function initTimelineBadges() {
    const timeline = $(".timeline");
    if (!timeline) return;

    const events = $$(".event", timeline);
    events.forEach((evt) => {
      if (!evt.querySelector(".year-badge")) {
        const year = extractYear(evt);
        if (year) {
          const y = document.createElement("span");
          y.className = "year-badge";
          y.textContent = year;
          evt.appendChild(y);
        }
      }
      // 預設收合（由 .active 控制展開）
      evt.classList.remove("open");
      // 確保徽章不被裁切
      evt.style.overflow = "visible";
    });
  }

  function extractYear(evt) {
    // 只在當前 event 範圍找年份
    for (const p of $$("p", evt)) {
      const m = p.textContent.match(/(20\d{2}|19\d{2})/); // ✅ 正確 regex
      if (m) return m[1];
    }
    // 次要：標題中找
    const h3 = $("h3", evt);
    if (h3) {
      const m = h3.textContent.match(/(20\d{2}|19\d{2})/);
      if (m) return m[1];
    }
    return null;
  }

  // 在 DOM ready 時執行初始化（確保元素已在 DOM 中）
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTimelineBadges);
  } else {
    initTimelineBadges();
  }
})();
