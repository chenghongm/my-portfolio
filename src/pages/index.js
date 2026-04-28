import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect } from 'react';
import { initConsoleEasterEgg } from './sharedfunctions';

export default function Landing() {
  useEffect(() => {
    console.log("Initializing console easter egg...");
    initConsoleEasterEgg();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center font-mono selection:bg-yellow-500/30">
      <Head>
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async></script>
        <link rel="icon" href="./assets/eyes.gif" sizes="any" type="image/png"></link>
        <title>Chenghong Meng | Portfolios</title>
      </Head>

      <main className="max-w-5xl w-full px-8 flex flex-col md:flex-row items-center justify-center gap-16 md:gap-32">
        {/* Claude Style Link */}
        <Link
          href="/claude-style"
          className="group relative flex flex-col items-center gap-8 transition-all duration-500 hover:-translate-x-4"
        >
          <div className="relative">
            <div className="text-8xl md:text-9xl font-light text-white/10 group-hover:text-yellow-500/20 transition-colors duration-500 ease-out">
              ←
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity duration-500">
              <Image
                src="/assets/claude_icon.png"
                alt="Claude Icon"
                width={80}
                height={80}
                className="grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter mb-3 uppercase group-hover:text-yellow-500 transition-colors">Claude Style</h2>
            <p className="text-gray-500 text-sm max-w-[200px] leading-relaxed">
              Modern terminal interface, dark aesthetic, spacious layout.
            </p>
          </div>
          {/* Decorative line */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-0 bg-yellow-500 transition-all duration-500 group-hover:h-32 opacity-0 group-hover:opacity-100" />
        </Link>

        {/* Vertical Divider */}
        <div className="hidden md:block h-64 w-px bg-gradient-to-b from-transparent via-gray-800 to-transparent" />
        <div className="md:hidden w-32 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

        {/* Gemini Style Link */}
        <Link
          href="/gemini-style"
          className="group relative flex flex-col items-center gap-8 transition-all duration-500 hover:translate-x-4"
        >
          <div className="text-center order-2 md:order-1">
            <h2 className="text-3xl font-bold tracking-tighter mb-3 uppercase group-hover:text-green-500 transition-colors">Gemini Style</h2>
            <p className="text-gray-500 text-sm max-w-[200px] leading-relaxed">
              Windows 95 nostalgia, lab aesthetic, retro precision.
            </p>
          </div>
          <div className="relative order-1 md:order-2">
            <div className="text-8xl md:text-9xl font-light text-white/10 group-hover:text-green-500/20 transition-colors duration-500 ease-out">
              →
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity duration-500">
              <Image
                src="/assets/gemini_icon.png"
                alt="Gemini Icon"
                width={80}
                height={80}
                className="grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
          {/* Decorative line */}
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-1 h-0 bg-green-500 transition-all duration-500 group-hover:h-32 opacity-0 group-hover:opacity-100" />
        </Link>
      </main>

      <footer className="fixed bottom-12 text-gray-700 text-[10px] tracking-[0.3em] uppercase">
        Chenghong Meng — Systems & Engineering
      </footer>

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-[128px]" />
      </div>
    </div>
  );
}
