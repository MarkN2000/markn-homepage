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
        'custom-light-blue': '#ADD8E6',
        'custom-dark-blue': '#0077B6',
      },
      backgroundImage: {
        'tartan-check': "url('/images/bg.png')", // タータンチェックも残しておく場合
        'header-background': "url('/images/header.jpg')", // header.jpgを登録
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
