// functions/api/fetch-metadata.js

// HTMLエンティティをデコードするヘルパー関数 (簡易版)
function decodeHtmlEntities(text) {
    if (typeof text !== 'string') return text;
    // よく使われるHTMLエンティティのみを対象とする
    return text.replace(/&amp;/g, '&')
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>')
               .replace(/&quot;/g, '"')
               .replace(/&#39;/g, "'")
               .replace(/&#x2F;/g, '/'); // og:urlなどで使われることがある
}

// Open Graph (OG) タグなどのメタ情報を抽出するクラス
class MetaTagExtractor {
    constructor(baseUrl) {
        this.metadata = {
            title: '',
            description: '',
            image: '',
            siteName: '',
            // icon: '' // ファビコン用 (今回は簡単化のため省略も可)
        };
        this.baseUrl = baseUrl; // 相対URLを絶対URLに変換するために使用
    }

    element(element) {
        const property = element.getAttribute('property') || element.getAttribute('name');
        const content = element.getAttribute('content');

        if (content) {
            switch (property) {
                case 'og:title':
                    this.metadata.title = decodeHtmlEntities(content);
                    break;
                case 'og:description':
                    this.metadata.description = decodeHtmlEntities(content);
                    break;
                case 'description':
                    if (!this.metadata.description) { // og:description を優先
                        this.metadata.description = decodeHtmlEntities(content);
                    }
                    break;
                case 'og:image':
                    try {
                        this.metadata.image = new URL(content, this.baseUrl).href;
                    } catch (e) {
                        // URLの解析に失敗した場合、contentをそのまま使うか、エラーとして扱う
                        this.metadata.image = content;
                    }
                    break;
                case 'twitter:image':
                     if (!this.metadata.image) { // og:image を優先
                        try {
                            this.metadata.image = new URL(content, this.baseUrl).href;
                        } catch (e) {
                            this.metadata.image = content;
                        }
                    }
                    break;
                case 'og:site_name':
                    this.metadata.siteName = decodeHtmlEntities(content);
                    break;
            }
        }
    }
}

// <title> タグの内容を抽出するクラス
class TitleExtractor {
    constructor() {
        this.title = '';
    }
    text(textChunk) {
        this.title += textChunk.text;
        if (textChunk.lastInTextNode) {
            // textChunk.lastInTextNode でテキストノードの最後であることを確認できる
        }
    }
    get extractedTitle() {
        return decodeHtmlEntities(this.title.trim());
    }
}

// Cloudflare Pages Function のエントリーポイント
// onRequestGet はGETリクエストを処理します
export async function onRequestGet(context) {
    const { request } = context; // contextからrequestオブジェクトを取得
    const requestUrl = new URL(request.url);
    const targetUrl = requestUrl.searchParams.get('url');

    if (!targetUrl) {
        return new Response(JSON.stringify({ error: 'URL parameter is missing' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // 開発中は '*' でも良いが、本番では制限推奨
            },
        });
    }

    let validatedUrl;
    try {
        validatedUrl = new URL(targetUrl); // URLの検証とベースURLとしての利用
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Invalid URL provided' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
    }

    try {
        const response = await fetch(validatedUrl.href, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 MarkN-LinkCard-Fetcher/1.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8', // 日本語サイト優先
            },
            // Cloudflare Workersのfetchではリダイレクトは自動で追従される（デフォルト）
            // redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch target URL: ${response.status} ${response.statusText}`);
        }

        // HTMLRewriterのインスタンスを作成
        const metaTagExtractor = new MetaTagExtractor(validatedUrl.href);
        const titleExtractor = new TitleExtractor();

        let rewrittenResponse = new HTMLRewriter()
            .on('meta', metaTagExtractor) // すべての <meta> タグを処理
            .on('title', titleExtractor)  // <title> タグを処理
            .transform(response);

        // レスポンスボディを完全に消費してHTMLRewriterの処理を完了させる
        await rewrittenResponse.text();

        // 抽出されたメタデータを取得
        let metadata = metaTagExtractor.metadata;
        if (!metadata.title && titleExtractor.extractedTitle) {
            metadata.title = titleExtractor.extractedTitle;
        }
        
        // サイト名が取得できなかった場合、ドメイン名から生成
        if (!metadata.siteName && validatedUrl.hostname) {
            metadata.siteName = validatedUrl.hostname;
        }


        // タイトルがどうしても取得できない場合のエラー処理
        if (!metadata.title) {
            // console.warn("Title could not be extracted for URL:", validatedUrl.href);
            // return new Response(JSON.stringify({ error: 'Could not extract title from the page.' , fetchedUrl: validatedUrl.href }), {
            //     status: 404, // Or 200 with an error field
            //     headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            // });
            // タイトルがなくても他の情報があれば返す方針もアリ
             metadata.title = validatedUrl.hostname; // 最悪ドメイン名をタイトルに
        }


        return new Response(JSON.stringify(metadata), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 's-maxage=3600, stale-while-revalidate=60', // 1時間キャッシュ、バックグラウンドで60秒更新
            },
        });

    } catch (error) {
        console.error(`Error in Cloudflare Function for URL (${targetUrl}):`, error.message);
        return new Response(JSON.stringify({ error: 'Failed to fetch or parse metadata: ' + error.message, details: error.stack }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
}