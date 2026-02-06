'use client';

import { useState } from 'react';
import { Play, X } from 'lucide-react';

interface Props {
  embedUrl: string;
  title: string;
  videoId: string;
}

/**
 * InlineVideo — displays YouTube thumbnail, opens fullscreen iframe embed on click
 * Fixes thumbnail loading issues by using direct img tag with YouTube CDN
 */
export default function InlineVideo({ embedUrl, title, videoId }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <>
      {/* Thumbnail Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="group relative aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-soviet-orange transition-all"
        aria-label={`Play ${title}`}
      >
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-red-600 group-hover:bg-red-500 transition-colors flex items-center justify-center">
            <Play size={24} className="text-white ml-1" fill="white" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          YouTube
        </div>
      </button>

      {/* Fullscreen Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-soviet-orange transition-colors"
            aria-label="Close video"
          >
            <X size={32} />
          </button>
          <div
            className="w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`${embedUrl}?autoplay=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}
