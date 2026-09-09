import Head from 'next/head';
import Link from 'next/link';
import { CONTACT_INFO, EXPERIENCES, HERO_INFO, PROJECTS, SKILLS } from '../lib/sharedfunctions';
import styles from '../styles/GptStyle.module.css';

// Place ongoing work at its start date, so chronology stays stable over time.
const milestones = [
  ...PROJECTS.filter((item) => item.title && item.description).map((item) => ({ ...item, kind: 'Project', date: item.year })),
  ...EXPERIENCES.map((item) => ({ ...item, kind: 'Experience', date: item.dateRange, description: item.scope })),
  ...EXPERIENCES.flatMap((experience) => (experience.projects || []).map((item) => ({ ...item, kind: 'Project', date: item.year, context: experience.title.split(' | ')[1] }))),
].sort((a, b) => b.date.slice(0, 7).localeCompare(a.date.slice(0, 7)));
const years = [...new Set(milestones.map((item) => item.date.slice(0, 4)))];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function GptStyle() {
  return (
    <div className={styles.page}>
      <Head>
        <title>Chenghong Meng | GPT Style · A digital journey</title>
        <meta name="description" content="Explore Chenghong Meng’s projects and engineering experience, from production systems to applied AI, through an interactive timeline." />
      </Head>
      <a href="#journey" className={styles.skip}>Skip to timeline</a>
      <div className={styles.ambient} aria-hidden="true" />
      <header className={styles.header}>
        <Link href="/" className={styles.brand}><span className={styles.brandMark}>✳</span> chm<span className={styles.brandDot}>.one</span></Link>
        <nav aria-label="Main navigation"><a href="#journey">Journey</a><a href="#about">About</a><a href="#contact">Contact <Arrow /></a></nav>
        <Link href="/" className={styles.edition}>GPT STYLE <span> / 03</span></Link>
      </header>

      <main>
        <section className={styles.hero} aria-labelledby="intro-title">
          <div className={styles.eyebrow}><span /> CHENGHONG MENG · {HERO_INFO.area.toUpperCase()}</div>
          <h1 id="intro-title">A little curiosity.<br />An endless <em>journey.</em></h1>
          <p className={styles.intro}>Full-stack developer exploring the space between<br className={styles.desktopBreak} /> thoughtful systems and the possibilities of AI.</p>
          <div className={styles.heroActions}><a href="#journey" className={styles.primary}>Explore my timeline <span aria-hidden="true">↓</span></a><Link href="/resume?print=1" className={styles.resume}>Print Resume <Arrow /></Link></div>
          <div className={styles.coordinates} aria-hidden="true"><span>BUILD · LEARN · ITERATE</span><span>01 — ∞</span></div>
          <div className={styles.horizon} aria-hidden="true"><div /><span>✧</span></div>
        </section>

        <section id="journey" className={styles.journey} aria-labelledby="journey-title">
          <div className={styles.sectionHeading}><div><p className={styles.kicker}>THE JOURNEY</p><h2 id="journey-title">Connecting the dots<span>.</span></h2></div><p>Projects, people, and everything I’ve built along the way.</p></div>
          <div className={styles.timelineLayout}>
            <aside className={styles.yearRail}><nav aria-label="Timeline years"><span className={styles.railLabel}>CHAPTERS</span>{years.map((year) => <a key={year} href={`#year-${year}`}>{year}<span aria-hidden="true">↘</span></a>)}</nav><p><span className={styles.projectDot} /> Project<br /><span className={styles.experienceDot} /> Experience</p></aside>
            <div className={styles.timeline}>
              {years.map((year) => <section key={year} id={`year-${year}`} className={styles.yearGroup} aria-labelledby={`heading-${year}`}>
                <h3 id={`heading-${year}`} className={styles.yearHeading}><span className={styles.yearNode} />{year}<span className={styles.yearCaption}>{year === years[0] ? 'EXPLORING NEW POSSIBILITIES' : 'BUILDING THE FOUNDATION'}</span></h3>
                <ol className={styles.entries}>{milestones.filter((item) => item.date.startsWith(year)).map((item) => <li key={item.id} className={`${styles.entry} ${item.kind === 'Experience' ? styles.experience : ''}`}>
                  <span className={styles.node} aria-hidden="true" />
                  <article className={styles.card}>
                    <div className={styles.cardMeta}><span>{item.kind === 'Experience' ? '◇' : '✧'} {item.kind}{item.context ? ` / ${item.context}` : ''}</span><span>{item.date}</span></div>
                    <h4>{item.title}</h4>
                    <p className={styles.description}>{item.description}</p>
                    <div className={styles.tags}>{item.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    <div className={styles.cardFooter}><span className={styles.status}><i />{item.status}</span>{item.github && item.github !== '#' && <a href={item.github} target="_blank" rel="noreferrer">View on GitHub <Arrow /></a>}</div>
                  </article>
                </li>)}</ol>
              </section>)}
              <div className={styles.beginning}><span>✦</span> Every next chapter starts with curiosity.</div>
            </div>
          </div>
        </section>

        <section id="about" className={styles.about} aria-labelledby="about-title"><div><p className={styles.kicker}>BEHIND THE WORK</p><h2 id="about-title">Grounded in systems.<br /><em>Drawn to possibility.</em></h2></div><div><p>{HERO_INFO.summary}</p><div className={styles.skillList}>{SKILLS.map((skill) => <span key={skill.name}>{skill.name}</span>)}</div></div></section>
        <section id="contact" className={styles.contact} aria-labelledby="contact-title"><p className={styles.kicker}>THE NEXT CHAPTER</p><h2 id="contact-title">Let’s make something<br /><em>worth building.</em></h2><div>{CONTACT_INFO.map((item) => <a key={item.id} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noreferrer' : undefined}>{item.label} <Arrow /></a>)}</div></section>
      </main>
      <footer className={styles.footer}><Link href="/">← All styles</Link><span>CHENGHONG MENG · GPT STYLE</span><a href="#intro-title">Back to the stars ↑</a></footer>
    </div>
  );
}
