'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { PortfolioData, Project } from '@/types';
import { isFilled } from '@/lib/is-filled';

// ─── Types ────────────────────────────────────────────────────────────────────

interface WorkProps {
  data?: PortfolioData['projects'];
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
      Selected work
    </p>
  );
}

// ─── Project row ──────────────────────────────────────────────────────────────

interface ProjectRowProps {
  project:   Project;
  index:     number;
  isFirst:   boolean;
  reducedMotion: boolean;
}

function ProjectRow({ project, index, isFirst, reducedMotion }: ProjectRowProps): React.ReactElement {
  const [hovered, setHovered] = useState(false);
  const isEven    = index % 2 === 1;   // even-indexed rows flip image to left
  const hasImage  = isFilled(project.image);
  const hasLive   = isFilled(project.liveUrl);
  const hasSource = isFilled(project.githubUrl);
  const hasTech   = isFilled(project.technologies) && (project.technologies?.length ?? 0) > 0;

  // Column order flips per row so the image column always has the right width:
  //   odd  → 72px  | 1fr | 35%   [number | content | image]
  //   even → 35%   | 1fr | 72px  [image  | content | number]
  //   no img→ 72px | 1fr         [number | content]
  const gridCols = !hasImage
    ? '72px 1fr'
    : isEven
      ? '35% 1fr 72px'
      : '72px 1fr 35%';

  const numEl = (
    <div
      className="bella-work-num"
      aria-hidden="true"
      style={{
        fontFamily: 'var(--bella-font-serif)',
        fontWeight: 300,
        fontSize:   '48px',
        color:      'var(--bella-border-mid)',
        lineHeight: 1,
        userSelect: 'none',
        paddingTop: '4px',
      }}
    >
      {String(index + 1).padStart(2, '0')}
    </div>
  );

  const contentEl = (
    <div className="bella-work-content">
      <RowContent project={project} hasTech={hasTech} hasLive={hasLive} hasSource={hasSource} />
    </div>
  );

  // Wrap image in a className div so CSS can hide it reliably on mobile
  // (inline height: 220px would defeat :has() selectors and img display:none)
  const imageEl = hasImage ? (
    <div className="bella-work-img">
      <RowImage
        image={project.image}
        name={project.name}
        hovered={hovered}
        reducedMotion={reducedMotion}
      />
    </div>
  ) : null;

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      viewport={{ once: true }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:             'grid',
        gridTemplateColumns: gridCols,
        alignItems:          'start',
        gap:                 '32px',
        padding:             '40px 0',
        borderTop:           isFirst ? 'none' : '1px solid var(--bella-border)',
        position:            'relative',
        cursor:              'default',
        transition:          reducedMotion ? 'none' : 'background 0.25s ease',
        background:          hovered ? 'var(--accent-light)' : 'transparent',
      }}
    >
      {/* Accent line on hover — offset left so it sits outside the text column */}
      {hovered && !reducedMotion && (
        <div
          className="bella-work-accent"
          aria-hidden="true"
          style={{
            position:   'absolute',
            left:       '-4px',
            top:        0,
            bottom:     0,
            width:      '3px',
            background: 'var(--accent)',
          }}
        />
      )}

      {/* Render in natural DOM order matching the grid column order */}
      {isEven && hasImage ? (
        <>{imageEl}{contentEl}{numEl}</>
      ) : (
        <>{numEl}{contentEl}{imageEl}</>
      )}
    </motion.article>
  );
}

// ─── Row content ──────────────────────────────────────────────────────────────

interface RowContentProps {
  project:   Project;
  hasTech:   boolean;
  hasLive:   boolean;
  hasSource: boolean;
}

function RowContent({ project, hasTech, hasLive, hasSource }: RowContentProps): React.ReactElement {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Title */}
      <h3
        style={{
          fontFamily:    'var(--bella-font-serif)',
          fontWeight:    400,
          fontSize:      '24px',
          color:         'var(--bella-ink)',
          letterSpacing: '-0.3px',
          lineHeight:    1.2,
          margin:        0,
        }}
      >
        {project.name}
      </h3>

      {/* Description */}
      {isFilled(project.description) && (
        <p
          style={{
            fontFamily:     'var(--bella-font-body)',
            fontWeight:     300,
            fontSize:       '14px',
            color:          'var(--bella-mid)',
            lineHeight:     1.6,
            margin:         0,
            display:        '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow:       'hidden',
          }}
        >
          {project.description}
        </p>
      )}

      {/* Tech tags — DM Mono, no bg, separated by · */}
      {hasTech && (
        <p
          style={{
            fontFamily:    'var(--bella-font-mono)',
            fontSize:      '11px',
            color:         'var(--accent)',
            margin:        0,
            letterSpacing: '0.2px',
          }}
        >
          {project.technologies!.filter(isFilled).join(' · ')}
        </p>
      )}

      {/* Links */}
      {(hasLive || hasSource) && (
        <div style={{ display: 'flex', gap: '20px', marginTop: '4px' }}>
          {hasLive && (
            <RowLink href={project.liveUrl!} label="→ View live" />
          )}
          {hasSource && (
            <RowLink href={project.githubUrl!} label="Source" />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Row link ─────────────────────────────────────────────────────────────────

function RowLink({ href, label }: { href: string; label: string }): React.ReactElement {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily:    'var(--bella-font-mono)',
        fontSize:      '12px',
        color:         hovered ? 'var(--bella-ink)' : 'var(--bella-mid)',
        textDecoration: 'none',
        transition:    'color 0.2s ease',
      }}
    >
      {label}
    </a>
  );
}

// ─── Row image ────────────────────────────────────────────────────────────────

interface RowImageProps {
  image?:        string;
  name?:         string;
  hovered:       boolean;
  reducedMotion: boolean;
}

// RowImage only renders when image exists — the column is never created otherwise.
function RowImage({ image, name, hovered, reducedMotion }: RowImageProps): React.ReactElement {
  return (
    <div
      style={{
        width:        '100%',
        height:       '220px',
        borderRadius: '8px',
        overflow:     'hidden',
        flexShrink:   0,
      }}
    >
      <img
        src={image!}
        alt={name ?? ''}
        loading="lazy"
        decoding="async"
        style={{
          width:      '100%',
          height:     '100%',
          objectFit:  'cover',
          display:    'block',
          filter:     hovered && !reducedMotion ? 'saturate(0.3) sepia(0.2)' : 'none',
          transition: reducedMotion ? 'none' : 'filter 0.35s ease',
        }}
      />
    </div>
  );
}


// ─── Work section ─────────────────────────────────────────────────────────────

export default function Work({ data }: WorkProps): React.ReactElement {
  const projects      = (data?.projects ?? []).filter((p) => isFilled(p.name));
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <>
      <style>{`
        #work {
          padding: clamp(72px, 8vw, 96px) clamp(24px, 4vw, 48px);
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          #work article {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
            padding: 28px 0 !important;
          }
          /* Consistent mobile stack: number → image → content
             regardless of even/odd DOM order */
          .bella-work-num     { order: 0; }
          .bella-work-img     { order: 1; display: block !important; }
          .bella-work-content { order: 2; }
          /* Image height on mobile */
          .bella-work-img > div {
            height: 200px !important;
            border-radius: 10px !important;
          }
          /* Accent line irrelevant on touch */
          .bella-work-accent  { display: none !important; }
        }
      `}</style>

      <section id="work" aria-label="Selected work">
        <SectionLabel />

        {projects.length === 0 ? (
          <p
            style={{
              fontFamily: 'var(--bella-font-body)',
              fontSize:   '15px',
              color:      'var(--bella-mid)',
            }}
          >
            No projects to display yet.
          </p>
        ) : (
          <div>
            {projects.map((project, i) => (
              <ProjectRow
                key={project.name ?? i}
                project={project}
                index={i}
                isFirst={i === 0}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
