import { Fragment } from 'react';

/**
 * Headline text with every hyphenated compound ("E-Commerce", "Steam-like") kept on one line, so a balanced
 * headline never breaks after a hyphen. Spaces still break as usual; text without hyphens is returned as is.
 */
export default function KeepCompounds({ text }: { text: string }) {
  if (!text.includes('-')) return <>{text}</>;
  return (
    <>
      {text.split(/(\s+)/).map((part, i) =>
        part.includes('-') ? (
          <span key={i} className="nobr">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
