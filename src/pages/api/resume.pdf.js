import puppeteer from 'puppeteer';
import puppeteerCore from 'puppeteer-core';

let chromiumPathPromise;

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

async function getChromiumPath(origin) {
  if (!chromiumPathPromise) {
    chromiumPathPromise = import('@sparticuz/chromium-min')
      .then(({ default: chromium }) => chromium.executablePath(`${origin}/chromium-pack.tar`))
      .catch((error) => {
        chromiumPathPromise = undefined;
        throw error;
      });
  }

  return chromiumPathPromise;
}

async function launchBrowser(origin) {
  if (process.env.VERCEL) {
    const chromium = (await import('@sparticuz/chromium-min')).default;

    return puppeteerCore.launch({
      args: chromium.args,
      executablePath: await getChromiumPath(origin),
      headless: true,
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
    const origin = getOrigin(request);
    browser = await launchBrowser(origin);

    const page = await browser.newPage();
    await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 1 });
    await page.emulateMediaType('screen');
    await page.goto(`${origin}/resume?pdf=1`, { waitUntil: 'networkidle0' });
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
