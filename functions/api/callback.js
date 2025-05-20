export async function onRequest(context) {
  // contextからrequestとenv（環境変数）を取得
  const { request, env } = context;
  const url = new URL(request.url);

  // URLクエリパラメータから 'code' と 'state' を取得
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state"); // オプション: stateの検証を行う場合

  // 'code' が存在しない場合はエラーレスポンスを返す
  if (!code) {
    console.error("Callback: No code received from GitHub.");
    return new Response("No code received from GitHub.", { status: 400 });
  }

  // 環境変数からGitHubの認証情報を取得
  const GITHUB_CLIENT_ID = env.GITHUB_CLIENT_ID;
  const GITHUB_CLIENT_SECRET = env.GITHUB_CLIENT_SECRET;

  // 認証情報が設定されていない場合はエラーレスポンスを返す
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
        "Accept": "application/json", // GitHubはJSON形式でのレスポンスを推奨
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
        // redirect_uri: `${url.origin}/api/callback`, // GitHub OAuth Appで設定したコールバックURLと一致させる必要がある場合。通常は不要。
      }),
    });

    // トークン取得リクエストが失敗した場合の処理
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
    // 通常はCloudflare Functionのオリジンと同じ = サイトのオリジン
    // 環境変数などで固定値を設定する方がより安全で確実な場合もあります。
    const decapCmsOrigin = url.origin; // 例: "https://markn-homepage.pages.dev"

    // postMessageで送信するアクセストークンをJSON文字列としてエスケープ
    // これにより、トークン内に特殊文字が含まれていてもJavaScriptの構文を壊さないようにする
    const escapedAccessToken = JSON.stringify(accessToken);

    // Decap CMSに渡すHTMLとJavaScriptを生成
    const htmlResponse = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Authenticating...</title>
        <script>
          (function() {
            // JSON.parseを使用して、エスケープされたJSON文字列をJavaScriptの文字列に戻す
            const tokenValue = JSON.parse(${escapedAccessToken});
            
            const data = {
              token: tokenValue, // 実際のアクセストークン
              provider: "github" // Decap CMSが期待するプロバイダー名
            };
            const message = {
              type: "authorization_response", // Decap CMSが期待するメッセージタイプ
              data: data
            };

            // メインウィンドウのオリジンを正確に指定
            const targetOrigin = "${decapCmsOrigin}"; 
            
            // デバッグ用のログ
            console.log("Callback popup: Escaped Access Token for JS:", ${escapedAccessToken});
            console.log("Callback popup: Parsed Token Value for JS:", tokenValue);
            console.log("Callback popup: Sending message to opener", message, "with targetOrigin:", targetOrigin);

            if (window.opener) {
              window.opener.postMessage(message, targetOrigin);
              // window.close(); // デバッグ中はコメントアウトしておき、動作確認後に有効化することを推奨
            } else {
              console.error("Callback popup: window.opener is not available. This script should run in a popup window opened by Decap CMS.");
              document.body.innerHTML = "<h1>Authentication Error</h1><p>Could not communicate with the main window (opener not found). Please ensure popups are allowed and try logging in again.</p>";
            }
          })();
        </script>
      </head>
      <body>
        Authentication successful. Please wait... If this window does not close automatically, you may need to close it manually after a few seconds.
      </body>
      </html>
    `; // バッククォートによるHTML文字列の終了

    // HTMLレスポンスを返す
    return new Response(htmlResponse, { headers: { 'Content-Type': 'text/html' } });

  } catch (error) {
    // 予期せぬエラーが発生した場合の処理
    console.error("Callback: Unexpected error during token exchange or HTML generation:", error);
    return new Response(`An unexpected error occurred: ${error.message}`, { status: 500 });
  }
}