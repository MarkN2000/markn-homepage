// functions/api/auth.js

// i40west/netlify-cms-cloudflare-pages のサンプルをベースにする場合、
// simple-jekyll-auth-functions のような外部ライブラリの形式になっているかもしれません。
// もしそうなっていれば、そのライブラリの指示に従います。
//
// ここでは、より直接的なCloudflare Functionsの書き方で概念を示します。
// 実際のコードは参照リポジトリのものを確認・調整してください。

export async function onRequestGet(context) {
  const GITHUB_CLIENT_ID = context.env.GITHUB_CLIENT_ID;
  if (!GITHUB_CLIENT_ID) {
    return new Response('GITHUB_CLIENT_ID is not set in environment variables.', { status: 500 });
  }

  const siteUrl = new URL(context.request.url).origin; // 例: https://markn-homepage.pages.dev
  
  // ★重要★: GitHub OAuth App で設定した「Authorization callback URL」と
  //           実際に callback.js が処理するFunctionsのパスを正確に指定します。
  const callbackUrl = new URL('/api/callback', siteUrl).toString(); // このパスは callback.js の配置に合わせる
  
  const scope = 'repo,user'; // Decap CMSに必要なスコープ (リポジトリの読み書き、ユーザー情報)

  // CSRF対策のための 'state' パラメータの生成とセッションへの保存
  // (i40westのリポジトリの例では、クッキーを使っているかもしれません)
  const state = crypto.randomUUID(); // より安全なランダム文字列生成方法
  
  // クッキーにstateを保存する例 (HttpOnly, Secure, SameSite属性を適切に設定)
  // Cloudflare Workers/Functions でのクッキー設定方法を確認してください。
  // context.waitUntil(someAsyncStorage.put('oauth_state', state)); // KVなどに保存する例
  // または、署名付きクッキーを使うなど、より安全な方法を検討。
  // ここでは簡略化してURLに含めますが、実際にはセッション管理が必要です。

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: callbackUrl,
    scope: scope,
    state: state, // CSRF対策
  });

  const githubAuthUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;

  // stateをクッキーにセットしてリダイレクト
  const headers = new Headers();
  // headers.append('Set-Cookie', `github_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax`); // SecureはHTTPS時のみ
  // ↑ Cloudflare Pages/Functionsでのクッキー設定は、Responseオブジェクトのheadersで行うか、
  //   return new Response(null, { status: 302, headers: { Location: githubAuthUrl, 'Set-Cookie': ... } });
  //   のようにします。i40west のサンプルを確認してください。

  // ここでは、リダイレクトのみ行い、stateの検証はcallback側で行う前提の簡略例
  return Response.redirect(githubAuthUrl, 302);
}