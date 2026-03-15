import fetch from 'node-fetch';
import fs from 'fs/promises';

const proxyBase = process.env.PROXY_BASE;
const targetUrl = process.env.TARGET_URL;
const outputPath = process.env.OUTPUT_PATH;

if (!proxyBase || !targetUrl) {
    console.error('Missing required env vars. Example:');
    console.error('PROXY_BASE="https://your-site.netlify.app/proxy/" TARGET_URL="https://img9.doubanio.com/view/photo/s_ratio_poster/public/p123.jpg" node scripts/test-proxy-image.mjs');
    process.exit(1);
}

const normalizedProxyBase = proxyBase.endsWith('/') ? proxyBase : `${proxyBase}/`;
const proxiedUrl = `${normalizedProxyBase}${encodeURIComponent(targetUrl)}`;

console.log('Proxy URL:', proxiedUrl);

const response = await fetch(proxiedUrl);
if (!response.ok) {
    console.error('Proxy response not OK:', response.status, response.statusText);
    const errorBody = await response.text().catch(() => '');
    console.error('Body (truncated):', errorBody.substring(0, 200));
    process.exit(1);
}

const contentType = response.headers.get('content-type') || '';
const buffer = Buffer.from(await response.arrayBuffer());

console.log('Content-Type:', contentType);
console.log('Bytes:', buffer.length);

if (outputPath) {
    await fs.writeFile(outputPath, buffer);
    console.log('Wrote file:', outputPath);
}
