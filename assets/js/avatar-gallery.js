// R2の最新カタログを取得し、アバターダウンロードカードを生成する。
(function () {
  "use strict";

  var gallery = document.querySelector(".avatar-gallery[data-catalog-url]");
  if (!gallery) return;

  var catalogURL = gallery.dataset.catalogUrl;
  var intro = gallery.querySelector(".avatar-gallery-intro");
  var grid = gallery.querySelector(".avatar-gallery-grid");
  var fallback = gallery.querySelector(".avatar-gallery-fallback");
  var catalogOrigin = new URL(catalogURL).origin;

  var createCard = function (item) {
    if (!item || typeof item.path !== "string" || typeof item.thumbnail !== "string") return null;

    var packageURL;
    var thumbnailURL;
    try {
      packageURL = new URL(item.path, catalogURL);
      thumbnailURL = new URL(item.thumbnail, catalogURL);
    } catch (_) {
      return null;
    }
    if (packageURL.origin !== catalogOrigin || thumbnailURL.origin !== catalogOrigin) return null;

    var segments = packageURL.pathname.split("/");
    var name = segments[segments.length - 2] || "アバター";
    try { name = decodeURIComponent(name); } catch (_) {}

    var card = document.createElement("a");
    card.className = "avatar-gallery-card";
    card.href = packageURL.href;
    card.setAttribute("download", "");

    var image = document.createElement("img");
    image.className = "avatar-gallery-thumbnail";
    image.src = thumbnailURL.href;
    image.width = 72;
    image.height = 72;
    image.alt = name + " のサムネイル";
    image.loading = "lazy";
    image.decoding = "async";

    var content = document.createElement("span");
    content.className = "avatar-gallery-content";

    var nameLabel = document.createElement("span");
    nameLabel.className = "avatar-gallery-name";
    nameLabel.textContent = name;

    var downloadLabel = document.createElement("span");
    downloadLabel.className = "avatar-gallery-download";
    downloadLabel.textContent = "↓ ダウンロード";

    content.append(nameLabel, downloadLabel);
    card.append(image, content);
    return card;
  };

  fetch(catalogURL)
    .then(function (response) {
      if (!response.ok) throw new Error("カタログを取得できませんでした");
      return response.json();
    })
    .then(function (catalog) {
      if (!Array.isArray(catalog)) throw new Error("カタログの形式が不正です");

      var fragment = document.createDocumentFragment();
      var count = 0;
      catalog.forEach(function (item) {
        var card = createCard(item);
        if (!card) return;
        fragment.appendChild(card);
        count += 1;
      });
      if (!count) throw new Error("表示できるアバターがありません");

      grid.replaceChildren(fragment);
      intro.textContent = count + "体のアバター。カードをクリックするとダウンロードします。";
      fallback.hidden = true;
      gallery.removeAttribute("aria-busy");
    })
    .catch(function () {
      intro.textContent = "アバター一覧を読み込めませんでした。下のリンクから確認してください。";
      gallery.removeAttribute("aria-busy");
    });
})();
