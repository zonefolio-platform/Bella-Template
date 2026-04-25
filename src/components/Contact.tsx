'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiInstagram, FiYoutube, FiFacebook, FiPhone, FiMapPin, FiMail } from 'react-icons/fi';
import { FaXTwitter } from 'react-icons/fa6';
import { SiBehance, SiDribbble, SiPinterest, SiTiktok, SiVimeo, SiMedium, SiWhatsapp } from 'react-icons/si';
import { PortfolioData, SocialLink } from '@/types';
import { isFilled } from '@/lib/is-filled';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContactProps {
  data?:        PortfolioData['contact'];
  socialLinks?: SocialLink[];
}

type IconComponent = React.ComponentType<{ size?: number }>;

const SOCIAL_ICONS: Record<string, IconComponent> = {
  github:    FiGithub,
  linkedin:  FiLinkedin,
  twitter:   FaXTwitter,
  instagram: FiInstagram,
  behance:   SiBehance,
  dribbble:  SiDribbble,
  youtube:   FiYoutube,
  pinterest: SiPinterest,
  facebook:  FiFacebook,
  tiktok:    SiTiktok,
  vimeo:     SiVimeo,
  medium:    SiMedium,
};

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel(): React.ReactElement {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
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
          margin:        0,
        }}
      >
        Contact
      </p>
    </div>
  );
}

// ─── Display email link ───────────────────────────────────────────────────────

function EmailLink({ email }: { email: string }): React.ReactElement {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={`mailto:${email}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily:     'var(--bella-font-serif)',
        fontStyle:      'italic',
        fontWeight:     300,
        fontSize:       'clamp(28px, 4.5vw, 60px)',
        letterSpacing:  '-1px',
        color:          hovered ? 'var(--accent)' : 'var(--bella-ink)',
        textDecoration: hovered ? 'underline' : 'none',
        display:        'block',
        marginBottom:   '56px',
        transition:     'color 0.3s ease',
        wordBreak:      'break-word',
        lineHeight:     1.1,
      }}
    >
      {email}
    </a>
  );
}

// ─── Contact detail card ──────────────────────────────────────────────────────

interface ContactCardProps {
  Icon:   IconComponent;
  label:  string;
  value:  string;
  href?:  string;
}

function ContactCard({ Icon, label, value, href }: ContactCardProps): React.ReactElement {
  const [hovered, setHovered] = useState(false);

  const inner = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:      'flex',
        alignItems:   'center',
        gap:          '16px',
        background:   'var(--bella-surface)',
        border:       `1px solid ${hovered ? 'var(--accent-border)' : 'var(--bella-border)'}`,
        borderRadius: '8px',
        padding:      '18px 22px',
        transition:   'border-color 0.2s ease, box-shadow 0.2s ease',
        boxShadow:    hovered ? '0 0 16px var(--highlight-glow)' : 'none',
        cursor:       href ? 'pointer' : 'default',
        textAlign:    'left',
      }}
    >
      <span style={{ color: 'var(--accent)', display: 'flex', flexShrink: 0 }}>
        <Icon size={18} />
      </span>
      <div>
        <p
          style={{
            fontFamily:    'var(--bella-font-mono)',
            fontSize:      '9px',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color:         'var(--bella-mid)',
            margin:        '0 0 3px',
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontFamily: 'var(--bella-font-body)',
            fontSize:   '14px',
            fontWeight: 300,
            color:      'var(--bella-ink-soft)',
            margin:     0,
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', display: 'block' }}
      >
        {inner}
      </a>
    );
  }
  return inner;
}

// ─── Social icon links ────────────────────────────────────────────────────────

function SocialIconRow({ links }: { links: SocialLink[] }): React.ReactElement | null {
  const valid = links.filter((l) => isFilled(l.url) && isFilled(l.platform));
  if (valid.length === 0) return null;

  return (
    <nav
      aria-label="Social links"
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        flexWrap:       'wrap',
        gap:            '24px',
        marginTop:      '40px',
      }}
    >
      {valid.map((link, i) => {
        const key  = (link.platform ?? '').toLowerCase();
        const Icon = SOCIAL_ICONS[key];
        if (!Icon) return null;

        return (
          <SocialIconLink key={link.platform ?? i} link={link} Icon={Icon} />
        );
      })}
    </nav>
  );
}

function SocialIconLink({ link, Icon }: { link: SocialLink; Icon: IconComponent }): React.ReactElement {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={link.url!}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.platform}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        color:      hovered ? 'var(--accent)' : 'var(--bella-mid)',
        transition: 'color 0.2s ease, transform 0.2s ease',
        display:    'flex',
        transform:  hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      <Icon size={20} />
    </a>
  );
}

// ─── Contact section ──────────────────────────────────────────────────────────

export default function Contact({ data, socialLinks }: ContactProps): React.ReactElement {
  const email    = data?.email;
  const phone    = data?.phone;
  const location = data?.location;
  const whatsapp = data?.whatsapp;

  const reducedMotion = useReducedMotion() ?? false;

  const motionProps = reducedMotion
    ? {}
    : {
        initial:     { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0  },
        transition:  { duration: 0.6, ease: 'easeOut' as const },
        viewport:    { once: true },
      };

  const hasCards     = isFilled(phone) || isFilled(location) || isFilled(whatsapp);
  const validSocials = (socialLinks ?? []).filter((l) => isFilled(l.url) && isFilled(l.platform));

  return (
    <>
      <style>{`
        #contact {
          padding: 120px 48px;
        }

        #contact-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          max-width: 720px;
          margin: 0 auto 0;
        }

        @media (max-width: 767px) {
          #contact { padding: 80px 24px !important; }
          #contact-cards { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <motion.section
        id="contact"
        aria-label="Contact"
        style={{ textAlign: 'center', maxWidth: '960px', margin: '0 auto' }}
        {...motionProps}
      >
        <SectionLabel />

        {/* Availability note */}
        <p
          style={{
            fontFamily:    'var(--bella-font-mono)',
            fontSize:      '10px',
            fontWeight:    500,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color:         'var(--accent)',
            marginBottom:  '20px',
          }}
        >
          Currently available for select projects
        </p>

        {/* Email — Cormorant italic display */}
        {isFilled(email) && <EmailLink email={email!} />}

        {/* Contact cards — phone, WhatsApp, location */}
        {hasCards && (
          <div id="contact-cards">
            {isFilled(phone) && (
              <ContactCard Icon={FiPhone} label="Phone" value={phone!} href={`tel:${phone}`} />
            )}
            {isFilled(whatsapp) && (
              <ContactCard
                Icon={SiWhatsapp}
                label="WhatsApp"
                value={`+${whatsapp}`}
                href={`https://wa.me/${whatsapp}`}
              />
            )}
            {isFilled(location) && (
              <ContactCard Icon={FiMapPin} label="Location" value={location!} />
            )}
          </div>
        )}

        {/* Social icon links */}
        {validSocials.length > 0 && <SocialIconRow links={validSocials} />}
      </motion.section>
    </>
  );
}
