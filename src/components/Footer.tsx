'use client';

import { useTranslations } from 'next-intl';
import { Mail, Phone, Github, Linkedin, Youtube, MessageCircle, Code } from 'lucide-react';

/* ------------------------------------------------------------------ types */
interface ContactEntry {
  key    : string;
  icon   : React.ComponentType<{ size?: number; className?: string }>;
  href   : string | null;
  display: string | null;
}

/* -------------------------------------------------------------- raw data  */
const contacts: ContactEntry[] = [
  { key: 'email',    icon: Mail,          href: 'mailto:baldwon0xd@gmail.com',                                                       display: 'baldwon0xd@gmail.com' },
  { key: 'phone',    icon: Phone,         href: 'tel:+85267016557',                                                                   display: '+852 67016557' },
  { key: 'github',   icon: Github,        href: 'https://github.com/Test-Plus-XD',                                                     display: 'GitHub' },
  { key: 'linkedin', icon: Linkedin,      href: 'https://www.linkedin.com/in/test-plus-004601285/',                                    display: 'LinkedIn' },
  { key: 'youtube',  icon: Youtube,       href: 'https://youtube.com/playlist?list=PLkzUf67y42SM-JlZk4eJEDIYPdb7VKbVo',              display: 'YouTube' },
  { key: 'discord',  icon: MessageCircle, href: null,                                                                                  display: 'test_plus' },
  { key: 'source',   icon: Code,          href: 'https://github.com/Test-Plus-XD/Curriculum-Vitae-on-Vercel',                          display: null },
];

/* --------------------------------------------------------------- component */
export default function Footer() {
  const t    = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-slate-200 dark:border-cyan-900/40 mt-16 print:mt-8">
      {/* neon accent line at the very top — dark mode */}
      <div className="absolute top-0 left-0 right-0 h-px neon-line opacity-0 dark:opacity-30" />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          {t('contact')}
        </h3>

        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {contacts.map((c) => {
            const Icon  = c.icon;
            const label = c.key === 'source' ? t('sourceCode') : c.display;

            /* Discord — no link, just text */
            if (c.key === 'discord') {
              return (
                <span key={c.key} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <Icon size={15} className="text-slate-400 dark:text-slate-500" />
                  Discord: {c.display}
                </span>
              );
            }

            return (
              <a
                key={c.key}
                href={c.href!}
                target={c.key !== 'email' && c.key !== 'phone' ? '_blank' : undefined}
                rel={c.key !== 'email' && c.key !== 'phone' ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
              >
                <Icon size={15} className="text-slate-400 dark:text-slate-500" />
                <span>{label}</span>
              </a>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-slate-400 dark:text-slate-500">
          {t('copyright', { year })}
        </p>
      </div>
    </footer>
  );
}
