'use client';

import { useTranslations } from 'next-intl';
import { Mail, Phone, Github, Linkedin, Youtube, Code } from 'lucide-react';
import { motion } from 'framer-motion';

/* ── Bootstrap Discord icon (bi-discord) ─────────────────────────────── */
function DiscordIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      viewBox="0 0 16 16"
    >
      <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
    </svg>
  );
}

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
  { key: 'discord',  icon: DiscordIcon,    href: 'https://discord.com/users/589711219162873857',                                          display: 'test_plus' },
  { key: 'source',   icon: Code,          href: 'https://github.com/Test-Plus-XD/Curriculum-Vitae-on-Vercel',                          display: null },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
  },
};

/* --------------------------------------------------------------- component */
export default function Footer() {
  const t    = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-slate-200 dark:border-soviet-red/40 mt-16 print:mt-8">
      {/* Soviet accent line at the very top — visible in both modes */}
      <div className="absolute top-0 left-0 right-0 h-px soviet-line opacity-15 dark:opacity-40" />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-4 font-title italic dark:text-soviet-beige/70">
          {t('contact')}
        </h3>

        <motion.div
          className="flex flex-wrap gap-x-6 gap-y-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {contacts.map((c) => {
            const Icon  = c.icon;
            const label = c.key === 'source' ? t('sourceCode') : c.display;

            return (
              <motion.a
                key={c.key}
                href={c.href!}
                target={c.key !== 'email' && c.key !== 'phone' ? '_blank' : undefined}
                rel={c.key !== 'email' && c.key !== 'phone' ? 'noopener noreferrer' : undefined}
                className="group flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-soviet-orange transition-all duration-200 soviet-link"
                variants={itemVariants}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative">
                  <Icon size={16} className="text-slate-500 dark:text-slate-400 group-hover:text-soviet-orange dark:group-hover:text-soviet-gold transition-colors duration-200" />
                  {/* Neon glow behind icon on hover */}
                  <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm bg-soviet-orange/20 dark:bg-soviet-orange/30 scale-150" />
                </span>
                <span>{c.key === 'discord' ? `Discord: ${c.display}` : label}</span>
              </motion.a>
            );
          })}
        </motion.div>

        <motion.p
          className="mt-6 text-xs text-slate-500 dark:text-slate-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {t('copyright', { year })}
        </motion.p>
      </div>
    </footer>
  );
}
