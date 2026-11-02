import Head from 'next/head';
import Link from 'next/link';
import { CASE_STUDIES, trackActivity } from '../lib/sharedfunctions';

function VideoEmbed({ youtubeId, title }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
        title={title}
        allow="encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}

export default function CaseStudies() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono selection:bg-yellow-500/30">
      <Head>
        <link rel="icon" href="./assets/eyes.gif" sizes="any" type="image/png" />
        <title>Chenghong Meng | Case Studies</title>
        <meta name="description" content="Short video walkthroughs of systems Chenghong Meng rebuilt." />
      </Head>

      <main className="mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-24">
        <Link href="/" className="text-xs uppercase tracking-[0.3em] text-gray-500 transition-colors hover:text-yellow-500">
          ← chm1.pro
        </Link>

        <header className="mt-10 mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-yellow-500/80">$ ls ./case-studies</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tighter md:text-5xl">Case Studies</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-400">
            Short video walkthroughs: what broke, why, and how I fixed it.
          </p>
        </header>

        <div className="flex flex-col gap-20">
          {CASE_STUDIES.map((cs, i) => (
            <article key={cs.id} id={cs.id} className="scroll-mt-16">
              <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs text-gray-500">
                <span className="text-yellow-500/80">{String(i + 1).padStart(2, '0')}</span>
                <span>{cs.org}</span>
                <span>· {cs.duration}</span>
              </div>
              <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">{cs.title}</h2>

              <div onClickCapture={() => trackActivity('case-studies', 'video_click', cs.id)}>
                <VideoEmbed youtubeId={cs.youtubeId} title={cs.title} />
              </div>

              <p className="mt-6 max-w-3xl text-sm leading-relaxed text-gray-300">{cs.summary}</p>
              <ul className="mt-4 max-w-3xl space-y-2 text-sm leading-relaxed text-gray-400">
                {cs.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="text-green-500/80" aria-hidden="true">›</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                {cs.tags.map((t) => (
                  <span key={t} className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-gray-400">
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </main>

      <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-yellow-500/5 blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-green-500/5 blur-[128px]" />
      </div>
    </div>
  );
}
