// assets/js/main.js

document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const scrollThreshold = 200; // ボタンを表示し始めるスクロール量 (ピクセル)

    if (scrollToTopBtn) {
        // スクロールイベントのリスナー
        window.addEventListener('scroll', function() {
            if (window.scrollY > scrollThreshold) {
                scrollToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
                scrollToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
            } else {
                scrollToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
                scrollToTopBtn.classList.add('opacity-0', 'pointer-events-none');
            }
        });

        // クリックイベントのリスナー
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // スムーズスクロール
            });
        });
    }
    
        const historyBackButton = document.getElementById('historyBackButton');

    if (historyBackButton) {
        historyBackButton.addEventListener('click', function() {
            window.history.back();
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // (既存の scrollToTopBtn や historyBackButton のコードはそのまま)

    const copyLinkButton = document.getElementById('copy-link-button');
    const copyLinkFeedback = document.getElementById('copy-link-feedback');

    if (copyLinkButton) {
        copyLinkButton.addEventListener('click', function() {
            const textToCopy = this.dataset.clipboardText;
            if (navigator.clipboard && window.isSecureContext) { // navigator.clipboardはHTTPSまたはlocalhostでのみ利用可能
                navigator.clipboard.writeText(textToCopy).then(function() {
                    // コピー成功時のフィードバック
                    if (copyLinkFeedback) {
                        copyLinkFeedback.classList.remove('hidden');
                        setTimeout(function() {
                            copyLinkFeedback.classList.add('hidden');
                        }, 2000); // 2秒後にフィードバックを隠す
                    }
                }).catch(function(err) {
                    console.error('リンクのコピーに失敗しました: ', err);
                    alert('リンクのコピーに失敗しました。');
                });
            } else {
                // navigator.clipboardが使えない場合のフォールバック (旧式のexecCommandなどを使うこともできるが、ここではアラートのみ)
                // より堅牢にする場合は、textareaを動的に生成してコピーするなどの旧来の方法を実装
                try {
                    const textArea = document.createElement("textarea");
                    textArea.value = textToCopy;
                    textArea.style.position = "fixed"; // 画面外に隠す
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
});


document.addEventListener('DOMContentLoaded', function() {
    // (既存の scrollToTopBtn や historyBackButton, copy-link-button のコードはそのまま)

    const processLinkCards = async () => {
        const linkElements = document.querySelectorAll('a.dynamic-link-card');
        const backendApiUrl = '/api/fetch-metadata'; // Cloudflare Workerを想定した相対パス

        for (const linkElement of linkElements) {
            const targetUrl = linkElement.href;
            linkElement.textContent = '読み込み中...'; // 一時的なローディング表示

            try {
                const response = await fetch(`${backendApiUrl}?url=${encodeURIComponent(targetUrl)}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const metadata = await response.json();

                if (metadata && metadata.title) {
                    const cardHtml = generateLinkCardHtml(targetUrl, metadata);
                    const cardFragment = document.createRange().createContextualFragment(cardHtml);
                    linkElement.replaceWith(cardFragment);
                } else {
                    // メタデータが取得できなかった場合、元のリンクに戻すか、エラー表示
                    linkElement.textContent = targetUrl; // または linkElement.innerHTML = `取得失敗: <a href="${targetUrl}" target="_blank" rel="noopener noreferrer">${targetUrl}</a>`;
                    linkElement.classList.remove('dynamic-link-card'); // 再処理を防ぐ
                    console.warn('Metadata fetching failed or no title for:', targetUrl, metadata);
                }
            } catch (error) {
                console.error('Error fetching link card metadata for:', targetUrl, error);
                linkElement.textContent = targetUrl; // エラー時は元のリンクを表示
                linkElement.classList.remove('dynamic-link-card');
                // linkElement.innerHTML = `エラー: <a href="${targetUrl}" target="_blank" rel="noopener noreferrer">${targetUrl}</a>`;
            }
        }
    };

    function generateLinkCardHtml(href, metadata) {
        const title = metadata.title || '（タイトルなし）';
        const description = metadata.description || '';
        const image = metadata.image || '';
        const siteName = metadata.siteName || ''; // metadata.site から変更

        // layouts/shortcodes/link-card.html の構造を参考にする
        // 画像がある場合とない場合で sm:flex-row-reverse の有無やsm:w-2/3などを調整
        const hasImageClass = image ? 'sm:flex-row-reverse' : '';
        const textContentWidthClass = image ? 'sm:w-2/3 md:w-3/5' : 'w-full';

        return `
            <a href="${href}" target="_blank" rel="noopener noreferrer"
                class="my-6 group block bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-shadow duration-200 overflow-hidden">
                <div class="flex flex-col ${hasImageClass}">
                    <div class="p-4 sm:p-5 flex flex-col justify-between flex-grow ${textContentWidthClass}">
                        <div>
                            <h3 class="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-primary mb-1 transition-colors duration-150 line-clamp-2">${title}</h3>
                            ${description ? `<p class="text-xs sm:text-sm text-gray-700 mb-2 line-clamp-3">${description}</p>` : ''}
                        </div>
                        ${siteName ? `<p class="text-xs text-gray-500 mt-auto pt-2">${siteName}</p>` : ''}
                    </div>
                    ${image ? `
                    <div class="flex-shrink-0 sm:w-1/3 md:w-2/5 h-40 sm:h-auto bg-gray-100">
                        <img src="${image}" alt="${title} サムネイル" 
                            class="w-full h-full object-cover">
                    </div>` : ''}
                </div>
            </a>
        `;
    }

    if (document.querySelector('a.dynamic-link-card')) {
        processLinkCards();
    }
});