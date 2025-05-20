export async function onRequest(context) {
  // contextからrequestとenv（環境変数）を取得
  const { request, env } = context;
  const url = new URL(request.url);

  // URLクエリパラメータから 'code' を取得
  const code = url.searchParams.get("code");
  // const state = url.searchParams.get("state"); // オプション: stateの検証

  // 'code' が存在しない場合はエラー
  if (!code) {
    console.error("Callback: No code received from GitHub.");
    return new Response("No code received from GitHub.", { status: 400 });
  }

  // 環境変数からGitHubの認証情報を取得
  const GITHUB_CLIENT_ID = env.GITHUB_CLIENT_ID;
  const GITHUB_CLIENT_SECRET = env.GITHUB_CLIENT_SECRET;

  // 認証情報が設定されていない場合はエラー
  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    console.error("Callback: GitHub credentials not configured in environment variables.");
    return new Response("GitHub credentials not configured in environment. Please check Cloudflare Pages environment variables.", { status: 500 });
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
      }),
    });

    // トークン取得リクエストが失敗した場合
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Callback: GitHub token exchange error:", tokenResponse.status, errorText);
      return new Response(`Error fetching access token from GitHub: ${errorText}`, { status: tokenResponse.status });
    }

    // レスポンスをJSONとしてパース
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // アクセストークンが存在しない場合はエラー
    if (!accessToken) {
      console.error("Callback: No access token found in GitHub response:", tokenData);
      return new Response("No access token found in GitHub response. Check GitHub API response.", { status: 500 });
    }

    // Decap CMS (adminページ) のオリジンを決定
    const decapCmsOrigin = url.origin; // 例: "https://markn-homepage.pages.dev"
                                      // 必要に応じて固定値 "https://markn-homepage.pages.dev" に変更してください。

    // postMessageで送信するアクセストークンをJSON文字列としてエスケープ
    // これにより、トークンが "gho_..." のような文字列の場合、escapedAccessToken は "\"gho_...\"" というJSON文字列になる
    const escapedAccessToken = JSON.stringify(accessToken);
    // Cloudflare Functionのログで確認
    console.log("Callback Server-side: Raw accessToken:", accessToken);
    console.log("Callback Server-side: Escaped accessToken for JS (should be a JSON string like \"gho_...\"):", escapedAccessToken);


    // Decap CMSに渡すHTMLとJavaScriptを生成
    const htmlResponse = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Authenticating...</title>
        <script>
          (function() {
            // escapedAccessToken はサーバーサイドで JSON.stringify() されたJSON文字列（例: "\"gho_abc123\""）
            // これを JSON.parse() に渡すことで、元の文字列（例: "gho_abc123"）に戻す
            // テンプレートリテラル内で ${escapedAccessToken} を展開すると、
            // JSON.parse("\"gho_abc123\""); のように、有効なJavaScriptコードになる
            let tokenValue;
            let parseError = null;
            try {
              console.log('Callback popup: String to be parsed by JSON.parse():', ${escapedAccessToken});
              tokenValue = JSON.parse(${escapedAccessToken});
            } catch (e) {
              parseError = e;
              console.error('Callback popup: Error parsing token:', e);
              console.error('Callback popup: The problematic string was:', ${escapedAccessToken});
              // エラー発生時は、フォールバックとして生のトークン文字列を試みるか、エラー表示
              // ここではエラーを明確にするため、tokenValueを未定義のままにするか、エラーを示す値を設定
              tokenValue = "ERROR_PARSING_TOKEN"; 
            }
            
            const data = {
              token: tokenValue, 
              provider: "github"
            };
            const message = {
              type: "authorization_response",
              data: data
            };

            const targetOrigin = "${decapCmsOrigin}"; 
            
            console.log("Callback popup: Parsed Token Value for data:", tokenValue);
            console.log("Callback popup: Sending message to opener", message, "with targetOrigin:", targetOrigin);

            if (window.opener) {
              window.opener.postMessage(message, targetOrigin);
              // window.close(); // デバッグ中はコメントアウト推奨
            } else {
              console.error("Callback popup: window.opener is not available.");
              document.body.innerHTML = "<h1>Authentication Error</h1><p>Could not communicate with the main window (opener not found). Please ensure popups are allowed and try logging in again.</p>";
            }
          })();
        </script>
      </head>
      <body>
        Authentication successful. Please wait... If this window does not close automatically, or if you see an error, please check the browser console.
        <script>
          // エラーがあった場合にユーザーにフィードバックするための簡単なスクリプト
          if (typeof parseError !== 'undefined' && parseError) {
            document.body.innerHTML = '<h1>Authentication Error</h1><p>There was an issue processing the authentication token. Please check the console for details and try again. (' + parseError.message + ')</p>';
          }
        </script>
      </body>
      </html>
    `;

    return new Response(htmlResponse, { headers: { 'Content-Type': 'text/html' } });

  } catch (error) {
    console.error("Callback: Unexpected error:", error);
    return new Response(`An unexpected error occurred: ${error.message}`, { status: 500 });
  }
}