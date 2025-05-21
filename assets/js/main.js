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