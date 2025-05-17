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
});