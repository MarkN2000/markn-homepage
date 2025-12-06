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

    function createSkeletonCardElement(originalHref) {
        const skeletonAnchor = document.createElement('a');
        skeletonAnchor.href = originalHref;
        skeletonAnchor.target = "_blank";
        skeletonAnchor.rel = "noopener noreferrer";
        skeletonAnchor.className = "my-6 group block bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden";
        skeletonAnchor.innerHTML = `
            <div class="flex items-stretch animate-pulse">
                <div class="flex-shrink-0 w-24 md:w-28 h-24 md:h-28 bg-gray-300 rounded-l-lg"></div>
                <div class="flex flex-col flex-grow min-w-0 h-24 md:h-28 p-3 space-y-2 justify-center">
                    <div class="h-3 bg-gray-300 rounded w-1/3"></div>
                    <div class="h-5 bg-gray-300 rounded w-5/6"></div>
                    <div class="hidden md:block space-y-1 flex-grow pt-1">
                        <div class="h-3 bg-gray-300 rounded w-full"></div>
                        <div class="h-3 bg-gray-300 rounded w-4/5"></div>
                    </div>
                </div>
            </div>
        `;
        return skeletonAnchor;
    }

    function generateLinkCardHtml(href, metadata) {
        const title = metadata.title || '（タイトルなし）'; // フォールバックタイトルは呼び出し側で設定する方針へ
        const description = metadata.description || '';
        const image = metadata.image || '';
        
        let hostName = '';
        if (href) {
            try {
                const url = new URL(href);
                hostName = url.hostname;
            } catch (e) {}
        }
        // metadata.siteName が空文字列やnullの場合も考慮
        if (metadata.siteName && metadata.siteName.trim() !== '') {
            hostName = metadata.siteName;
        } else if (!hostName && href) { // siteNameが無く、最初のhostname取得も失敗していた場合（ほぼないが念のため）
             try { hostName = new URL(href).hostname; } catch(e) {}
        }


        const imageHeightClasses = "h-24 md:h-28";
        const imageWidthClasses = "w-24 md:w-28";
const imageHtml = image ? `
            <div class="flex-shrink-0 ${imageWidthClasses} ${imageHeightClasses} bg-gray-200 rounded-l-lg overflow-hidden">
                <img src="${image}" alt="${title} サムネイル" class="w-full h-full object-fill rounded-l-lg">
            </div>` : `
            <div class="flex-shrink-0 ${imageWidthClasses} ${imageHeightClasses} bg-gray-200 rounded-l-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12" viewBox="0 -960 960 960" fill="#d1d5db"><path d="M218-320q-42 0-75.5-27T100-416L71-550l-44 3-7-80q78-7 133.5-10t99.5-3q65 0 105 6t72 21q14 7 26.5 10t23.5 3q11 0 21.5-3t24.5-9q33-15 76-21.5t114-6.5q46 0 102 3t122 9l-7 79-43-3-30 137q-9 42-42 68.5T743-320h-89q-42 0-74-25.5T538-411l-27-107h-61l-27 107q-11 41-43 66t-73 25h-89Zm-40-112q3 14 14 23t25 9h89q14 0 25-8.5t14-21.5l31-121q-27-5-61-6.5t-62-1.5q-23 0-49.5.5T154-556l24 124Zm437 2q3 13 14 21.5t25 8.5h89q14 0 25-9t14-23l26-125q-20-1-46-1.5t-46-.5q-30 0-66.5 1.5T584-551l31 121Z"/></svg>
            </div>`;
        const textContainerDynamicLeftPadding = image ? 'pl-2 md:pl-3' : 'pl-2 md:pl-3';
        const textContainerBasePadding = 'p-2';
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

    async function loadAndRenderCard(skeletonCardNode) {
        const targetUrl = skeletonCardNode.href;
        let metadata;
        let hostnameForFallback = '';
        try {
            hostnameForFallback = new URL(targetUrl).hostname;
        } catch (e) {
            // targetUrlが不正な場合は、そのままエラー処理に進む
            console.error('Invalid targetUrl for card:', targetUrl, e);
        }

        if (IS_LOCAL_DEBUG && MOCK_METADATA[targetUrl]) {
            console.log(`Using mock data for: ${targetUrl}`);
            metadata = MOCK_METADATA[targetUrl];
            await new Promise(resolve => setTimeout(resolve, 500));
        } else {
            try {
                const response = await fetch(`${backendApiUrl}?url=${encodeURIComponent(targetUrl)}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                metadata = await response.json();
            } catch (error) {
                console.error('Error fetching link card metadata for:', targetUrl, error);
                metadata = null; // APIエラー時はnullとして扱う
            }
        }

        // metadataがnull(APIエラー)でも、最低限の情報でカードを生成する
        const effectiveMetadata = {
            title: metadata?.title || hostnameForFallback || '（タイトル取得失敗）', // function側でhostnameが入るが念のため
            description: metadata?.description || '',
            image: metadata?.image || '',
            siteName: metadata?.siteName || hostnameForFallback || '' // function側でhostnameが入るが念のため
        };
        
        // 常にカード形式で表示を試みる
        const cardHtml = generateLinkCardHtml(targetUrl, effectiveMetadata);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cardHtml.trim();
        const finalCardElement = tempDiv.firstChild;

        if (finalCardElement) {
            skeletonCardNode.replaceWith(finalCardElement);
            if (!metadata || !metadata.title) { // APIエラーやタイトルが実質ない場合
                 console.warn('Metadata incomplete or fetch failed for:', targetUrl, '. Rendered with defaults.');
            }
        } else {
            // カードHTMLの生成自体に失敗するようなレアケース (通常は発生しづらい)
            console.error('Card HTML generation failed for:', targetUrl);
            const fallbackLink = document.createElement('a');
            fallbackLink.href = targetUrl;
            fallbackLink.textContent = targetUrl;
            fallbackLink.className = 'text-primary hover:underline my-6 block';
            skeletonCardNode.replaceWith(fallbackLink);
        }
    }
    
    function handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skeletonCardNode = entry.target;
                loadAndRenderCard(skeletonCardNode);
                observer.unobserve(skeletonCardNode);
            }
        });
    }

    const processLinkCards = () => {
        const linkElements = document.querySelectorAll('a.dynamic-link-card');
        if (linkElements.length === 0) {
            return;
        }
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        const observer = new IntersectionObserver(handleIntersection, observerOptions);
        linkElements.forEach(linkElement => {
            const targetUrl = linkElement.href;
            const skeletonCardNode = createSkeletonCardElement(targetUrl);
            linkElement.replaceWith(skeletonCardNode);
            observer.observe(skeletonCardNode);
        });
    };

    if (document.querySelector('a.dynamic-link-card')) {
        processLinkCards();
    }
});