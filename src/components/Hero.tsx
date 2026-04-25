'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { PortfolioData } from '@/types';
import { isFilled } from '@/lib/is-filled';

const LightPillar = dynamic(() => import('./LightPillar'), { ssr: false });

interface HeroProps {
  data?:      PortfolioData['hero'];
  available?: boolean;
}

// ─── Display name ─────────────────────────────────────────────────────────────

interface DisplayNameProps {
  name?:         string;
  reducedMotion: boolean;
}

function DisplayName({ name, reducedMotion }: DisplayNameProps): React.ReactElement {
  const firedRef = useRef(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!firedRef.current && !reducedMotion) {
      firedRef.current = true;
      setAnimate(true);
    }
  }, [reducedMotion]);

  const words      = (name ?? '').trim().split(/\s+/).filter(Boolean);
  const firstLine  = words.slice(0, Math.max(1, words.length - 1)).join(' ');
  const secondWord = words.length > 1 ? words[words.length - 1] : null;

  const lineBase: React.CSSProperties = {
    display:       'block',
    fontFamily:    'var(--bella-font-serif)',
    fontWeight:    300,
    fontSize:      'clamp(44px, 6.5vw, 80px)',
    letterSpacing: '-2px',
    lineHeight:    0.95,
  };

  const nameBlock = (
    <div>
      <span style={{ ...lineBase, fontStyle: 'normal', color: 'rgba(255,255,255,0.92)' }}>
        {firstLine}
      </span>
      {secondWord && (
        <span style={{ ...lineBase, fontStyle: 'italic', color: 'var(--bella-mid)' }}>
          {secondWord}
        </span>
      )}
    </div>
  );

  if (reducedMotion || !animate) return nameBlock;

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)', y: 16 }}
      animate={{ opacity: 1, filter: 'blur(0px)',  y: 0  }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {nameBlock}
    </motion.div>
  );
}

// ─── Rotating subtitle ────────────────────────────────────────────────────────

interface RotatingSubtitleProps {
  roles:         string[];
  reducedMotion: boolean;
}

function RotatingSubtitle({ roles, reducedMotion }: RotatingSubtitleProps): React.ReactElement | null {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion || roles.length <= 1) return;
    const id = setInterval(() => setIndex((p) => (p + 1) % roles.length), 2500);
    return () => clearInterval(id);
  }, [reducedMotion, roles.length]);

  if (!roles[0]) return null;

  const base: React.CSSProperties = {
    fontFamily: 'var(--bella-font-body)',
    fontWeight: 300,
    fontSize:   '17px',
    color:      'rgba(255,255,255,0.45)',
    marginTop:  '24px',
    display:    'block',
    minHeight:  '26px',
  };

  if (reducedMotion) return <span style={base}>{roles[0]}</span>;

  return (
    <span style={{ ...base, position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={roles[index]}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0  }}
          exit={{    opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          style={{ display: 'block' }}
        >
          <span style={{ fontFamily: 'var(--bella-font-serif)', fontStyle: 'italic' }}>
            {roles[index]}
          </span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ─── Profile image card ───────────────────────────────────────────────────────

interface ProfileCardProps {
  image: string;
  name:  string;
}

function ProfileCard({ image, name }: ProfileCardProps): React.ReactElement {
  return (
    <div
      style={{
        width:          '80%',
        aspectRatio:    '1 / 1',
        maxWidth:       '400px',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        flexShrink:     0,
      }}
    >
      <Image
        src={image}
        alt={name}
        width={400}
        height={400}
        quality={90}
        priority
        sizes="(max-width: 768px) 80vw, 400px"
        style={{
          objectFit:    'cover',
          width:        '100%',
          height:       '100%',
          borderRadius: '73% 27% 80% 20% / 41% 62% 38% 59%',
          border:       '4px solid rgba(255,255,255,0.85)',
          boxShadow:    '0 0 20px rgba(255,255,255,0.5)',
          display:      'block',
        }}
      />
    </div>
  );
}

// ─── CTA row ──────────────────────────────────────────────────────────────────

function CtaRow(): React.ReactElement {
  const [ghostHover, setGhostHover] = useState(false);
  function scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div style={{ display: 'flex', gap: '12px', marginTop: '40px', flexWrap: 'wrap' }}>
      <button
        type="button"
        onClick={() => scrollTo('work')}
        style={{
          fontFamily:   'var(--bella-font-body)',
          fontWeight:   400,
          fontSize:     '14px',
          padding:      '12px 28px',
          borderRadius: '4px',
          cursor:       'pointer',
          lineHeight:   1,
          background:   'var(--accent)',
          color:        'var(--bella-ink)',
          border:       'none',
          transition:   'opacity 0.2s ease',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
        aria-label="View my work"
      >
        View work →
      </button>

      <button
        type="button"
        onClick={() => scrollTo('contact')}
        onMouseEnter={() => setGhostHover(true)}
        onMouseLeave={() => setGhostHover(false)}
        style={{
          fontFamily:   'var(--bella-font-body)',
          fontWeight:   400,
          fontSize:     '14px',
          padding:      '12px 28px',
          borderRadius: '4px',
          cursor:       'pointer',
          lineHeight:   1,
          background:   'transparent',
          color:        ghostHover ? 'var(--accent)' : 'rgba(255,255,255,0.7)',
          border:       ghostHover ? '1px solid var(--accent-border)' : '1px solid rgba(255,255,255,0.2)',
          transition:   'color 0.25s ease, border-color 0.25s ease',
        }}
        aria-label="Get in touch"
      >
        Get in touch
      </button>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero({ data, available }: HeroProps): React.ReactElement {
  const name  = data?.name;
  const title = data?.title;
  const image = data?.image;

  const reducedMotion = useReducedMotion() ?? false;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function check(): void { setIsMobile(window.innerWidth < 768); }
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  const roles    = title?.includes(' & ')
    ? title.split(' & ').map((r) => r.trim())
    : [title ?? ''];
  const hasImage = isFilled(image);

  // Grid is two-column only when portrait exists; auto right column lets card self-size
  const gridCols = hasImage ? '1fr auto' : '1fr';

  return (
    <>
      <style>{`
        #bella-hero {
          position:        relative;
          overflow:        hidden;
          min-height:      100vh;
          display:         flex;
          align-items:     center;
          justify-content: center;
          padding:         80px 48px;
          background:      var(--bella-ink);
        }

        #bella-hero-content {
          position:   relative;
          z-index:    1;
          display:    grid;
          align-items: center;
          gap:         72px;
          width:       100%;
          max-width:   1200px;
        }

        .bella-eyebrow {
          display:       flex;
          align-items:   center;
          gap:           14px;
          margin-bottom: 32px;
        }
        .bella-eyebrow-line {
          width:       24px;
          height:      1px;
          background:  var(--accent);
          flex-shrink: 0;
        }
        .bella-eyebrow-text {
          font-family:    var(--bella-font-mono);
          font-size:      10px;
          font-weight:    500;
          letter-spacing: 2px;
          text-transform: uppercase;
          color:          var(--accent);
        }

        /* Tablet — shrink portrait column */
        @media (min-width: 769px) and (max-width: 960px) {
          #bella-hero-content.bella-has-portrait {
            gap: 48px !important;
          }
        }

        /* Mobile — single column, centered */
        @media (max-width: 768px) {
          #bella-hero {
            padding:     64px 24px !important;
            align-items: center !important;
          }
          #bella-hero-content {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
            text-align: center;
          }
          .bella-eyebrow {
            justify-content: center;
          }
          .bella-hero-left-col > div:last-child {
            justify-content: center;
          }
        }
      `}</style>

      <section id="bella-hero" aria-label="Hero">
        {/* LightPillar — screen blend on dark bg gives crisp gold strands */}
        {!reducedMotion && (
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <LightPillar
              topColor="#C8A96E"
              bottomColor="#E8C050"
              intensity={1.2}
              rotationSpeed={0.2}
              glowAmount={0.002}
              pillarWidth={isMobile ? 5.0 : 3.5}
              pillarHeight={0.4}
              noiseIntensity={0.3}
              pillarRotation={25}
              interactive={false}
              mixBlendMode="screen"
              quality={isMobile ? 'low' : 'medium'}
            />
          </div>
        )}

        <div
          id="bella-hero-content"
          className={hasImage ? 'bella-has-portrait' : ''}
          style={{ gridTemplateColumns: gridCols }}
        >
          {/* Left: text */}
          <div className="bella-hero-left-col">
            <div className="bella-eyebrow" aria-hidden="true">
              <span className="bella-eyebrow-line" />
              <span className="bella-eyebrow-text">
                {available ? 'Available for work' : (title ?? 'Portfolio')}
              </span>
            </div>

            <DisplayName name={name} reducedMotion={reducedMotion} />
            <RotatingSubtitle roles={roles} reducedMotion={reducedMotion} />
            <CtaRow />
          </div>

          {/* Right: portrait — only renders if image exists, takes NO space otherwise */}
          {hasImage && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ProfileCard image={image!} name={name ?? ''} />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
