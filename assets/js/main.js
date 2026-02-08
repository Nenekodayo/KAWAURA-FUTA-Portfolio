/* ========= main.js =========
- 通常は縦スクロール
- Worksの作品エリア(.works__viewport)にマウスが乗ってる時だけ
  ホイールを横スクロールに変換
- 横が端なら縦スクロールに返す（＝全部見なくても下に行ける）
- テーマ(theme-dark/light)はIntersectionObserverで切替
============================= */

(() => {
  // --- scrollbar width -> CSS var (右帯が隠れない用) ---
  function setScrollbarWidth() {
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--sbw", `${sbw}px`);
  }
  setScrollbarWidth();
  window.addEventListener("resize", setScrollbarWidth);

  // --- theme switch ---
  const sections = Array.from(document.querySelectorAll(".section"));
  const themeObserver = new IntersectionObserver(
    (entries) => {
      const vis = entries.filter((e) => e.isIntersecting);
      if (!vis.length) return;
      vis.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      const top = vis[0].target;

      if (top.classList.contains("section--dark")) {
        document.body.classList.add("theme-dark");
        document.body.classList.remove("theme-light");
      } else if (top.classList.contains("section--light")) {
        document.body.classList.add("theme-light");
        document.body.classList.remove("theme-dark");
      }
    },
    { threshold: [0.35, 0.55, 0.75] }
  );
  sections.forEach((s) => themeObserver.observe(s));

  // --- Works hover-only horizontal wheel ---
  const worksSection = document.querySelector("[data-horizontal]");
  const worksViewport = worksSection?.querySelector(".works__rail");
  const worksTrack = worksSection?.querySelector("[data-htrack]");
  const worksOuter = worksSection?.querySelector(".works__viewport");

  let isHover = false;
  let travel = 0; // 横移動できる最大px
  let x = 0;      // 現在のtranslateX（0〜-travel）

  // マウスが「作品エリア」に乗ってる時だけON
if (worksViewport) {
  worksViewport.addEventListener("mouseenter", () => (isHover = true));
  worksViewport.addEventListener("mouseleave", () => (isHover = false));
}

  function calcTravel() {
  const viewportW = worksOuter.clientWidth;  // ←ここだけ変更
  const trackW = worksTrack.scrollWidth;
  return Math.max(0, trackW - viewportW);
}

  function applyX() {
    if (!worksTrack) return;
    worksTrack.style.transform = `translate3d(${x}px,0,0)`;
  }

  function recalc() {
    travel = calcTravel();
    // travelが変わった時に範囲内へ丸める
    x = Math.max(-travel, Math.min(0, x));
    applyX();
  }

  window.addEventListener("resize", recalc);
  window.addEventListener("load", recalc);
  recalc();

  // ホイール → 横移動に変換（hover時のみ）
  window.addEventListener(
    "wheel",
    (e) => {
      if (!worksSection || !worksViewport || !worksTrack) return;
      if (!isHover) return;
      if (travel <= 0) return;

      // Worksが画面中央付近にないときの暴発防止
      const rect = worksSection.getBoundingClientRect();
      const cy = window.innerHeight * 0.5;
      const inZone = rect.top < cy && rect.bottom > cy;
      if (!inZone) return;

      // ✅ 端なら横をやめて縦へ返す（＝下にスクロールできる）
      const atStart = x >= -1;              // ほぼ0
      const atEnd = x <= -(travel - 1);     // ほぼ-Travel

      if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) {
        return; // preventDefaultしない → 縦スクロールできる
      }

      // 横移動量（好みで調整）
      const speed = 1.0; // 大きいほど速い（0.7〜1.4目安）
      x -= e.deltaY * speed;

      // 範囲にクランプ
      x = Math.max(-travel, Math.min(0, x));
      applyX();

      // 横を動かした時だけ縦スクロールを止める
      e.preventDefault();
    },
    { passive: false }
  );
})();
