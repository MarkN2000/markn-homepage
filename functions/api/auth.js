// functions/api/auth.js の修正案（デバッグと確実性のために）

export async function onRequest(context) {
  const GITHUB_CLIENT_ID = context.env.GITHUB_CLIENT_ID;
  const siteUrl = new URL(context.request.url).origin;
  const CALLBACK_URL = `${siteUrl}/api/callback`;

  console.log("Auth function triggered"); // ログ追加
  console.log("Site URL:", siteUrl);
  console.log("Callback URL:", CALLBACK_URL);
  console.log("GITHUB_CLIENT_ID from env:", GITHUB_CLIENT_ID);


  if (!GITHUB_CLIENT_ID) {
    console.error("GitHub Client ID is missing or not configured in environment variables.");
    return new Response("GitHub Client ID not configured. Please check Cloudflare Pages environment variables.", { status: 500 });
  }
  if (typeof GITHUB_CLIENT_ID !== 'string' || GITHUB_CLIENT_ID.includes('<') || GITHUB_CLIENT_ID.includes('{')) {
      console.error("GITHUB_CLIENT_ID seems to be incorrect:", GITHUB_CLIENT_ID);
      return new Response("GitHub Client ID is invalid. It should not contain HTML tags or placeholders.", { status: 500 });
  }


  const encodedCallbackUrl = encodeURIComponent(CALLBACK_URL);
  const state = Math.random().toString(36).substring(7);

  // 文字列連結でURLを組み立てる
  const redirectUri = "https://github.com/login/oauth/authorize" +
                      "?client_id=" + GITHUB_CLIENT_ID +
                      "&redirect_uri=" + encodedCallbackUrl +
                      "&scope=repo" + // スコープを 'repo' に変更（以前の指示通り）
                      "&state=" + state;

  console.log("Redirecting to:", redirectUri); // 組み立てられたURLをログに出力

  return Response.redirect(redirectUri, 302);
}