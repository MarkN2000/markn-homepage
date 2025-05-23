// functions/api/fetch-metadata.js

// HTMLエンティティをデコードするヘルパー関数 (簡易版)
function decodeHtmlEntities(text) {
    if (typeof text !== 'string') return text;
    return text.replace(/&amp;/g, '&')
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>')
               .replace(/&quot;/g, '"')
               .replace(/&#39;/g, "'")
               .replace(/&#x2F;/g, '/');
}

// Open Graph (OG) タグなどのメタ情報を抽出するクラス
class MetaTagExtractor {
    constructor(baseUrl) {
        this.metadata = {
            title: '',
            description: '',
            image: '',
            siteName: '',
        };
        this.baseUrl = baseUrl;
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
                    if (!this.metadata.description) {
                        this.metadata.description = decodeHtmlEntities(content);
                    }
                    break;
                case 'og:image':
                    try {
                        this.metadata.image = new URL(content, this.baseUrl).href;
                    } catch (e) {
                        this.metadata.image = content;
                    }
                    break;
                case 'twitter:image':
                     if (!this.metadata.image) {
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
    }
    get extractedTitle() {
        return decodeHtmlEntities(this.title.trim());
    }
}

// fetchにタイムアウトを設定するヘルパー関数
const fetchTimeout = (url, options, timeout = 15000) => { // デフォルトタイムアウトを15秒に設定
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('External fetch timeout after ' + timeout + 'ms')), timeout)
    )
  ]);
};

export async function onRequestGet(context) {
    const { request } = context;
    const requestUrl = new URL(request.url);
    const targetUrl = requestUrl.searchParams.get('url');

    if (!targetUrl) {
        return new Response(JSON.stringify({ error: 'URL parameter is missing' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }

    let validatedUrl;
    try {
        validatedUrl = new URL(targetUrl);
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Invalid URL provided' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
    }

    try {
        // fetchTimeoutを使用して外部サイトへのリクエストを行う
        const response = await fetchTimeout(validatedUrl.href, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 MarkN-LinkCard-Fetcher/1.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
            },
        }); // タイムアウト値はfetchTimeout関数のデフォルト (15000ms) を使用

        if (!response.ok) {
            throw new Error(`Failed to fetch target URL: ${response.status} ${response.statusText}`);
        }

        const metaTagExtractor = new MetaTagExtractor(validatedUrl.href);
        const titleExtractor = new TitleExtractor();

        let rewrittenResponse = new HTMLRewriter()
            .on('meta', metaTagExtractor)
            .on('title', titleExtractor)
            .transform(response);

        await rewrittenResponse.text();

        let metadata = metaTagExtractor.metadata;
        if (!metadata.title && titleExtractor.extractedTitle) {
            metadata.title = titleExtractor.extractedTitle;
        }
        
        if (!metadata.siteName && validatedUrl.hostname) {
            metadata.siteName = validatedUrl.hostname;
        }

        if (!metadata.title) {
            metadata.title = validatedUrl.hostname;
        }

        return new Response(JSON.stringify(metadata), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 's-maxage=3600, stale-while-revalidate=60',
            },
        });

    } catch (error) {
        console.error(`Error in Cloudflare Function for URL (${targetUrl}):`, error.message, error.stack); // エラーログにスタックトレースも追加
        return new Response(JSON.stringify({ error: 'Failed to fetch or parse metadata: ' + error.message }), { // クライアントにはスタックトレースを返さない
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
}