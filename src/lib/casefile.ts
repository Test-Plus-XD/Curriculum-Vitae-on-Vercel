import type { Bilingual } from './i18n-text';
import type { Highlight } from './projects';

/// A case file is the evidence behind one project page. It lives apart from `projects.ts`, which stays the
/// short record used by the gazette and the CV sheet. Every figure here comes from the repository's own history:
/// nothing is estimated, and private repositories contribute prose and counts only, never source or links.

// One engineering story, told as a problem met, a decision taken and the result it had.
export interface Dispatch {
  title: Bilingual;
  problem: Bilingual;
  decision: Bilingual;
  result: Bilingual;
}

// One stage in how the system works; `link` labels the hand-over to the next stage.
export interface FlowStep {
  name: Bilingual;
  note: Bilingual;
  link?: Bilingual;
}

// A picture from the project, stored locally under `public/images/projects/<id>/`.
export interface Exhibit {
  src: string;
  width: number;
  height: number;
  alt: Bilingual;
  caption: Bilingual;
}

// A verbatim source excerpt from a public repository; `url` is a commit permalink so it cannot drift.
export interface Excerpt {
  title: Bilingual;
  path: string;
  language: string;
  url: string;
  code: string;
  note: Bilingual;
}

// The full evidence for a project page. Only `role` and `dispatches` are required.
export interface CaseFile {
  role: Bilingual;
  facts?: Highlight[];
  contributions?: Bilingual[];
  flow?: FlowStep[];
  dispatches: Dispatch[];
  exhibits?: Exhibit[];
  excerpts?: Excerpt[];
}
