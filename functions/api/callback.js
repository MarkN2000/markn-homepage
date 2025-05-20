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

    // アクセストークンをJavaScript文字列リテラルとして安全に埋め込むためにJSON.stringifyを使用
    // これにより、accessTokenが "gho_..." の場合、jsStringForToken は "\"gho_...\"" という文字列になる。
    // この "\"gho_...\"" は、クライアントサイドJSで変数に代入されると、その変数は "gho_..." という文字列値を持つ。
    const jsStringForToken = JSON.stringify(accessToken);
    // Cloudflare Functionのログで確認
    console.log("Callback Server-side: Raw accessToken:", accessToken);
    console.log("Callback Server-side: jsStringForToken for client (should be a JS string literal like \"\\\"gho_...\\\"\"):", jsStringForToken);


    // Decap CMSに渡すHTMLとJavaScriptを生成
    const htmlResponse = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Authenticating...</title>
        <script>
          (function() {
            //サーバーサイドでJSON.stringify()されたトークン文字列を直接JavaScriptの変数に代入する
            //例：jsStringForTokenが「"\"gho_abc123\""」という文字列の場合、
            //下の行は「const tokenValue = "\"gho_abc123\"";」と展開され、
            //結果としてtokenValueは「gho_abc123」という文字列になる。
            let tokenValue = ${jsStringForToken};
            let operationStatus = "Token assigned successfully.";
            
            // デバッグ用に代入された実際の値を確認
            console.log('Callback popup: Assigned tokenValue:', tokenValue);
            if (typeof tokenValue !== 'string') {
                console.error('Callback popup: tokenValue is not a string! Type is ' + typeof tokenValue + '. Value:', tokenValue);
                operationStatus = "Error: Token is not a string after assignment.";
                tokenValue = "ERROR_ASSIGNING_TOKEN"; // エラーを示す値に
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
            
            console.log("Callback popup: Operation status:", operationStatus);
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
          // この部分は上記 try...catch がなくなったので、動作を少し変更
          const bodyElement = document.body;
          if (bodyElement.innerText.includes("ERROR_ASSIGNING_TOKEN")) { // 簡易的なエラーチェック
            bodyElement.innerHTML = '<h1>Authentication Error</h1><p>There was an issue processing the authentication token. Please check the console for details and try again.</p>';
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