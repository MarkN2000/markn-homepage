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

    // Decap CMS に渡すHTMLとJavaScriptを生成
    // request.headers.get('referer') や url.origin を使って動的にオリジンを決定する
    // ただし、refererが常に存在し、かつ安全であるとは限らないため注意
    // 確実なのは、環境変数などでDecap CMSのデプロイオリジンを固定で指定することです。
    const decapCmsOrigin = url.origin; // 最も単純なのは現在のFunctionのオリジン = サイトのオリジン
                                    // 厳密には Decap CMS admin ページのオリジン

    const htmlResponse = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Authenticating...</title>
        <script>
          (function() {
            const data = {
              token: "<span class="math-inline">\{accessToken\}",
              provider: "github"
            };
            const message = {
            type: "authorization_response",
            data: data
            };
            const targetOrigin = "{decapCmsOrigin}";
            console.log("Callback popup: Sending message to opener", message, "with targetOrigin:", targetOrigin);

            if (window.opener) {
              window.opener.postMessage(message, targetOrigin);
              // window.close(); // メッセージ送信後に閉じる
            } else {
              console.error("Callback popup: window.opener is not available.");
              document.body.innerHTML = "<h1>Error</h1><p>Could not communicate with the main window. Please close this window and try again. Ensure popups are allowed.</p>";
            }
          })();
        </script>
      </head>
      <body>
        Authentication successful. Please wait... If this window does not close automatically, you may need to close it manually after a few seconds.
      </body>
      </html>
    `;
    return new Response(htmlResponse, { headers: { 'Content-Type': 'text/html' } });

  } catch (error) {
    console.error("Callback error:", error);
    return new Response(`An unexpected error occurred: ${error.message}`, { status: 500 });
  }
}