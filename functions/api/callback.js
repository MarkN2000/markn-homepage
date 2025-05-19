// functions/api/callback.js (i40westのサンプルに寄せた修正案)

export async function onRequestGet(context) {
  // ... (code, state, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET の取得と検証は同様) ...
  // ... (アクセストークン取得処理も同様) ...

  // const accessToken = tokenData.access_token; // 取得済みと仮定
  // const scope = tokenData.scope;         // 取得済みと仮定
  // const siteOrigin = new URL(context.request.url).origin;

  // ★★★ メッセージ形式を i40west のサンプルに合わせる ★★★
  const authResponse = {
    type: 'authorizing', // i40west のサンプルで使用されている type
    provider: 'github',  // 'github' または 'implicit-github' (サンプルでは 'github')
    params: {            // トークンなどを params オブジェクト内にネスト
      token: accessToken,
      provider: 'github', // ネストされた provider も 'github'
      scope: scope       // scope も必要なら含める (サンプルでは含めている)
    }
  };

  console.log('Callback: Posting message (i40west style) to opener. Target Origin:', siteOrigin, 'Message:', JSON.stringify(authResponse));

  const htmlResponse = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Decap CMS GitHub Authentication Success</title>
      <script>
        try {
          const message = ${JSON.stringify(authResponse)}; // Functionから渡されたメッセージオブジェクト
          const targetOrigin = '${siteOrigin}';
          
          console.log('Popup: Attempting to post message (i40west style):', message, 'to targetOrigin:', targetOrigin);

          if (window.opener && window.opener.postMessage) {
            window.opener.postMessage(JSON.stringify(message), targetOrigin);
            console.log('Popup: Message posted to opener (i40west style).');
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
}