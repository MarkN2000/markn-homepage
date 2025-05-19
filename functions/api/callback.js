// functions/api/callback.js (修正案)

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get('code');
  const receivedState = url.searchParams.get('state'); // CSRF対策で検証する

  // ★CSRF対策: stateの検証を必ず実装してください (i40westのサンプルを参照)
  // const storedState = /* クッキーなどから保存したstateを取得 */;
  // if (!receivedState || receivedState !== storedState) {
  //   console.error('State mismatch. CSRF suspected.');
  //   return new Response('Invalid state parameter.', { status: 403 });
  // }
  // (検証後、クッキーからstateを削除)

  const GITHUB_CLIENT_ID = context.env.GITHUB_CLIENT_ID;
  const GITHUB_CLIENT_SECRET = context.env.GITHUB_CLIENT_SECRET;

  if (!code) {
    console.error('Callback: No code received.');
    return new Response('Authentication error: No code received from GitHub.', { status: 400 });
  }
  console.log('Callback: Received code:', code);
  console.log('Callback: Received state:', receivedState); // stateもログに出力

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
      }),
    });

    const tokenData = await tokenResponse.json(); // レスポンスがOKでなくてもJSONを試みる

    if (!tokenResponse.ok) {
      console.error('GitHub token exchange error. Status:', tokenResponse.status, 'Response:', tokenData);
      return new Response(`Error exchanging code for token: ${tokenData.error_description || tokenResponse.statusText}`, { status: tokenResponse.status });
    }

    const accessToken = tokenData.access_token;
    const scope = tokenData.scope; // GitHubからのレスポンスにscopeが含まれるか確認

    if (!accessToken) {
      console.error('Access Token not found in response from GitHub:', tokenData);
      return new Response('Error: Access Token not found in response from GitHub.', { status: 500 });
    }
    console.log('Callback: Access Token obtained:', accessToken ? 'Yes (hidden)' : 'No'); // トークン自体はログに出さない方が良い
    console.log('Callback: Scope from token response:', scope);

    const siteOrigin = new URL(context.request.url).origin; // 例: https://markn-homepage.pages.dev

    // ★★★ Decap CMSが期待するメッセージ形式を確認・修正 ★★★
    // Decap CMSのドキュメントや他の動作例を参考に、正しい `type` やキー名を見つける
    const message = {
      type: 'authorization_response', // 一般的な候補の一つ。'authorizing' や 'authentication_success' も試す価値あり
      provider: 'github',
      token: accessToken, // トークンを直接トップレベルに
      // data: { // または dataオブジェクト内にネストする形式も考えられる
      //   token: accessToken,
      //   provider: 'github',
      //   // scope: scope // scopeも必要なら含める
      // }
    };

    console.log('Callback: Posting message to opener. Target Origin:', siteOrigin, 'Message:', JSON.stringify(message));

    const htmlResponse = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Decap CMS GitHub Authentication Success</title>
        <script>
          try {
            const message = ${JSON.stringify(message)}; // Functionから渡されたメッセージオブジェクト
            const targetOrigin = '${siteOrigin}';
            
            console.log('Popup: Attempting to post message:', message, 'to targetOrigin:', targetOrigin);

            if (window.opener && window.opener.postMessage) {
              window.opener.postMessage(JSON.stringify(message), targetOrigin); // メッセージは文字列化して送る
              console.log('Popup: Message posted to opener.');
              // window.close(); // ★デバッグ中は閉じない方が確認しやすい
            } else {
              console.error('Popup: window.opener or window.opener.postMessage is not available.');
              document.body.innerHTML = '<h1>Error: Could not return to CMS.</h1><p>Please close this window and try logging in again. (window.opener not found)</p>';
            }
          } catch (e) {
            console.error('Popup script error:', e);
            document.body.innerHTML = '<h1>Script Error</h1><p>' + e.message + '</p>';
          }
        </script>
      </head>
      <body>
        <p>Authentication successful. Please wait while you are redirected...</p>
        <p>If this window does not close automatically, it might be due to a script error or because debugging is in progress. Check the browser console.</p>
      </body>
      </html>
    `;
    return new Response(htmlResponse, { headers: { 'Content-Type': 'text/html' } });

  } catch (error) {
    console.error('Callback function unexpected error:', error);
    return new Response(`An unexpected error occurred: ${error.message}`, { status: 500 });
  }
}