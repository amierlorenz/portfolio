// ============ Timeline entries ("What I've done") ============
// One object per entry; js/timeline.js sorts, groups and filters them, so order here doesn't matter.
//   start / end: 'YYYY-MM'; end: 'now' = ongoing; no end = a single month
//   type: 'project' | 'learning' | 'teaching' | 'work' (work = paid roles only); colors and verbs live in js/timeline.js
//   tbd: true = month unknown; shown as the year only
//   title must be unique: it keys the filter animation
// Sources: resume (AmierDavis_Resume_103026.pdf) and public GitHub repos (repo-only items use the
// repo's creation month).
export const ITEMS = [
    { start: '2024-08', end: 'now', type: 'learning', title: 'Hampton University', org: 'B.S. Computer Science (AI/ML)', text: "Class of '28 · 3.9 GPA · Dean's List · Full-ride scholarship." },
    { start: '2025-05', end: '2025-08', type: 'work', title: 'Google', org: 'Associate Software Developer Intern', text: 'Built two AI-powered user journeys for Android XR glasses photography, in Kotlin/Compose and Java.' },
    { start: '2025-10', end: '2026-05', type: 'learning', title: 'Amazon Guides', org: 'Mentee', text: 'Selective career mentorship program with a SWE at Amazon.' },
    { start: '2025-11', type: 'learning', title: '100 Days of SwiftUI', org: 'Online Course', text: "Working through Paul Hudson's SwiftUI course." },
    { start: '2026-01', end: '2026-04', type: 'learning', title: 'CodePath Tech Exchange', org: 'Selective Exchange Program', text: 'DSA and system design with GenAI, intro to software engineering with GenAI, career development.' },
    { start: '2026-01', end: '2026-04', type: 'project', title: 'Galea Digital', org: 'AI Fitness Platform · Team', text: 'Gemini-powered fitness app; set up CI/CD gated on pytest and shipped fixes from usability tests.' },
    { start: '2026-01', type: 'project', title: 'Not Lang', org: 'iOS App', text: 'Learn French slang in context with a content pipeline built on Gemini, Supabase and SwiftData.' },
    { start: '2026-03', type: 'project', title: 'Hackathon, 1st place', org: 'ADMI AI Conference', text: 'First place at the ADMI AI Conference 2026 hackathon.' },
    { start: '2026-02', end: 'now', type: 'project', title: 'Archive Buddy', org: 'iOS App', text: 'On-device handwriting OCR and RAG over handwritten physical journals.' },
    { start: '2026-09', end: 'now', type: 'work', title: 'Google REACH: SafeGenAI', org: 'Research Assistant', text: 'Researching how to teach non-technical audiences to use GenAI safely and responsibly.' },
    { start: '2026-09', end: 'now', type: 'learning', title: 'CodePath AI301', org: 'Open Source Contributions with GenAI', text: 'Making contributions to open source and building Claude Code skills to support them.' },
    { start: '2026-09', end: 'now', type: 'project', title: 'Mieracle Study', org: 'iPhone + Mac App', text: 'Spaced repetition with on-device AI grading and live exam dates from the Canvas LMS API.' },
    { start: '2026-10', end: 'now', type: 'teaching', title: 'HU Swift Academy', org: 'Swift Outreach Scholar', text: 'Teaching Swift to K-12 students, teachers, and community groups.' },
    { start: '2026-10', end: 'now', type: 'project', title: 'Claude Code plugins & skills', org: 'Open Source', text: 'A plugin marketplace including skills and plugins to foster healthy AI use in development.' },
];
