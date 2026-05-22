import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Script from 'next/script';
import { useCallback, useEffect, useRef, useState } from 'react';
import { initConsoleEasterEgg } from '../lib/sharedfunctions';

const OPEN_DURATION_MS = 520;
const CLOSE_DURATION_MS = 340;
const AUTO_START_DELAY_MS = 900;

function ReplayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      <path d="M20 5v6h-6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 11a8 8 0 1 0 2.2 5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VolumeIcon({ muted }) {
  if (muted) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
        <path d="M11 5 6.8 9H4v6h2.8L11 19z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m16 9 5 6" strokeLinecap="round" />
        <path d="m21 9-5 6" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      <path d="M11 5 6.8 9H4v6h2.8L11 19z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" strokeLinecap="round" />
      <path d="M18.5 6a8.5 8.5 0 0 1 0 12" strokeLinecap="round" />
    </svg>
  );
}

export default function Landing() {
  const [phase, setPhase] = useState('closed');
  const [prefersSound, setPrefersSound] = useState(false);
  const videoRef = useRef(null);
  const timerRef = useRef([]);

  const isOpening = phase === 'opening';
  const isPlaying = phase === 'playing';
  const isClosing = phase === 'closing';
  const isExpanded = isOpening || isPlaying || isClosing;
  const isClosed = phase === 'closed';

  const clearTimers = useCallback(() => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  }, []);

  const queueTimer = useCallback((callback, delay) => {
    const timer = setTimeout(callback, delay);
    timerRef.current.push(timer);
  }, []);

  const startVideoSequence = useCallback(async ({ allowSound = false, immediatePlayback = false } = {}) => {
    clearTimers();
    setPhase('opening');

    const playVideo = async () => {
      const video = videoRef.current;

      setPhase('playing');

      if (!video) {
        return;
      }

      video.pause();
      video.currentTime = 0;
      video.muted = !allowSound;

      try {
        await video.play();
      } catch (error) {
        console.error('Video playback failed:', error);
        setPhase('closed');
      }
    };

    if (immediatePlayback) {
      await playVideo();
      return;
    }

    queueTimer(() => {
      playVideo();
    }, OPEN_DURATION_MS);
  }, [clearTimers, queueTimer]);

  useEffect(() => {
    console.log('Initializing console easter egg...');
    initConsoleEasterEgg();

    queueTimer(() => {
      startVideoSequence({ allowSound: false });
    }, AUTO_START_DELAY_MS);

    return () => {
      clearTimers();
    };
  }, [clearTimers, startVideoSequence, queueTimer]);

  const handleVideoEnded = () => {
    clearTimers();
    setPhase('closing');
    queueTimer(() => {
      setPhase('closed');
    }, CLOSE_DURATION_MS);
  };

  const handleReplay = () => {
    if (!isClosed) {
      return;
    }

    startVideoSequence({
      allowSound: prefersSound,
      immediatePlayback: prefersSound,
    });
  };

  const handleSoundToggle = () => {
    const nextPrefersSound = !prefersSound;
    setPrefersSound(nextPrefersSound);

    const video = videoRef.current;

    if (video) {
      video.muted = !nextPrefersSound;
    }
  };

  const leftLinkClass = [
    'group relative flex flex-col items-center gap-8 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
    'hover:-translate-x-4',
    isExpanded ? 'md:scale-x-95 md:scale-y-90 md:-translate-x-2 scale-[0.97]' : 'scale-100 translate-x-0',
  ].join(' ');

  const rightLinkClass = [
    'group relative flex flex-col items-center gap-8 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
    'hover:translate-x-4',
    isExpanded ? 'md:scale-x-95 md:scale-y-90 md:translate-x-2 scale-[0.97]' : 'scale-100 translate-x-0',
  ].join(' ');

  const stageClass = [
    'relative shrink-0 flex items-center justify-center overflow-hidden',
    'transition-[width,height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
    isClosing ? 'landing-divider-bump' : '',
    isExpanded ? 'w-[18rem] h-[12rem] md:w-[23rem] md:h-64' : 'w-28 h-16 md:w-16 md:h-64',
  ].join(' ');

  const videoShellClass = [
    'relative h-full w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/60 shadow-[0_0_40px_rgba(255,255,255,0.06)]',
    'transition-all duration-300 ease-out',
    isExpanded ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-90',
  ].join(' ');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center font-mono selection:bg-yellow-500/30">
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      <Head>
        <link rel="icon" href="./assets/eyes.gif" sizes="any" type="image/png" />
        <title>Chenghong Meng | Portfolios</title>
      </Head>

      <main className="max-w-6xl w-full px-6 md:px-8 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
        <Link href="/claude-style" className={leftLinkClass}>
          <div className="relative">
            <div className="text-8xl md:text-9xl font-light text-white/10 group-hover:text-yellow-500/20 transition-colors duration-500 ease-out">
              ←
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity duration-500">
              <Image
                src="/assets/claude-ai-logo.svg"
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
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-0 bg-yellow-500 transition-all duration-500 group-hover:h-32 opacity-0 group-hover:opacity-100" />
        </Link>

        <div className={stageClass}>
          <div className="pointer-events-none absolute inset-0 hidden md:block">
            <div
              className="absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-gray-700 to-transparent transition-[left] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ left: isExpanded ? 0 : 'calc(50% - 0.5px)' }}
            />
            <div
              className="absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-gray-700 to-transparent transition-[left] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ left: isExpanded ? 'calc(100% - 1px)' : 'calc(50% - 0.5px)' }}
            />
          </div>

          <div className="pointer-events-none absolute inset-0 md:hidden">
            <div
              className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent transition-[top] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ top: isExpanded ? 0 : 'calc(50% - 0.5px)' }}
            />
            <div
              className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent transition-[top] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ top: isExpanded ? 'calc(100% - 1px)' : 'calc(50% - 0.5px)' }}
            />
          </div>

          <div className={videoShellClass}>
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              muted
              playsInline
              preload="auto"
              onEnded={handleVideoEnded}
            >
              <source src="/assets/chm1pro.mp4" type="video/mp4" />
              <source src="/assets/chm1pro.webm" type="video/webm" />
            </video>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.58)_100%)]" />
          </div>

          <button
            type="button"
            aria-label={prefersSound ? 'Mute video playback' : 'Unmute video playback'}
            onClick={handleSoundToggle}
            className={[
              'absolute z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white/80 shadow-[0_0_20px_rgba(0,0,0,0.35)] backdrop-blur-sm',
              'transition-all duration-300 ease-out hover:scale-105 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
              'right-2 top-1/2 -translate-y-1/2 md:right-3 md:top-3 md:translate-y-0',
              isExpanded ? 'opacity-100' : 'pointer-events-none opacity-0',
            ].join(' ')}
          >
            <VolumeIcon muted={!prefersSound} />
          </button>

          <button
            type="button"
            aria-label="Replay intro video"
            onClick={handleReplay}
            className={[
              'absolute z-10 flex items-center justify-center rounded-full border border-white/15 bg-black/70 text-white/80 shadow-[0_0_30px_rgba(0,0,0,0.35)] backdrop-blur-sm',
              'transition-all duration-300 ease-out hover:scale-105 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
              'h-11 w-11',
              isClosed ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-75',
            ].join(' ')}
          >
            <ReplayIcon />
          </button>
        </div>

        <Link href="/gemini-style" className={rightLinkClass}>
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
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-1 h-0 bg-green-500 transition-all duration-500 group-hover:h-32 opacity-0 group-hover:opacity-100" />
        </Link>
      </main>

      <footer className="fixed bottom-12 text-gray-700 text-[10px] tracking-[0.3em] uppercase">
        Chenghong Meng - Systems & Engineering
      </footer>

      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-[128px]" />
      </div>

      <style jsx>{`
        @keyframes divider-bump-x {
          0% { transform: scaleX(1); }
          45% { transform: scaleX(0.96); }
          72% { transform: scaleX(1.035); }
          100% { transform: scaleX(1); }
        }

        @keyframes divider-bump-y {
          0% { transform: scaleY(1); }
          45% { transform: scaleY(0.94); }
          72% { transform: scaleY(1.04); }
          100% { transform: scaleY(1); }
        }

        .landing-divider-bump {
          animation: divider-bump-y ${CLOSE_DURATION_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @media (min-width: 768px) {
          .landing-divider-bump {
            animation: divider-bump-x ${CLOSE_DURATION_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1);
          }
        }
      `}</style>
    </div>
  );
}
