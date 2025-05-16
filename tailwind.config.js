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
      // ここにテーマのカスタマイズを記述します
      // 例:
      // colors: {
      //   'brand-blue': '#1992d4',
      // },
      // fontFamily: {
      //   sans: ['Inter', 'sans-serif'],
      // },
    },
  },
  plugins: [
    // ここにTailwind CSSプラグインを追加します
    // 例:
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/forms'),
  ],
}
