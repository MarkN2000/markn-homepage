export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    console.error("Callback: No code received from GitHub.");
    return new Response("No code received from GitHub.", { status: 400 });
  }

  const GITHUB_CLIENT_ID = env.GITHUB_CLIENT_ID;
  const GITHUB_CLIENT_SECRET = env.GITHUB_CLIENT_SECRET;

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    console.error("Callback: GitHub credentials not configured.");
    return new Response("GitHub credentials not configured.", { status: 500 });
  }

  try {
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

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Callback: GitHub token exchange error:", tokenResponse.status, errorText);
      return new Response(`Error fetching access token from GitHub: ${errorText}`, { status: tokenResponse.status });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error("Callback: No access token in GitHub response:", tokenData);
      return new Response("No access token in GitHub response.", { status: 500 });
    }

    const decapCmsOrigin = url.origin; // Or use a fixed string like "https://markn-homepage.pages.dev"

    const tokenDataForHtmlAttribute = JSON.stringify(accessToken);
    console.log("Callback Server-side: Raw accessToken:", accessToken);
    console.log("Callback Server-side: tokenDataForHtmlAttribute (JSON string for data attribute):", tokenDataForHtmlAttribute);

    const htmlResponse = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Authenticating...</title>
      </head>
      <body data-token='${tokenDataForHtmlAttribute.replace(/'/g, "&apos;")}'> 
        Authenticating... Please wait.
        <script>
          (function() {
            let tokenValue;
            let operationStatus = "Attempting to retrieve token.";
            let errorInfo = null;

            try {
              const tokenAttribute = document.body.getAttribute('data-token');
              console.log('Callback popup: Raw token data from attribute:', tokenAttribute);

              if (tokenAttribute) {
                tokenValue = JSON.parse(tokenAttribute); 
                operationStatus = "Token retrieved and parsed successfully.";
                 if (typeof tokenValue !== 'string') {
                    console.error('Callback popup: Parsed token is not a string! Type:', typeof tokenValue, 'Value:', tokenValue);
                    operationStatus = "Error: Parsed token is not a string.";
                    errorInfo = "Parsed token is not a string: " + String(tokenValue);
                    tokenValue = "ERROR_PARSING_TOKEN_TYPE";
                 }
              } else {
                console.error('Callback popup: data-token attribute not found or empty.');
                operationStatus = "Error: data-token attribute missing.";
                errorInfo = "data-token attribute missing.";
                tokenValue = "ERROR_TOKEN_ATTRIBUTE_MISSING";
              }
            } catch (e) {
              console.error('Callback popup: Error parsing token from data attribute:', e);
              console.error('Callback popup: The problematic attribute string was:', document.body.getAttribute('data-token'));
              operationStatus = "Error: Failed to parse token from data attribute.";
              errorInfo = e.message;
              tokenValue = "ERROR_PARSING_TOKEN_ATTR";
            }
            
            const data = {
              token: tokenValue, 
              provider: "github"
            };
            const message = {
              type: "authorization_response",
              data: data
            };

            // targetOrigin は Decap CMS が動作しているメインウィンドウのオリジンを正確に指定
            const targetOrigin = "${decapCmsOrigin}"; 
            
            console.log("Callback popup: Operation status:", operationStatus);
            console.log("Callback popup: Sending message to opener", message, "with targetOrigin:", targetOrigin);

            if (window.opener && typeof window.opener.postMessage === 'function') {
              window.opener.postMessage(message, targetOrigin);
              // メッセージ送信後、少し遅延させてからウィンドウを閉じる
              // これにより、メインウィンドウがメッセージを処理する時間を確保する
              setTimeout(function() {
                console.log("Callback popup: Attempting to close window.");
                window.close();
              }, 200); // 200ミリ秒の遅延 (必要に応じて調整)
            } else {
              console.error("Callback popup: window.opener or window.opener.postMessage is not available.");
              document.getElementById('status').innerText = "Error: Could not communicate with the main window (opener or postMessage not found).";
            }
          })();
        </script>
        <div id="status">Authentication successful. Please wait... This window should close automatically. If it doesn't, or if you see an error, please check the browser console.</div>
        <script>
          // Display error to user if any
          const statusDiv = document.getElementById('status');
          if (typeof errorInfo !== 'undefined' && errorInfo) {
            statusDiv.innerHTML = '<h1>Authentication Error</h1><p>There was an issue processing the authentication token: ' + errorInfo + '. Please check the console for details and try again.</p>';
          } else if (document.getElementById('status').innerText.includes("ERROR_")) { 
             statusDiv.innerHTML = '<h1>Authentication Error</h1><p>An unknown error occurred while processing the token. Check console.</p>';
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