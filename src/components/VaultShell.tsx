'use client';

import { useMemo } from 'react';
import { PortfolioData } from '@/types';
import { isFilled } from '@/lib/is-filled';
import Nav from './Nav';
import Hero from './Hero';
import Work from './Work';
import About from './About';
import Stack from './Stack';
import Contact from './Contact';
import Footer from './Footer';
import SplashCursorLoader from './SplashCursorLoader';

interface BellaShellProps {
  data: PortfolioData;
}

export default function VaultShell({ data }: BellaShellProps): React.ReactElement {
  const hero = data.hero;
  const showHero = isFilled(hero?.name) || isFilled(hero?.title);

  const rawProjects   = data.projects?.projects ?? [];
  const validProjects = rawProjects.filter((p) => isFilled(p.name));
  const showWork      = validProjects.length > 0;

  const about       = data.about;
  const validSkills = (about?.skills ?? []).filter((s) => isFilled(s));
  const validExp    = (about?.experience ?? []).filter((e) => isFilled(e.position));
  const validEdu    = (about?.education  ?? []).filter((e) => isFilled(e.degree));
  const showAbout   = isFilled(about?.bio) || validSkills.length > 0 || validExp.length > 0 || validEdu.length > 0;

  const showStack = validSkills.length > 0;

  const contact     = data.contact;
  const showContact = isFilled(contact?.email) || isFilled(contact?.phone) || isFilled(contact?.whatsapp) || isFilled(contact?.location);

  const visibleSections = useMemo(
    () =>
      ([
        showWork    && 'work',
        showAbout   && 'about',
        showStack   && 'stack',
        showContact && 'contact',
      ] as (string | false)[]).filter((s): s is string => Boolean(s)),
    [showWork, showAbout, showStack, showContact]
  );

  const available = data.meta?.plan !== 'UNAVAILABLE';

  return (
    <>
      <Nav name={hero?.name ?? ''} sections={visibleSections} />
      <SplashCursorLoader />

      <main>
        {showHero    && <Hero    data={hero}          available={available} />}
        {showWork    && <Work    data={data.projects} />}
        {showAbout   && <About   data={about}         />}
        {showStack   && <Stack   skills={validSkills} />}
        {showContact && <Contact data={contact} socialLinks={hero?.socialLinks} />}
      </main>

      <Footer />
    </>
  );
}
