'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface NavProps {
  name:     string;
  sections: string[];
}

const SECTION_LABELS: Record<string, string> = {
  work:    'Work',
  about:   'About',
  stack:   'Stack',
  contact: 'Contact',
};

export default function Nav({ name, sections }: NavProps): React.ReactElement {
  const navLinks = useMemo(
    () => sections.map((id) => ({ id, label: SECTION_LABELS[id] ?? id })),
    [sections]
  );

  const [activeSection, setActiveSection] = useState<string>('hero');
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [scrolled,      setScrolled]      = useState(false);
  const shouldReduceMotion                = useReducedMotion();

  useEffect(() => {
    function onKey(e: KeyboardEvent): void {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const NAV_H = 60;

    function handleScroll(): void {
      setScrolled(window.scrollY > 20);

      if (
        sections.length > 0 &&
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10
      ) {
        setActiveSection(sections[sections.length - 1]);
        return;
      }

      const allIds = ['hero', ...sections];
      for (const id of [...allIds].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= NAV_H) {
          setActiveSection(id);
          return;
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  function scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  }

  // Hero section has a dark background — nav text must be light when unscrolled
  // Always glassy; bg tint adapts from dark-hero to cream
  const navBg         = scrolled ? 'rgba(247,245,240,0.88)' : 'rgba(26,24,20,0.12)';
  const navBorder     = scrolled ? '1px solid var(--bella-border)' : '1px solid rgba(255,255,255,0.06)';
  const navTransition = shouldReduceMotion ? undefined : 'background 0.3s ease, border-color 0.3s ease, color 0.3s ease';
  const nameColor     = scrolled ? 'var(--bella-ink)'      : 'rgba(255,255,255,0.88)';
  const linkColor     = scrolled ? 'var(--bella-mid)'      : 'rgba(255,255,255,0.55)';
  const linkActive    = scrolled ? 'var(--bella-ink)'      : 'rgba(255,255,255,0.92)';
  const barColor      = scrolled ? 'var(--bella-ink)'      : 'rgba(255,255,255,0.88)';

  const barBase: React.CSSProperties = {
    width:        '18px',
    height:       '1.5px',
    background:   barColor,
    borderRadius: '2px',
    display:      'block',
    transition:   navTransition,
  };

  return (
    <>
      <nav
        aria-label="Primary navigation"
        style={{
          position:             'fixed',
          top:                  0,
          left:                 0,
          right:                0,
          zIndex:               100,
          height:               '56px',
          display:              'flex',
          alignItems:           'center',
          padding:              '0 32px 0 40px',
          background:           navBg,
          backdropFilter:       'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom:         navBorder,
          transition:           navTransition,
        }}
      >
        {/* Left — Cormorant Garamond serif wordmark */}
        <div style={{ flex: 1 }}>
          <button
            onClick={() => scrollTo('hero')}
            style={{
              fontFamily:    'var(--bella-font-serif)',
              fontWeight:    400,
              fontSize:      '16px',
              letterSpacing: '-0.2px',
              color:         nameColor,
              background:    'none',
              border:        'none',
              cursor:        'pointer',
              padding:       0,
              lineHeight:    1,
              transition:    navTransition,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.65'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
          >
            {name}
          </button>
        </div>

        {/* Center — section links, desktop only */}
        <div
          style={{ display: 'none', alignItems: 'center', gap: 'clamp(24px, 3vw, 40px)' }}
          className="bella-nav-links"
        >
          {navLinks.map(({ id, label }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                style={{
                  position:   'relative',
                  fontFamily: 'var(--bella-font-body)',
                  fontWeight: 300,
                  fontSize:   '14px',
                  color:      isActive ? linkActive : linkColor,
                  background: 'none',
                  border:     'none',
                  cursor:     'pointer',
                  padding:    '0 0 3px',
                  lineHeight: 1,
                  transition: navTransition,
                }}
              >
                {label}
                {isActive && !shouldReduceMotion && (
                  <motion.span
                    layoutId="bella-nav-underline"
                    style={{
                      position:   'absolute',
                      bottom:     '-1px',
                      left:       0,
                      right:      0,
                      height:     '1px',
                      background: 'var(--accent)',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {isActive && shouldReduceMotion && (
                  <span
                    style={{
                      position:   'absolute',
                      bottom:     '-1px',
                      left:       0,
                      right:      0,
                      height:     '1px',
                      background: 'var(--accent)',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right — hamburger (mobile only) */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="bella-hamburger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            style={{
              display:        'flex',
              flexDirection:  'column',
              gap:            '5px',
              padding:        '8px',
              minWidth:       '44px',
              minHeight:      '44px',
              alignItems:     'center',
              justifyContent: 'center',
              background:     'none',
              border:         'none',
              cursor:         'pointer',
            }}
          >
            <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6.5 : 0 }}   style={barBase} />
            <motion.span animate={{ opacity: menuOpen ? 0 : 1 }}                            style={barBase} />
            <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6.5 : 0 }} style={barBase} />
          </button>
        </div>
      </nav>

      <style>{`
        @media (min-width: 768px) {
          .bella-nav-links { display: flex !important; }
          .bella-hamburger  { display: none  !important; }
        }
      `}</style>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="bella-mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            style={{
              position:             'fixed',
              inset:                0,
              zIndex:               99,
              display:              'flex',
              flexDirection:        'column',
              alignItems:           'center',
              justifyContent:       'center',
              gap:                  '40px',
              background:           'rgba(247,245,240,0.97)',
              backdropFilter:       'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              style={{
                position:   'absolute',
                top:        '20px',
                right:      '24px',
                background: 'none',
                border:     'none',
                cursor:     'pointer',
                color:      'var(--bella-mid)',
                fontSize:   '24px',
                lineHeight: 1,
                padding:    '4px',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--bella-ink)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--bella-mid)'; }}
            >
              ×
            </button>

            {navLinks.map(({ id, label }, i) => {
              const isActive = activeSection === id;
              return (
                <motion.button
                  key={id}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                  onClick={() => scrollTo(id)}
                  style={{
                    fontFamily:    'var(--bella-font-serif)',
                    fontWeight:    300,
                    fontSize:      '36px',
                    letterSpacing: '-1px',
                    color:         isActive ? 'var(--accent)' : 'var(--bella-ink)',
                    background:    'none',
                    border:        'none',
                    cursor:        'pointer',
                    transition:    'color 0.2s ease',
                    lineHeight:    1,
                    padding:       0,
                  }}
                >
                  {label}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
