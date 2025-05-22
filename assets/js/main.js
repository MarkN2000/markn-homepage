// assets/js/main.js

document.addEventListener('DOMContentLoaded', function() {
    // --- ページトップへ戻るボタンの処理 ---
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const scrollThreshold = 200;

    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > scrollThreshold) {
                scrollToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
                scrollToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
            } else {
                scrollToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
                scrollToTopBtn.classList.add('opacity-0', 'pointer-events-none');
            }
        });
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- 履歴を戻るボタンの処理 ---
    const historyBackButton = document.getElementById('historyBackButton');
    if (historyBackButton) {
        historyBackButton.addEventListener('click', function() {
            window.history.back();
        });
    }

    // --- リンクコピーボタンの処理 ---
    const copyLinkButton = document.getElementById('copy-link-button');
    const copyLinkFeedback = document.getElementById('copy-link-feedback');
    if (copyLinkButton) {
        copyLinkButton.addEventListener('click', function() {
            const textToCopy = this.dataset.clipboardText;
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(textToCopy).then(function() {
                    if (copyLinkFeedback) {
                        copyLinkFeedback.classList.remove('hidden');
                        setTimeout(function() {
                            copyLinkFeedback.classList.add('hidden');
                        }, 2000);
                    }
                }).catch(function(err) {
                    console.error('リンクのコピーに失敗しました: ', err);
                    alert('リンクのコピーに失敗しました。');
                });
            } else {
                try {
                    const textArea = document.createElement("textarea");
                    textArea.value = textToCopy;
                    textArea.style.position = "fixed";
                    textArea.style.left = "-9999px";
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);

                    if (copyLinkFeedback) {
                        copyLinkFeedback.classList.remove('hidden');
                        setTimeout(function() {
                            copyLinkFeedback.classList.add('hidden');
                        }, 2000);
                    }
                } catch (err) {
                    console.error('フォールバックコピーに失敗しました: ', err);
                    alert('お使いのブラウザでは自動コピーがサポートされていません。手動でURLをコピーしてください。');
                }
            }
        });
    }

    // --- 動的リンクカード処理 ---
    const IS_LOCAL_DEBUG = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const backendApiUrl = '/api/fetch-metadata';

    // デバッグ用のモックデータ
    const MOCK_METADATA = {
        "https://uni-pocket.com/ja/items/3f063a9b-2968-448d-8146-b3d5795d480f": {
            "title": "デバッグ用タイトル1 (画像あり)",
            "description": "これはデバッグ用の詳細説明です。画像が表示されるはずです。",
            "image": "https://uni-pocket.com/_next/image?url=https%3A%2F%2Fassets.resonite.com%2F6c76a879ea76fda334a0294df7f8074cc8e516d182785df45dd90a3d45ad74b8&w=384&q=75",
            "siteName": "テストサイト1"
        },
        "https://example.com/article2": {
            "title": "デバッグ用タイトル2 (画像なし)",
            "description": "こちらは画像がない場合のテストデータです。説明文は少し長めにしてみましょうか。ああああああいいいいい。",
            "image": "",
            "siteName": "テストサイト2"
        },
        "https://resonite.com/": {
            "title": "Resonite - The Future of Social VR",
            "description": "Resonite is a highly flexible and customizable social VR platform. Create, explore, and connect in a universe built by its users.",
            "image": "https://resonite.com/assets/Resonite_sosial_media_image.jpg",
            "siteName": "Resonite Official"
        }
    };

    // この関数は processLinkCards の中で一度だけ定義されるべきヘルパー関数です。
    // processLinkCards のスコープ内に移動するか、またはグローバルスコープで一度だけ定義します。
    // ここでは processLinkCards の前に一度だけ定義します。
function generateLinkCardHtml(href, metadata) {
    const title = metadata.title || '（タイトルなし）';
    const description = metadata.description || '';
    const image = metadata.image || '';
    
    let hostName = '';
    if (href) {
        try {
            const url = new URL(href);
            hostName = url.hostname;
        } catch (e) {
            // URL解析失敗時のフォールバック
        }
    }
    if (metadata.siteName && metadata.siteName.trim() !== '') {
        hostName = metadata.siteName;
    }

    // サイズ定義 (PCでの高さを h-28 に少し戻し、スマホとの差を少なくする)
    const imageHeightClasses = "h-24 md:h-28"; // スマホ:96px, PC:112px
    const imageWidthClasses = "w-24 md:w-28";

    const imageHtml = image ? `
        <div class="flex-shrink-0 ${imageWidthClasses} ${imageHeightClasses} bg-gray-200 rounded-l-lg">
            <img src="${image}" alt="${title} サムネイル"
                 class="w-full h-full object-cover rounded-l-lg">
        </div>` : `
        <div class="flex-shrink-0 ${imageWidthClasses} ${imageHeightClasses} bg-gray-200 rounded-l-lg flex items-center justify-center">
            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7s-.5 1 .5 3M20 7s.5 1-.5 3m-13 3c0 .924.728 2.06 2.5 2.06S12 13.924 12 13m0 0c0 .924-.728 2.06-2.5 2.06S7 13.924 7 13m5 0c0 .924.728 2.06 2.5 2.06S17 13.924 17 13"></path></svg>
        </div>`;

    const textContainerDynamicLeftPadding = image ? 'pl-2 md:pl-3' : ''; // パディング微調整
    const textContainerBasePadding = 'p-2'; // ベースパディング

    // 説明文のクラス
    // スマホ(md未満): 非表示
    // PC (md以上): line-clamp-2 を試みる (md:h-28 の高さで調整)
    const descriptionClasses = "text-xs text-gray-700 leading-tight hidden md:block md:line-clamp-2";

    return `
        <a href="${href}" target="_blank" rel="noopener noreferrer"
            class="my-6 group block bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-shadow duration-200 overflow-hidden">
            <div class="flex items-stretch">
                ${imageHtml}
                <div class="flex flex-col flex-grow min-w-0 ${imageHeightClasses} ${textContainerBasePadding} ${textContainerDynamicLeftPadding} justify-start overflow-hidden">
                    ${hostName ? `<p class="text-xs text-gray-500 line-clamp-1" style="font-size: 0.6rem; margin-bottom: 0; flex-shrink: 0;">${hostName}</p>` : ''}
                    <h3 class="text-sm md:text-base font-semibold text-gray-900 group-hover:text-primary line-clamp-2" style="margin-top: 0.05rem; margin-bottom: 0.1rem; flex-shrink: 0;">${title}</h3>
                    <div class="flex-grow overflow-y-hidden">
                        ${description ? `<p class="${descriptionClasses}" style="font-size: 0.7rem;">${description}</p>` : ''}
                    </div>
                </div>
            </div>
        </a>
    `;
}
    // この関数は一度だけ定義します。
    const processLinkCards = async () => {
        const linkElements = document.querySelectorAll('a.dynamic-link-card');

        for (const linkElement of linkElements) {
            const targetUrl = linkElement.href;
            linkElement.textContent = '読み込み中...';
            let metadata;

            if (IS_LOCAL_DEBUG && MOCK_METADATA[targetUrl]) {
                console.log(`Using mock data for: ${targetUrl}`);
                metadata = MOCK_METADATA[targetUrl];
                if (metadata && metadata.title) {
                    const cardHtml = generateLinkCardHtml(targetUrl, metadata);
                    const cardFragment = document.createRange().createContextualFragment(cardHtml);
                    linkElement.replaceWith(cardFragment);
                } else {
                    linkElement.textContent = targetUrl;
                    linkElement.classList.remove('dynamic-link-card');
                    console.warn('Mock metadata issue or no title for:', targetUrl, metadata);
                }
                continue;
            }
            
            try {
                const response = await fetch(`${backendApiUrl}?url=${encodeURIComponent(targetUrl)}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                metadata = await response.json();

                if (metadata && metadata.title) {
                    const cardHtml = generateLinkCardHtml(targetUrl, metadata);
                    const cardFragment = document.createRange().createContextualFragment(cardHtml);
                    linkElement.replaceWith(cardFragment);
                } else {
                    linkElement.textContent = targetUrl;
                    linkElement.classList.remove('dynamic-link-card');
                    console.warn('Metadata fetching failed or no title for:', targetUrl, metadata);
                }
            } catch (error) {
                console.error('Error fetching link card metadata for:', targetUrl, error);
                linkElement.textContent = targetUrl;
                linkElement.classList.remove('dynamic-link-card');
            }
        }
    };

    // ページ内に dynamic-link-card クラスを持つ要素があれば処理を実行
    if (document.querySelector('a.dynamic-link-card')) {
        processLinkCards();
    }

}); // DOMContentLoaded イベントリスナーの閉じ括弧