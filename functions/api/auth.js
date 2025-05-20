// functions/api/auth.js

export async function onRequest(context) {
  // 環境変数から GitHub Client ID を取得
  const GITHUB_CLIENT_ID = context.env.GITHUB_CLIENT_ID;
  if (!GITHUB_CLIENT_ID) {
    return new Response("GitHub Client ID not configured.", { status: 500 });
  }

  // GitHub OAuth App で設定したコールバックURL
  // request.url.origin を使うことで、デプロイ先のオリジンを動的に取得
  const siteUrl = new URL(context.request.url).origin;
  const CALLBACK_URL = `${siteUrl}/api/callback`; 

  // 認証後のリダイレクト先やスコープなどを設定
  const redirectUri = `https://github.com/login/oauth/authorize?client_id=<span class="math-inline">\{GITHUB\_CLIENT\_ID\}&redirect\_uri\=</span>{encodeURIComponent(CALLBACK_URL)}&scope=repo&state=${Math.random().toString(36).substring(7)}`;
  // 'repo' スコープはプライベートリポジトリへのアクセスも許可します。必要に応じて調整してください。

  return Response.redirect(redirectUri, 302);
}