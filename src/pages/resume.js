import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { CONTACT_INFO, EXPERIENCES, HERO_INFO, PROJECTS, SKILLS } from '../lib/sharedfunctions';
import styles from '../styles/Resume.module.css';

const visibleProjects = PROJECTS.filter((project) => project.title && project.description);

function externalHref(contact) {
  return contact.href.startsWith('mailto:') ? contact.href.replace('mailto:', '') : contact.href;
}

export default function Resume() {
  const router = useRouter();
  const hasRequestedPrint = useRef(false);

  useEffect(() => {
    if (!router.isReady || router.query.print !== '1' || hasRequestedPrint.current) return;

    hasRequestedPrint.current = true;
    const printResume = () => window.print();

    if (document.fonts?.ready) {
      document.fonts.ready.then(printResume);
    } else {
      printResume();
    }
  }, [router.isReady, router.query.print]);

  return (
    <>
      <Head>
        <title>Chenghong Meng | Resume</title>
        <meta name="description" content="Resume for Chenghong Meng, Full-Stack Developer." />
      </Head>

      <main className={styles.page}>
        <article className={styles.resume}>
          <header className={styles.header}>
            <div>
              <h1>{HERO_INFO.title}</h1>
              <p className={styles.role}>{HERO_INFO.subTitle}</p>
            </div>
            <address className={styles.contact}>
              <span>{HERO_INFO.area}</span>
              {CONTACT_INFO.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  {externalHref(item)}
                </a>
              ))}
            </address>
          </header>

          <ResumeSection title="Summary">
            <p>{HERO_INFO.summary}</p>
          </ResumeSection>

          <ResumeSection title="Experience">
            <div className={styles.entryList}>
              {EXPERIENCES.map((experience) => (
                <section className={styles.entry} key={experience.id}>
                  <div className={styles.entryHeading}>
                    <h3>{experience.title}</h3>
                    <span>{experience.dateRange}</span>
                  </div>
                  <p>{experience.scope}</p>
                  {experience.projects?.length > 0 && (
                    <ul>
                      {experience.projects.map((project, index) => (
                        <li key={`${project.title}-${index}`}>
                          <strong>{project.title}.</strong> {project.description}
                        </li>
                      ))}
                    </ul>
                  )}
                  <TagList tags={experience.tags} />
                </section>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title="Selected Projects">
            <div className={styles.entryList}>
              {visibleProjects.map((project, index) => (
                <section className={styles.entry} key={`${project.id}-${index}`}>
                  <div className={styles.entryHeading}>
                    <h3>{project.title}</h3>
                    <span>{project.year}</span>
                  </div>
                  <p>{project.description}</p>
                  <TagList tags={project.tags} />
                </section>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title="Skills">
            <ul className={styles.skills}>
              {SKILLS.map((skill) => (
                <li key={skill.name}>
                  <strong>{skill.name}</strong>
                  <span>{skill.level}</span>
                </li>
              ))}
            </ul>
          </ResumeSection>
        </article>
      </main>
    </>
  );
}

function ResumeSection({ title, children }) {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function TagList({ tags = [] }) {
  if (!tags.length) return null;

  return <p className={styles.tags}>{tags.join(' · ')}</p>;
}
