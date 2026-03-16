import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'player.html');
    let html = await fs.readFile(filePath, 'utf-8');

    const password = process.env.PASSWORD || '';
    const passwordHash = password
      ? crypto.createHash('sha256').update(password).digest('hex')
      : '';

    html = html.replace('{{PASSWORD}}', passwordHash);

    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    res.status(200).end(html);
  } catch (error) {
    res.status(500).end('Internal Server Error');
  }
}
