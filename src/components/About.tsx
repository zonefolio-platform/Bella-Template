'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { PortfolioData, WorkExperience, Education } from '@/types';
import { isFilled } from '@/lib/is-filled';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AboutProps {
  data?: PortfolioData['about'];
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel(): React.ReactElement {
  return (
    <p
      style={{
        fontFamily:    'var(--bella-font-mono)',
        fontSize:      '10px',
        fontWeight:    500,
        letterSpacing: '2px',
        textTransform: 'uppercase',
        color:         'var(--accent)',
        paddingLeft:   '10px',
        borderLeft:    '1px solid var(--accent)',
        marginBottom:  '56px',
      }}
    >
      About
    </p>
  );
}

// ─── Subheading ───────────────────────────────────────────────────────────────

function Subheading({ children }: { children: string }): React.ReactElement {
  return (
    <h3
      style={{
        fontFamily:    'var(--bella-font-serif)',
        fontWeight:    400,
        fontSize:      '18px',
        color:         'var(--bella-ink)',
        marginBottom:  '20px',
        marginTop:     0,
        letterSpacing: '-0.2px',
      }}
    >
      {children}
    </h3>
  );
}

// ─── Experience item ──────────────────────────────────────────────────────────

function ExperienceItem({ item, isLast }: { item: WorkExperience; isLast: boolean }): React.ReactElement {
  return (
    <div
      style={{
        marginBottom:  isLast ? 0 : '24px',
        paddingBottom: isLast ? 0 : '24px',
        borderBottom:  isLast ? 'none' : '1px solid var(--bella-border)',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--bella-font-serif)',
          fontWeight: 400,
          fontSize:   '16px',
          color:      'var(--bella-ink)',
          margin:     0,
          lineHeight: 1.3,
        }}
      >
        {item.position}
      </p>

      {(isFilled(item.company) || isFilled(item.duration)) && (
        <p
          style={{
            fontFamily:    'var(--bella-font-mono)',
            fontSize:      '11px',
            color:         'var(--accent)',
            margin:        '5px 0 8px',
            letterSpacing: '0.2px',
          }}
        >
          {[item.company, item.duration].filter(Boolean).join(' · ')}
        </p>
      )}

      {isFilled(item.description) && (
        <p
          style={{
            fontFamily: 'var(--bella-font-body)',
            fontWeight: 300,
            fontSize:   '14px',
            color:      'var(--bella-mid)',
            lineHeight: 1.7,
            margin:     0,
          }}
        >
          {item.description}
        </p>
      )}
    </div>
  );
}

// ─── Education item ───────────────────────────────────────────────────────────

function EducationItem({ item, isLast }: { item: Education; isLast: boolean }): React.ReactElement {
  return (
    <div
      style={{
        marginBottom:  isLast ? 0 : '20px',
        paddingBottom: isLast ? 0 : '20px',
        borderBottom:  isLast ? 'none' : '1px solid var(--bella-border)',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--bella-font-serif)',
          fontWeight: 400,
          fontSize:   '16px',
          color:      'var(--bella-ink)',
          margin:     0,
          lineHeight: 1.3,
        }}
      >
        {item.degree}
      </p>

      {(isFilled(item.university) || isFilled(item.from) || isFilled(item.to)) && (
        <p
          style={{
            fontFamily:    'var(--bella-font-mono)',
            fontSize:      '11px',
            color:         'var(--accent)',
            margin:        '5px 0 6px',
            letterSpacing: '0.2px',
          }}
        >
          {[
            item.university,
            isFilled(item.from) && isFilled(item.to) ? `${item.from}–${item.to}` : undefined,
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>
      )}

      {isFilled(item.GPA) && (
        <p
          style={{
            fontFamily: 'var(--bella-font-mono)',
            fontSize:   '11px',
            color:      'var(--bella-mid)',
            margin:     0,
          }}
        >
          GPA {item.GPA}
        </p>
      )}
    </div>
  );
}

// ─── Portrait image ───────────────────────────────────────────────────────────

function PortraitColumn({ image, name }: { image: string; name?: string }): React.ReactElement {
  return (
    <div
      style={{
        width:          '80%',
        aspectRatio:    '1 / 1',
        maxWidth:       '400px',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        margin:         '0 auto',
      }}
    >
      <Image
        src={image}
        alt={name ?? 'Portrait'}
        width={400}
        height={400}
        quality={90}
        sizes="(max-width: 768px) 80vw, 400px"
        style={{
          objectFit:    'cover',
          width:        '100%',
          height:       '100%',
          borderRadius: '73% 27% 80% 20% / 41% 62% 38% 59%',
          border:       '4px solid var(--accent-border)',
          boxShadow:    '0 0 20px var(--accent-light)',
          display:      'block',
        }}
      />
    </div>
  );
}


// ─── About section ────────────────────────────────────────────────────────────

export default function About({ data }: AboutProps): React.ReactElement {
  const bio        = data?.bio;
  const image      = data?.image;
  const experience = (data?.experience ?? []).filter((e) => isFilled(e.position));
  const education  = (data?.education  ?? []).filter((e) => isFilled(e.degree));
  const hasImage   = isFilled(image);
  const reducedMotion = useReducedMotion() ?? false;

  const motionProps = reducedMotion
    ? {}
    : {
        initial:     { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0  },
        transition:  { duration: 0.6, ease: 'easeOut' as const },
        viewport:    { once: true },
      };

  return (
    <>
      <style>{`
        #about {
          padding: clamp(72px, 8vw, 96px) clamp(24px, 4vw, 48px);
          background: var(--secondary);
        }

        #about-inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        #about-grid {
          display: grid;
          /* columns set via inline style — 3-col when portrait exists, 2-col when not */
          gap: 56px;
          align-items: start;
        }

        @media (max-width: 768px) {
          #about { padding: 72px 24px !important; }
          #about-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>

      <motion.section id="about" aria-label="About" {...motionProps}>
        <div id="about-inner">
          <SectionLabel />

          <div
            id="about-grid"
            style={{
              gridTemplateColumns: hasImage ? '1fr 280px 1fr' : '1fr 1fr',
            }}
          >
            {/* Left column: bio + experience */}
            <div>
              {isFilled(bio) && (
                <p
                  style={{
                    fontFamily:   'var(--bella-font-body)',
                    fontWeight:   300,
                    fontSize:     '15px',
                    color:        'var(--bella-mid)',
                    lineHeight:   1.8,
                    marginBottom: experience.length > 0 ? '40px' : 0,
                    marginTop:    0,
                  }}
                >
                  {bio}
                </p>
              )}

              {experience.length > 0 && (
                <div>
                  <Subheading>Experience</Subheading>
                  {experience.map((item, i) => (
                    <ExperienceItem
                      key={item.position ?? i}
                      item={item}
                      isLast={i === experience.length - 1}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Center column: portrait — only rendered when image exists */}
            {hasImage && (
              <PortraitColumn image={image!} name={undefined} />
            )}

            {/* Right column: education */}
            <div>
              {education.length > 0 && (
                <div>
                  <Subheading>Education</Subheading>
                  {education.map((item, i) => (
                    <EducationItem
                      key={item.degree ?? i}
                      item={item}
                      isLast={i === education.length - 1}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
}
