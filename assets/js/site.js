// site.js — 依存ゼロの vanilla JS。
// トップへ戻る / auto-hideヘッダー / コードコピー / リンクコピー / 検索 / YouTubeファサード / TOC scrollspy。
(function () {
  "use strict";

  // --- auto-hideヘッダー (下スクロールで隠す、上スクロールで再表示) ---
  var header = document.querySelector(".site-header");
  if (header) {
    var anchorY = window.scrollY;
    var onHeaderScroll = function () {
      var y = window.scrollY;
      if (y < 80) {
        header.classList.remove("is-hidden");
        anchorY = y;
        return;
      }
      var diff = y - anchorY;
      if (Math.abs(diff) < 8) return;
      if (diff > 0) header.classList.add("is-hidden");
      else header.classList.remove("is-hidden");
      anchorY = y;
    };
    window.addEventListener("scroll", onHeaderScroll, { passive: true });
  }

  // --- トップへ戻るボタン (スクロール 600px 超で出現) ---
  var toTop = document.querySelector(".back-to-top");
  if (toTop) {
    var onScroll = function () {
      if (window.scrollY > 600) toTop.classList.add("show");
      else toTop.classList.remove("show");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // --- コードブロックのコピーボタン ---
  document.querySelectorAll(".code-wrap .copy").forEach(function (b) {
    b.addEventListener("click", function () {
      var pre = b.parentElement.querySelector("pre");
      if (!pre) return;
      var reset = function () { setTimeout(function () { b.textContent = "コピー"; }, 1600); };
      var done = function () { b.textContent = "コピーしました"; reset(); };
      var fail = function () { b.textContent = "コピーできませんでした"; reset(); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(pre.innerText).then(done, fail);
      } else {
        fail();
      }
    });
  });

  // --- リンクをコピー (記事シェア行) ---
  document.querySelectorAll(".copy-link").forEach(function (b) {
    var label = b.innerHTML;
    b.addEventListener("click", function () {
      var url = b.dataset.url || location.href;
      var done = function () {
        b.classList.add("copied");
        b.innerHTML = "コピーしました";
        setTimeout(function () { b.classList.remove("copied"); b.innerHTML = label; }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, done);
      else done();
    });
  });

  // --- YouTube ファサード → クリックで本物のプレイヤーに差し替え ---
  document.querySelectorAll(".yt-facade").forEach(function (b) {
    b.addEventListener("click", function () {
      var id = b.dataset.id;
      if (!id) return;
      var wrap = document.createElement("div");
      wrap.className = "yt-embed";
      var f = document.createElement("iframe");
      f.src = "https://www.youtube.com/embed/" + id + "?autoplay=1";
      f.title = "YouTube";
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      f.allowFullscreen = true;
      wrap.appendChild(f);
      b.replaceWith(wrap);
    });
  });

  // --- TOC scrollspy (デスクトップ追従目次) ---
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".toc a[href^='#']"));
  if (tocLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    var targets = [];
    tocLinks.forEach(function (a) {
      var id = decodeURIComponent(a.getAttribute("href").slice(1));
      var el = document.getElementById(id);
      if (el) { byId[id] = a; targets.push(el); }
    });
    var current = null;
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          if (current) current.classList.remove("now");
          var a = byId[e.target.id];
          if (a) { a.classList.add("now"); current = a; }
        }
      });
    }, { rootMargin: "0px 0px -75% 0px", threshold: 0 });
    targets.forEach(function (t) { spy.observe(t); });
  }

  // --- 記事検索 (/posts/ のみ) ---
  var input = document.getElementById("post-search");
  var results = document.getElementById("search-results");
  var grid = document.getElementById("post-grid");
  var pager = document.getElementById("post-pagination");
  var empty = document.getElementById("search-empty");
  if (input && results && grid) {
    var index = null;
    var esc = function (s) {
      return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    };
    // Hugo 側 card.html の `hash.FNV32a` と同一結果になる FNV-1a 32bit。
    // 入力は .Title の UTF-8 バイト列 (グリッドと検索結果でグラデ色を一致させる)。
    var hash = function (s) {
      var bytes = unescape(encodeURIComponent(String(s == null ? "" : s)));
      var h = 0x811c9dc5, i;
      for (i = 0; i < bytes.length; i++) {
        h ^= bytes.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
      }
      return h >>> 0;
    };
    var cardHTML = function (p) {
      var href = p.external ? p.external : p.permalink;
      var ext = p.external ? ' target="_blank" rel="noopener noreferrer"' : "";
      var cover = p.thumbnail
        ? '<div class="cover"><img src="' + esc(p.thumbnail) + '" alt="' + esc(p.title) + '" loading="lazy"></div>'
        : '<div class="cover g' + (1 + (hash(p.title) % 4)) + '">' + esc(p.emoji || "📝") + "</div>";
      var meta = "<span>" + esc(p.date) + "</span>";
      if (p.external) meta += '<span class="ext">リンク ↗</span>';
      var tags = p.tags || [];
      tags.slice(0, 3).forEach(function (t) { meta += '<span class="tag">' + esc(t) + "</span>"; });
      if (tags.length > 3) meta += '<span class="tag tag-more">+' + (tags.length - 3) + "</span>";
      return '<a class="card" href="' + esc(href) + '"' + ext + ">" + cover +
        '<div class="body"><h3>' + esc(p.title) + '</h3><div class="meta">' + meta + "</div></div></a>";
    };
    var showList = function (show) {
      grid.hidden = !show;
      if (pager) pager.hidden = !show;
      results.hidden = show;
      if (empty) empty.hidden = true;
    };
    var run = function (q) {
      q = q.trim().toLowerCase();
      if (q.length < 2) { showList(true); results.innerHTML = ""; return; }
      var hits = index.filter(function (p) {
        var hay = (p.title + " " + (p.tags || []).join(" ") + " " + (p.description || "")).toLowerCase();
        return hay.indexOf(q) !== -1;
      });
      showList(false);
      results.innerHTML = hits.map(cardHTML).join("");
      if (empty) empty.hidden = hits.length !== 0;
    };
    var ensure = function () {
      if (index) return Promise.resolve();
      return fetch("/posts/index.json").then(function (r) { return r.json(); }).then(function (d) { index = d; });
    };
    input.addEventListener("input", function () {
      ensure().then(function () { run(input.value); });
    });
  }
})();
