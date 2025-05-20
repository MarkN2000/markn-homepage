// functions/api/callback.js

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state"); // 必要であればstateの検証も行う

  if (!code) {
    return new Response("No code received from GitHub.", { status: 400 });
  }

  const GITHUB_CLIENT_ID = env.GITHUB_CLIENT_ID;
  const GITHUB_CLIENT_SECRET = env.GITHUB_CLIENT_SECRET;

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    return new Response("GitHub credentials not configured in environment.", { status: 500 });
  }

  try {
    // GitHubにアクセストークンをリクエスト
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
        // redirect_uri: `${url.origin}/api/callback` // GitHub OAuth App設定と一致させる
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("GitHub token exchange error:", errorText);
      return new Response(`Error fetching token from GitHub: ${errorText}`, { status: tokenResponse.status });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error("No access token in GitHub response:", tokenData);
      return new Response("No access token found in GitHub response.", { status: 500 });
    }

    const escapedAccessToken = JSON.stringify(accessToken);
    const decapCmsOriginString = "https://markn-homepage.pages.dev"; // 固定文字列で指定する例

    const htmlResponse = `
    <!DOCTYPE html>
    <html>
    <head>
        <script>
        (function() {
            const tokenValue = JSON.parse(${escapedAccessToken}); // JSON.parseで元の値に戻す
            const data = {
            token: tokenValue,
            provider: "github"
            };
            const message = {
            type: "authorization_response",
            data: data
            };
            const targetOrigin = "${decapCmsOriginString}"; // 正しいオリジン文字列が展開される

            // ... postMessage処理 ...
        })();
        </script>
    </head>
    <body>...</body>
    </html>
    `;
    return new Response(htmlResponse, { headers: { 'Content-Type': 'text/html' } });