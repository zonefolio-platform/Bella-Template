'use client';

import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StackProps {
  skills?: string[];
}

interface ParticleData {
  id:       number;
  top:      string;
  left:     string;
  duration: number;
  delay:    number;
}

// ─── Seeded pseudo-random (avoids hydration mismatch) ────────────────────────

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// ─── Particle dot ─────────────────────────────────────────────────────────────

function Particle({ particle }: { particle: ParticleData }): React.ReactElement {
  return (
    <div
      aria-hidden="true"
      style={{
        position:      'absolute',
        top:           particle.top,
        left:          particle.left,
        width:         '2px',
        height:        '2px',
        borderRadius:  '50%',
        background:    'var(--accent)',
        opacity:       0.2,
        animation:     `bella-particle-float ${particle.duration}s ease-in-out ${particle.delay}s infinite alternate`,
        pointerEvents: 'none',
      }}
    />
  );
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
        marginBottom:  '40px',
      }}
    >
      Stack
    </p>
  );
}

// ─── Stack section ────────────────────────────────────────────────────────────

export default function Stack({ skills = [] }: StackProps): React.ReactElement {
  const reducedMotion = useReducedMotion() ?? false;
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const allParticles = useMemo<ParticleData[]>(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id:       i,
      top:      `${Math.floor(seededRandom(i * 3)     * 100)}%`,
      left:     `${Math.floor(seededRandom(i * 3 + 1) * 100)}%`,
      duration: 4 + seededRandom(i * 3 + 2) * 6,
      delay:    seededRandom(i * 7) * 4,
    }));
  }, []);

  const particles = mounted && !reducedMotion ? allParticles : [];

  return (
    <>
      <style>{`
        @keyframes bella-particle-float {
          from { transform: translateY(0); }
          to   { transform: translateY(-18px); }
        }

        #stack {
          padding: clamp(72px, 8vw, 96px) clamp(24px, 4vw, 48px);
        }

        .bella-stack-particle-mobile-hide { display: block; }

        @media (max-width: 767px) {
          .bella-stack-particle-mobile-hide { display: none; }
        }
      `}</style>

      <section
        id="stack"
        aria-label="Tech stack"
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        {/* Particle background — sparse, like dust on paper */}
        {particles.map((p, i) => (
          <div
            key={p.id}
            className={i >= 20 ? 'bella-stack-particle-mobile-hide' : undefined}
          >
            <Particle particle={p} />
          </div>
        ))}

        <div style={{ position: 'relative', zIndex: 1 }}>
          <SectionLabel />

          {/* Editorial note in Cormorant italic */}
          <p
            style={{
              fontFamily:   'var(--bella-font-serif)',
              fontStyle:    'italic',
              fontWeight:   300,
              fontSize:     '18px',
              color:        'var(--bella-mid)',
              marginBottom: '48px',
              lineHeight:   1.5,
              maxWidth:     '520px',
            }}
          >
            The tools I reach for.
          </p>

          {skills.length > 0 ? (
            <div
              style={{
                display:        'flex',
                flexWrap:       'wrap',
                gap:            '20px 32px',
                justifyContent: 'center',
              }}
            >
              {skills.map((skill, i) => (
                <SkillTag key={`${skill}-${i}`} skill={skill} />
              ))}
            </div>
          ) : (
            <p
              style={{
                fontFamily:    'var(--bella-font-mono)',
                fontSize:      '13px',
                color:         'var(--bella-mid)',
                textAlign:     'center',
                letterSpacing: '0.3px',
              }}
            >
              No skills listed yet.
            </p>
          )}
        </div>
      </section>
    </>
  );
}

// ─── Skill tag — DM Mono, no bg, no border, accent color ─────────────────────

function SkillTag({ skill }: { skill: string }): React.ReactElement {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily:    'var(--bella-font-mono)',
        fontSize:      '14px',
        fontWeight:    400,
        color:         'var(--accent)',
        opacity:       hovered ? 0.6 : 1,
        cursor:        'default',
        transition:    'opacity 0.2s ease',
        letterSpacing: '0.2px',
      }}
    >
      {skill}
    </span>
  );
}
