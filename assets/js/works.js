// works.js - All Works detail panel

(() => {
  const items = Array.from(document.querySelectorAll(".work-item[data-id]"));
  const panel = document.querySelector("[data-panel]");
  const backdrop = document.querySelector("[data-panel-backdrop]");
  const closeBtn = document.querySelector("[data-panel-close]");

  const elTitle = document.querySelector("[data-panel-title]");
  const elMeta = document.querySelector("[data-panel-meta]");
  const elDesc = document.querySelector("[data-panel-desc]");
  const elTools = document.querySelector("[data-panel-tools]");

  // 仮データ（あとで自由に書き換えOK）
  const WORKS = {
    w01: { title: "Project 01", year: "2026", type: "Avatar Key Visual", desc: "モノクロを基調に、暗く静かな都市の存在感を意識して作成しました。閉塞感のある空間構成とコントラストの強い文字組で引き締まるように構成しました。", tools: "Illustrator" },
    w02: { title: "Project 02", year: "2026", type: "Avatar Key Visual", desc: "キャラクターの動きを生かし魅力が最大限に伝わるよう意識して構成しました。パッと見た時の印象を大切に仕上げました。", tools: "Illustrator" },
    w03: { title: "Project 03", year: "2026", type: "Avatar Key Visual", desc: "複数のポーズを使い、遊びのあるようなデザインに仕上げました。賑やかさの中で、どうやってまとまりを感じさせれるか意識しながら調整しました。", tools: "Illustrator" },
    w04: { title: "Project 04", year: "2026", type: "Avatar Key Visual", desc: "動きのあるポーズを生かしたデザインです。余白を意識した実験的なデザイン。バランスを重視し、寂しくならないように仕上げました。", tools: "Illustrator" },
    w05: { title: "Project 05", year: "2026", type: "Avatar Key Visual", desc: "デジタルUIを見チーフにした、キャラクターが飛び出てきたようなデザインに仕上げました。どこか不思議で印象に残る構成を意識しました。", tools: "Illustrator" },
    w06: { title: "Project 06", year: "2026", type: "Avatar Key Visual", desc: "少しヴィンテージな落ち着いた色合いで構成しました。装飾と情報量を抑え、全体的なバランスを意識して仕上げました。", tools: "Illustrator" },
    w07: { title: "Project 07", year: "2026", type: "Avatar Key Visual", desc: "近未来的な月とうさぎをモチーフにした遊びのあるにぎやかなデザインの中で一枚の中で物語があるかのような設計にしました", tools: "Illustrator" },
    w08: { title: "Project 08", year: "2026", type: "Avatar Key Visual", desc: "UIを取り入れたデジタルから飛び出てきたようなデザインに仕上げました。遊び心を持ってもらえるような印象に仕上げました。", tools: "Illustrator" },
    w09: { title: "Project 09", year: "2026", type: "Poster", desc: "配信者のイベントでポスターを募集していたので応募しました。ブランドや雰囲気を意識したビジュアルに仕上げました。装飾やテクスチャなどを使って高級感を表現しました。", tools: "Illustrator" },
    w10: { title: "Project 10", year: "2026", type: "X Header", desc: "X (旧Twitter)のヘッダーを作成しました。余白を意識し、バランスのとれた構成を重視し作成しました。", tools: "Illustrator" },
    w11: { title: "Project 11", year: "2026", type: "X Header", desc: "X (旧Twitter)のヘッダーを作成しました。誇張しすぎないよう意識し、印象に残りやすいデザインを目指いしました。", tools: "Illustrator" },
    w12: { title: "Project 12", year: "2026", type: "X Header", desc: "X (旧Twitter)のヘッダーを作成しました。大理石調の模様を活かし、幾何学的なデザインを合わせて魅せ過ぎないお洒落なデザインを目指しました。", tools: "Illustrator" },
    w13: { title: "Project 13", year: "2026", type: "Logo", desc: "3Dモデルショップのロゴを作成しました。ISRIを縦に組み合わせ、星の図形を合わせることによって特別感のあるようなビジュアルにしました。", tools: "Illustrator" },
    w14: { title: "Project 14", year: "2026", type: "Logo", desc: "友人のロゴを作成しました。ブルーベリーを思わせる色を使いかわいらしい印象に仕上げました。丸を使いみずみずしさを、細い書体を使いつるのような細い枝を表現しました。", tools: "Illustrator" },
    w15: { title: "Project 15", year: "2026", type: "Logo", desc: "友人のロゴを作成しました。浅いきれいな海をイメージさせるデザインと色使いを意識し、かわいいらしい印象をもってもらえるように仕上げました。", tools: "Illustrator" },
    w16: { title: "Project 16", year: "2026", type: "Logo", desc: "友人のロゴを作成しました。みずみずしい雰囲気が良いと依頼があり、水しぶきのようなデザインを違和感の無いように夏の中の涼しいさを表現しました。", tools: "Illustrator" },
    w17: { title: "Project 17", year: "2026", type: "Logo", desc: "ゲームのグループロゴを作成しました。加速していく時代についていけるようなスピード感を意識し、誇張しすぎない謙虚なデザインに仕上げました。", tools: "Illustrator" },
    // w04〜w15も同じ形式で増やす
  };

  let lastFocus = null;

  function openPanel(id) {
    const data = WORKS[id] || {
      title: "Project Title",
      year: "----",
      type: "Type",
      desc: "説明文（仮）です。",
      tools: "Tools",
    };

    elTitle.textContent = data.title;
    elMeta.textContent = `${data.year} / ${data.type}`;
    elDesc.textContent = data.desc;
    elTools.textContent = data.tools;

    lastFocus = document.activeElement;

    backdrop.hidden = false;
    panel.hidden = false;
    panel.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-panel-open");

    // closeにフォーカス
    closeBtn.focus();
  }

  function closePanel() {
    document.body.classList.remove("is-panel-open");
    panel.setAttribute("aria-hidden", "true");

    // transitionに合わせて非表示
    window.setTimeout(() => {
      panel.hidden = true;
      backdrop.hidden = true;
    }, 260);

    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  // click: open
  items.forEach((btn) => {
    btn.addEventListener("click", () => {
      openPanel(btn.dataset.id);
    });
  });

  // close button
  closeBtn.addEventListener("click", closePanel);

  // click backdrop to close
  backdrop.addEventListener("click", closePanel);

  // Esc to close
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("is-panel-open")) {
      closePanel();
    }
  });
})();
