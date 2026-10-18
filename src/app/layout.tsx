import type { ReactNode } from 'react';

// The <html> and <body> elements live in app/[locale]/layout.tsx so the document language can follow the
// route. This root layout only passes children through, as next-intl recommends.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
