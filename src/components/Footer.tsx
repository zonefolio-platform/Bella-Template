'use client';

import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export default function Footer(): React.ReactElement {
  const currentYear   = new Date().getFullYear();
  const reducedMotion = useReducedMotion() ?? false;
  const [hovered, setHovered] = useState(false);

  function scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
  }

  return (
    <>
      <style>{`
        #bella-footer {
          padding: 32px 48px;
          border-top: 1px solid var(--bella-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        @media (max-width: 640px) {
          #bella-footer {
            padding: 32px 24px !important;
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>

      <footer id="bella-footer">
        <p
          style={{
            fontFamily:    'var(--bella-font-mono)',
            fontSize:      '12px',
            fontWeight:    400,
            color:         'var(--bella-mid)',
            margin:        0,
            letterSpacing: '0.2px',
          }}
        >
          © {currentYear} · All rights reserved
        </p>

        {/* Scroll to top — minimal arrow */}
        <button
          type="button"
          onClick={scrollToTop}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label="Scroll to top"
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            width:          '32px',
            height:         '32px',
            borderRadius:   '50%',
            background:     'transparent',
            border:         `1px solid ${hovered ? 'var(--accent-border)' : 'var(--bella-border)'}`,
            color:          hovered ? 'var(--accent)' : 'var(--bella-mid)',
            cursor:         'pointer',
            transition:     'border-color 0.2s ease, color 0.2s ease',
            flexShrink:     0,
            fontSize:       '14px',
            lineHeight:     1,
          }}
        >
          ↑
        </button>
      </footer>
    </>
  );
}
