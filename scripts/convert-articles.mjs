// convert-articles.mjs
// 用途: サイトリニューアル Phase D「既存記事の一括変換」の一回限りの移行スクリプト。
//   旧記法(ショートコード / dynamic-link-card / noscript / 手書き目次 / prev|next_post_path 等)を
//   新記法(前後空行つき単独行URL・普通の Markdown 画像/リンク)へ機械変換する。
//   docs/redesign-spec.md §3/§7 準拠。記事の文章そのものは変更しない。
// 実行日: 2026-07-11
// 実行方法: node scripts/convert-articles.mjs   (依存パッケージなし / Node18+)
// 冪等ではない前提の一回限りスクリプト。実行後は移行記録としてリポジトリに残す。

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'content', 'posts');

// series を付与する2記事 (SPACE CRAFT STATION シリーズ)
const SERIES_MAP = {
  '2024-03-04-spacecraftstation': 'SPACE CRAFT STATION',
  '2024-03-04-makingofspacecraftstation': 'SPACE CRAFT STATION',
};

const warnings = [];
const stats = {
  youtube: 0, x: 0, figure: 0, dynamicLinkCard: 0,
  noscript: 0, rawAnchor: 0, toc: 0,
  fmPrev: 0, fmNext: 0, fmThumbAlt: 0, series: 0,
  filesChanged: 0,
};

function parseAttrs(s) {
  const attrs = {};
  const re = /(\w+)\s*=\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(s)) !== null) attrs[m[1]] = m[2];
  return attrs;
}

// --- frontmatter 変換 ---
function transformFrontmatter(fm, slug) {
  const lines = fm.split('\n');
  const kept = [];
  for (const line of lines) {
    if (/^\s*prev_post_path\s*:/.test(line)) { stats.fmPrev++; continue; }
    if (/^\s*next_post_path\s*:/.test(line)) { stats.fmNext++; continue; }
    if (/^\s*thumbnail_alt\s*:/.test(line)) { stats.fmThumbAlt++; continue; }
    kept.push(line);
  }
  // series 付与
  if (SERIES_MAP[slug]) {
    const seriesVal = SERIES_MAP[slug];
    // description 行のインデントに合わせて直後に挿入
    let idx = kept.findIndex((l) => /^\s*description\s*:/.test(l));
    let indent = '';
    if (idx === -1) { idx = kept.length - 1; } else {
      const mm = kept[idx].match(/^(\s*)/);
      indent = mm ? mm[1] : '';
    }
    kept.splice(idx + 1, 0, `${indent}series: "${seriesVal}"`);
    stats.series++;
  }
  return kept.join('\n');
}

// --- 本文変換 ---
function transformBody(body, slug) {
  let s = body;

  // (g) 手書き目次セクション: 「## 目次」見出しから次の H2 直前まで削除
  s = s.replace(/^##[ \t]+目次[ \t]*\n[\s\S]*?(?=^##[ \t])/m, () => {
    stats.toc++;
    return '';
  });

  // (e) <noscript>...</noscript> ブロック削除 (行頭インデント・末尾改行も1つ消費)
  s = s.replace(/[^\S\n]*<noscript>[\s\S]*?<\/noscript>[^\S\n]*\n?/gi, () => {
    stats.noscript++;
    return '';
  });

  // (d) dynamic-link-card アンカー -> 単独行URL (href は class より前・単一/二重引用符・複数行の空要素に対応)
  s = s.replace(
    /<a\b[^>]*?\bhref=(["'])([^"']*)\1[^>]*?\bclass=["']dynamic-link-card["'][^>]*>\s*<\/a>/gi,
    (m, q, url) => {
      stats.dynamicLinkCard++;
      return `\n\n${url.trim()}\n\n`;
    }
  );

  // (a) youtube ショートコード -> watch URL (引数はクオート有無どちらも)
  s = s.replace(/\{\{<\s*youtube\s+"?([A-Za-z0-9_-]+)"?\s*>\}\}/g, (m, id) => {
    stats.youtube++;
    return `\n\nhttps://www.youtube.com/watch?v=${id}\n\n`;
  });

  // (c) x ショートコード -> ポストURL (属性順不問)
  s = s.replace(/\{\{<\s*x\s+([^>]*?)\s*>\}\}/g, (m, argstr) => {
    const a = parseAttrs(argstr);
    if (!a.user || !a.id) {
      warnings.push(`[${slug}] x ショートコードの user/id 解析に失敗: ${m}`);
      return m;
    }
    stats.x++;
    return `\n\nhttps://x.com/${a.user}/status/${a.id}\n\n`;
  });

  // (b) figure ショートコード -> Markdown 画像 (行頭インデント保持)
  s = s.replace(/^([ \t]*)\{\{<\s*figure\s+(.*?)\s*>\}\}[ \t]*$/gm, (m, indent, argstr) => {
    const a = parseAttrs(argstr);
    const src = (a.src || '').trim();
    const alt = a.alt != null ? a.alt : (a.caption != null ? a.caption : (a.title != null ? a.title : ''));
    const caption = a.caption != null ? a.caption : a.title; // キャプション = title
    if (!src) {
      warnings.push(`[${slug}] figure に src が無い: ${m}`);
      return m;
    }
    if (caption != null && caption.includes('"')) {
      warnings.push(`[${slug}] figure title に " を含むためスキップ: ${m}`);
      return m;
    }
    if (alt.includes(']') || alt.includes('[')) {
      warnings.push(`[${slug}] figure alt に [ ] を含む(要目視): ${m}`);
    }
    const dest = /\s/.test(src) ? `<${src}>` : src;
    stats.figure++;
    if (caption != null && caption !== '') {
      return `${indent}![${alt}](${dest} "${caption}")`;
    }
    return `${indent}![${alt}](${dest})`;
  });

  // (f) 本文中の生 <a href="U" ...>text</a> -> [text](U)
  s = s.replace(/<a\s+[^>]*?href=(["'])([^"']*)\1[^>]*?>(.*?)<\/a>/gi, (m, q, url, text) => {
    const t = text.trim();
    if (t === '') {
      warnings.push(`[${slug}] テキスト無しの生アンカーをスキップ: ${m}`);
      return m;
    }
    stats.rawAnchor++;
    return `[${t}](${url.trim()})`;
  });

  // (j) 連続空行の正規化: 3改行以上 -> 空行1つ
  s = s.replace(/\n{3,}/g, '\n\n');

  return s;
}

async function processFile(filePath, slug) {
  const raw = await fs.readFile(filePath, 'utf8');
  const eol = raw.includes('\r\n') ? '\r\n' : '\n';
  let content = raw.replace(/\r\n/g, '\n');
  const endsWithNL = content.endsWith('\n');

  const fmMatch = content.match(/^(---\n)([\s\S]*?)(\n---\n?)/);
  let out;
  if (fmMatch) {
    const fmBody = transformFrontmatter(fmMatch[2], slug);
    const rest = content.slice(fmMatch[0].length);
    const newBody = transformBody(rest, slug);
    out = `${fmMatch[1]}${fmBody}${fmMatch[3]}${newBody}`;
  } else {
    out = transformBody(content, slug);
  }

  // 末尾の余分な空行を除去しつつ、元ファイルの最終改行有無を保つ
  out = out.replace(/\n+$/, endsWithNL ? '\n' : '');
  const final = out.replace(/\n/g, eol);

  if (final !== raw) {
    await fs.writeFile(filePath, final, 'utf8');
    stats.filesChanged++;
    return true;
  }
  return false;
}

async function main() {
  const entries = await fs.readdir(POSTS_DIR, { withFileTypes: true });
  const targets = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    if (e.name === '0000-01-01-styleguide') continue; // 除外
    const p = path.join(POSTS_DIR, e.name, 'index.md');
    try { await fs.access(p); } catch { continue; }
    targets.push([p, e.name]);
  }
  // privacy-policy.md も対象(該当変換があれば)
  const priv = path.join(ROOT, 'content', 'privacy-policy.md');
  try { await fs.access(priv); targets.push([priv, 'privacy-policy']); } catch {}

  for (const [p, slug] of targets) {
    const changed = await processFile(p, slug);
    if (changed) console.log(`changed: ${slug}`);
  }

  console.log('\n=== 変換件数 ===');
  console.log(JSON.stringify(stats, null, 2));
  if (warnings.length) {
    console.log('\n=== 警告 / 要確認 ===');
    for (const w of warnings) console.log(w);
  } else {
    console.log('\n警告なし');
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
