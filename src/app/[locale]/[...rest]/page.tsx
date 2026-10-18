import { notFound } from 'next/navigation';

// Any unknown path under a locale renders the localised not-found page inside the site layout.
export default function CatchAll() {
  notFound();
}
