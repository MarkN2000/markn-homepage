// 実行: node scripts/check-code-copy.mjs
// コピー成功・拒否・API未対応と、繰り返し操作後のアイコン復元を確認する。
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";

const source = await readFile(new URL("../assets/js/site.js", import.meta.url), "utf8");
const icon = '<svg aria-hidden="true"><rect /></svg>';
const code = 'const value = "<コード>";\n';

for (const result of ["成功", "拒否", "未対応"]) {
  let html = icon;
  let click;
  const attributes = { "aria-label": "コードをコピー" };
  const timers = [];
  const writes = [];
  const button = {
    get innerHTML() { return html; },
    set innerHTML(value) { html = value; },
    get textContent() { return html.replace(/<[^>]*>/g, ""); },
    set textContent(value) { html = value; },
    setAttribute(name, value) { attributes[name] = value; },
    addEventListener(type, handler) { assert.equal(type, "click"); click = handler; },
    parentElement: { querySelector: () => ({ innerText: code }) },
  };
  const navigator = result === "未対応" ? {} : {
    clipboard: { writeText(text) {
      writes.push(text);
      return result === "成功" ? Promise.resolve() : Promise.reject(new Error("拒否"));
    } },
  };
  runInNewContext(source, {
    document: {
      querySelector: () => null,
      getElementById: () => null,
      querySelectorAll: selector => selector === ".code-wrap .copy" ? [button] : [],
    },
    navigator,
    setTimeout(callback, delay) { assert.equal(delay, 1600); timers.push(callback); },
  });

  for (let attempt = 1; attempt <= 2; attempt++) {
    click();
    await new Promise(setImmediate);
    const message = result === "成功" ? "コピーしました" : "コピーできませんでした";
    assert.equal(button.textContent, message);
    assert.equal(attributes["aria-label"], message);
    assert.deepEqual(writes, result === "未対応" ? [] : Array(attempt).fill(code));
    assert.equal(timers.length, 1);
    timers.shift()();
    assert.equal(button.innerHTML, icon);
    assert.equal(attributes["aria-label"], "コードをコピー");
  }
}
console.log("コードコピー: 成功・拒否・未対応・アイコン復元の確認に成功しました");
