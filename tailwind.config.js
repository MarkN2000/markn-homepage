// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './hugo_stats.json', // Hugoのビルド統計情報からクラスをスキャンする場合
    './layouts/**/*.html', // レイアウトファイル内のHTML
    './content/**/*.md',   // Markdownコンテンツファイル
    './assets/js/**/*.js', // JavaScriptファイル (Alpine.jsなどを使用する場合)
    // 必要に応じて他のパスを追加
  ],
   theme: {
    extend: {
      colors: {
        'custom-light-blue': '#ADD8E6', // 例: 明るい水色 (具体的なカラーコードは調整可能)
        'custom-dark-blue': '#0077B6',  // 例: やや濃い水色 (リンク色など)
        // 他にも名刺で使われている色があれば追加
      },
      backgroundImage: {
        'tartan-check': "url('/images/bg.png')",
      }
    },
  },
  plugins: [
    // ここにTailwind CSSプラグインを追加します
    // 例:
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/forms'),
  ],
}
