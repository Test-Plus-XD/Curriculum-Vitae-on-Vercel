'use client';

import { Printer } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Magnetic from './fx/Magnetic';
import Scramble from './fx/Scramble';

export default function PrintButton() {
  const t = useTranslations('controls');
  return (
    <Magnetic className="no-print">
      <button type="button" className="action-button" onClick={() => window.print()}>
        <Printer size={16} strokeWidth={1.75} aria-hidden="true" />
        <Scramble text={t('print')} delay={300} />
      </button>
    </Magnetic>
  );
}
