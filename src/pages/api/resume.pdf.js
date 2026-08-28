import puppeteer from 'puppeteer';
import puppeteerCore from 'puppeteer-core';
import { createRequire } from 'node:module';

const nodeRequire = createRequire(import.meta.url);

export const config = {
  api: {
    responseLimit: false,
  },
  maxDuration: 60,
};

function getOrigin(request) {
  const forwardedProtocol = request.headers['x-forwarded-proto'];
  const protocol = typeof forwardedProtocol === 'string'
    ? forwardedProtocol.split(',')[0]
    : 'http';
  const host = request.headers['x-forwarded-host'] || request.headers.host;

  return `${protocol}://${host}`;
}

async function launchBrowser() {
  // Production must not rely on Puppeteer's build-machine cache. Only local
  // development on a non-Linux machine uses the Chrome downloaded by Puppeteer.
  const useServerlessChromium = process.env.NODE_ENV === 'production' || process.platform === 'linux';

  if (useServerlessChromium) {
    const chromium = nodeRequire('@sparticuz/chromium').default;
    chromium.setGraphicsMode = false;

    return puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: 'shell',
    });
  }

  return puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  let browser;

  try {
    browser = await launchBrowser();

    const page = await browser.newPage();
    await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 1 });
    await page.emulateMediaType('screen');
    await page.goto(`${getOrigin(request)}/resume?pdf=1`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('[data-pdf-ready="true"]');

    const pdf = await page.pdf({
      width: '8.5in',
      height: '11in',
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      printBackground: true,
    });

    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', 'attachment; filename="chenghong-meng-resume.pdf"');
    return response.status(200).send(Buffer.from(pdf));
  } catch (error) {
    console.error('Resume PDF generation failed:', error);
    return response.status(500).json({ error: 'Unable to generate the resume PDF.' });
  } finally {
    if (browser) await browser.close();
  }
}
