'use client';

import { Printer } from 'lucide-react';
import { useLocale } from 'next-intl';

/**
 * PrintButton — Soviet-styled button to trigger browser print dialog.
 * Hidden on print output itself.
 */
export default function PrintButton() {
  const locale = useLocale();

  return (
    <button
      onClick={() => window.print()}
      className="print:hidden soviet-print-btn soviet-holo-scan font-mono"
      aria-label={locale === 'zh-hk' ? '列印履歷' : 'Print CV'}
    >
      <Printer size={14} />
      {locale === 'zh-hk' ? '列印履歷' : 'Print CV'}
    </button>
  );
}
