import { getTranslations } from 'next-intl/server';
import { Github, Linkedin, Mail, MessageCircle, Phone, Youtube } from 'lucide-react';
import { CONTACTS, SITE, type ContactKind } from '@/lib/profile';
import MorseCodeTicker from './fx/MorseCodeTicker';
import DadaTypography from './fx/DadaTypography';

const ICONS: Record<ContactKind, typeof Mail> = {
  email: Mail,
  phone: Phone,
  github: Github,
  linkedin: Linkedin,
  youtube: Youtube,
  discord: MessageCircle,
};

export default async function Footer() {
  const t = await getTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer no-print">
      <MorseCodeTicker messages={['NG YU HAM BALDWIN', 'SOFTWARE DEVELOPER', 'HONG KONG']} />
      <div className="footer-inner">
        <div className="footer-sign">
          <DadaTypography as="p" text="NG Yu Ham Baldwin" className="footer-name font-title" intensity={1} scatterOnView />
          <p className="footer-zh" lang="zh-HK">
            吳宇涵
          </p>
        </div>
        <div className="footer-contact">
          <h2 className="eyebrow">{t('contact')}</h2>
          <ul>
            {CONTACTS.map((c) => {
              const Icon = ICONS[c.kind];
              const external = c.href.startsWith('http');
              return (
                <li key={c.kind}>
                  <a
                    href={c.href}
                    className="footer-link"
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                    <span>{c.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="footer-base">
        <span>© {year} NG Yu Ham Baldwin</span>
        <span>{t('built')}</span>
        <a href={SITE.source} target="_blank" rel="noopener noreferrer" className="soviet-link">
          {t('source')}
        </a>
      </div>
      <MorseCodeTicker messages={['KOCMOC', 'VOSTOK', 'SPUTNIK', 'MIR']} reverse />
    </footer>
  );
}
