// functions/api/callback.js

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get('code');
  // const receivedState = url.searchParams.get('state'); // CSRF対策で検証する

  // (セッションやクッキーから保存したstateを取得し、receivedStateと一致するか検証する処理)

  const GITHUB_CLIENT_ID = context.env.GITHUB_CLIENT_ID;
  const GITHUB_CLIENT_SECRET = context.env.GITHUB_CLIENT_SECRET; // Cloudflare Pagesの環境変数

  if (!code) {
    return new Response('Authentication error: No code received from GitHub.', { status: 400 });
  }

  try {
    // GitHubにアクセストークンをリクエスト
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json', // GitHubはJSON形式のレスポンスを期待
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
        // redirect_uri: new URL('/api/callback', url.origin).toString(), // 検証のために含めることもあります
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GitHub token exchange error:', errorData);
      return new Response(`GitHub token exchange failed: ${errorData.error_description || response.statusText}`, { status: response.status });
    }

    const tokenData = await response.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error('Access token not found in GitHub response:', tokenData);
      return new Response('Authentication error: Access token not retrieved from GitHub.', { status: 500 });
    }

    // Decap CMS (Netlify CMS) の認証完了ページにトークンを渡すHTMLを返す
    // このHTMLはポップアップウィンドウで開かれ、親ウィンドウにメッセージを送信後、自身を閉じる
    const htmlResponse = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Authorizing...</title>
        <script>
          // 親ウィンドウ (CMS管理画面) にメッセージを送信
          // Netlify/Decap CMSは 'authorizing:github' や 'authorization_completed'のようなメッセージを期待することがあります。
          // これはCMSのバージョンやライブラリによって異なる場合があるので、
          // Decap CMSのドキュメントや、i40westのリポジトリの例で使われている
          // 'netlify-cms-app/dist/lib.js' のようなライブラリの挙動を確認してください。
          // 一般的には、{ type: "authorizing", provider: "github", token: "YOUR_ACCESS_TOKEN", scope: "repo" } 
          // のような形式のオブジェクトを文字列化してpostMessageで送ります。
          // 
          // 以下はDecap CMSが期待する形式の一例です。
          // 正確な形式はDecap CMSのドキュメントやソースコードで確認してください。
          const message = {
            type: 'authorizing', // または 'authorization'
            provider: 'github',  // または 'implicit-github' など
            token: '<span class="math-inline">\{accessToken\}',