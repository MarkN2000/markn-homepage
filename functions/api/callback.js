// functions/api/callback.js

// i40west/netlify-cms-cloudflare-pages のサンプルをベースに調整
// CSRF対策のstate検証、エラーハンドリングをしっかり行うことが重要です。

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get('code');
  const receivedState = url.searchParams.get('state');

  const GITHUB_CLIENT_ID = context.env.GITHUB_CLIENT_ID;
  const GITHUB_CLIENT_SECRET = context.env.GITHUB_CLIENT_SECRET;

  // CSRF対策: stateの検証
  // const storedState = context.request.headers.get('Cookie')?.match(/github_oauth_state=([^;]+)/)?.[1];
  // if (!receivedState || receivedState !== storedState) {
  //   return new Response('Invalid state parameter. CSRF attack suspected.', { status: 403 });
  // }
  // (クッキーからstateを削除する処理もここで行う)

  if (!code) {
    return new Response('Error: No code provided from GitHub.', { status: 400 });
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
        // redirect_uri はGitHub OAuth App設定と一致していれば通常不要だが、
        // GitHubのドキュメントで確認。
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text(); // または .json()
      console.error('GitHub token exchange error details:', errorText);
      return new Response(`Error exchanging code for token: ${tokenResponse.status} ${tokenResponse.statusText}. Details: ${errorText}`, { status: tokenResponse.status });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error('Access Token not found in response from GitHub:', tokenData);
      return new Response('Error: Access Token not found in response from GitHub.', { status: 500 });
    }

    // ★重要★: Decap CMSが期待するメッセージ形式でアクセストークンをフロントエンドに渡す
    // このHTMLとスクリプトは認証ポップアップ内で実行され、親ウィンドウ(CMS)に情報を渡す
    const htmlResponse = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Decap CMS GitHub Authentication Success</title>
        <script>
          const message = {
            type: 'authorization_response', // または 'authorizing', 'authentication_success' など
                                        // Decap CMSのバージョンや設定によって期待するtypeが異なる可能性あり
            provider: 'github',         // 認証プロバイダ名
            data: {                     // トークンやエラー情報を含むオブジェクト
              token: '${accessToken}',
              // provider: 'github', // providerはトップレベルかdata内か確認
              // scope: '${tokenData.scope || 'repo'}' // スコープも渡せると良い
            }
            // もしエラーがあった場合は error キーを含める
            // error: null // 成功時
          };

          // セキュリティのため、ターゲットオリジンを正確に指定する
          const targetOrigin = '${new URL(context.request.url).origin}'; 

          if (window.opener) {
            window.opener.postMessage(JSON.stringify(message), targetOrigin);
            window.close();
          } else {
            // エラー処理: ポップアップウィンドウではない場合
            console.error('Error: window.opener is not available. Cannot post message to CMS.');
            document.body.textContent = 'Authentication successful, but could not return to the CMS. Please close this window and refresh the CMS page.';
          }
        </script>
      </head>
      <body>
        <p>Authentication successful. Please wait while you are redirected...</p>
      </body>
      </html>
    `;
    return new Response(htmlResponse, { headers: { 'Content-Type': 'text/html' } });

  } catch (error) {
    console.error('Callback function error:', error);
    return new Response(`An unexpected error occurred during callback: ${error.message}`, { status: 500 });
  }
}