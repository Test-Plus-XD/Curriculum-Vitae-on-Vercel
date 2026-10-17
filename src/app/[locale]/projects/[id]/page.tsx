import { notFound } from 'next/navigation';
import { PROJECT_IDS } from '@/lib/projects';

export function generateStaticParams() {
  return PROJECT_IDS.map((id) => ({ id }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  if (!PROJECT_IDS.includes(id)) notFound();

  return (
    <main>
      <h1>Project: {id}</h1>
    </main>
  );
}
