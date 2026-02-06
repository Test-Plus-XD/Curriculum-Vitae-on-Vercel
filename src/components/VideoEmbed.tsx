'use client';

import { useState } from 'react';
import { Play, X, ExternalLink } from 'lucide-react';

interface Props {
  embedUrl : string;
  url      : string;
  title    : string;
}

export default function VideoEmbed({ embedUrl, url, title }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="print:hidden inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900 rounded-full transition-colors"
      >
        <Play size={11} />
        {title}
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate mr-2">
                {title}
              </span>
              <div className="flex items-center gap-1 flex-shrink-0">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <ExternalLink size={15} />
                </a>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Embed */}
            <div className="aspect-video">
              <iframe
                src={embedUrl}
                title={title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
