'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import GlitchText from './GlitchText';

const navVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, y: -8, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const controlVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export default function Header() {
  const t      = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();

  const navItems = [
    { key: 'cv', href: `/${locale}`, label: t('cv') },
    { key: 'education', href: `/${locale}/education`, label: t('education') },
    { key: 'projects', href: `/${locale}/projects`, label: t('projects') },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 relative bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-soviet-red/40">
      {/* Soviet propaganda banner — visible in both modes (subtler in light) */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-soviet-red to-transparent opacity-30 dark:opacity-100" />
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <motion.nav
          className="flex items-center gap-4 sm:gap-6"
          variants={navVariants}
          initial="hidden"
          animate="visible"
        >
          {navItems.map((item) => (
            <motion.div key={item.key} variants={navItemVariants}>
              <Link
                href={item.href}
                className={`relative text-sm font-medium font-title italic transition-colors soviet-link ${
                  isActive(item.href)
                    ? 'text-soviet-red dark:text-soviet-orange'
                    : 'text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-soviet-orange'
                }`}
              >
                <GlitchText
                  text={item.label}
                  glitchOnHover
                  glitchOnMount={false}
                  speed={25}
                />
                {/* Active indicator — electromagnetic pulse dot */}
                {isActive(item.href) && (
                  <motion.span
                    className="absolute -bottom-1.5 left-1/2 w-1 h-1 rounded-full bg-soviet-orange"
                    layoutId="nav-active"
                    style={{ translateX: '-50%' }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </motion.nav>

        <motion.div
          className="flex items-center gap-3"
          variants={navVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={controlVariants}>
            <LanguageToggle />
          </motion.div>
          <motion.div variants={controlVariants}>
            <ThemeToggle />
          </motion.div>
        </motion.div>
      </div>

      {/* Soviet accent line — visible in both modes (double-line effect) */}
      <div className="absolute bottom-0 left-0 right-0 h-px soviet-line-animated opacity-20 dark:opacity-60" />
      <div className="absolute bottom-[-2px] left-0 right-0 h-px soviet-line opacity-10 dark:opacity-30" />
    </header>
  );
}
