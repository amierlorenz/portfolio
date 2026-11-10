// ============ Timeline entries ("What I've done") ============
// One object per entry; js/timeline.js sorts, groups and filters them, so order here doesn't matter.
//   start / end: 'YYYY-MM'; end: 'now' = ongoing; no end = a single month
//   type: 'project' | 'learning' | 'teaching' | 'work' (work = paid roles only); colors and verbs live in js/timeline.js
//   tbd: true = month unknown; shown as the year only
//   title must be unique: it keys the filter animation
// Sources: resume (AmierDavis_Resume_103026.pdf) and public GitHub repos (repo-only items use the
// repo's creation month).
export const ITEMS = [
    { start: '2024-08', end: 'now', type: 'learning', title: 'Hampton University', org: 'B.S. Computer Science (AI/ML)', text: "Class of '28 · 3.9 GPA · Dean's List · full-ride scholarship." },
    { start: '2025-05', end: '2025-08', type: 'work', title: 'Google', org: 'Associate Software Developer Intern', text: 'Two AI-powered user journeys for Android XR glasses photography, in Kotlin/Compose and Java.' },
    { start: '2025-10', end: '2026-05', type: 'learning', title: 'Amazon Guides', org: 'Mentee', text: 'Career mentorship program.' },
    { start: '2025-11', type: 'learning', title: '100 Days of SwiftUI', org: 'Hacking with Swift', text: "Working through Paul Hudson's SwiftUI course." },
    { start: '2026-01', end: '2026-04', type: 'learning', title: 'CodePath Tech Exchange', org: 'Selective program', text: 'DSA and system design with GenAI, intro to software engineering with GenAI.' },
    { start: '2026-01', end: '2026-04', type: 'project', title: 'Galea Digital', org: 'AI fitness platform · team', text: 'Gemini-powered fitness app; set up CI/CD gated on pytest and shipped fixes from usability tests.' },
    { start: '2026-01', type: 'project', title: 'Not Lang', org: 'iOS app', text: 'AI language lessons with Gemini, Supabase and SwiftData.' },
    { start: '2026-01', type: 'project', title: 'Hackathon, 1st place', org: 'ADMI AI Conference', text: 'First place at the ADMI AI Conference 2026 hackathon.', tbd: true },
    { start: '2026-02', end: 'now', type: 'project', title: 'Archive Buddy', org: 'iOS app', text: 'On-device handwriting OCR and RAG over your paper journals.' },
    { start: '2026-09', end: 'now', type: 'work', title: 'Google REACH: SafeGenAI', org: 'Research Assistant', text: 'GenAI security research and teaching non-technical audiences to use AI safely.' },
    { start: '2026-09', end: 'now', type: 'learning', title: 'CodePath AI301', org: 'Open source with AI', text: 'Building Claude Code skills for a real open-source contribution.' },
    { start: '2026-09', end: 'now', type: 'project', title: 'Mieracle Study', org: 'iPhone + Mac app', text: 'Spaced repetition with on-device AI grading and Canvas exam dates.' },
    { start: '2026-10', end: 'now', type: 'teaching', title: 'HU Swift Academy', org: 'Swift Outreach Scholar', text: 'Teaching Swift to K-12 students, teachers and community groups.' },
    { start: '2026-10', end: 'now', type: 'project', title: 'Claude Code plugins & skills', org: 'Open source', text: 'A plugin marketplace incl. own-it, git-workflow and training-wheels.' },
    { start: '2026-10', type: 'project', title: 'Master To-Do', org: 'iPhone + Mac app', text: 'Your tasks and open Canvas assignments in one iCloud list.' },
];
