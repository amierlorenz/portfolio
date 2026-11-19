// Featured Projects (the homepage's case files). Hand-edited on purpose: a new featured project is a
// deliberate choice, not something a post should trigger.
//   id:     used in the page anchor (#proj-<id>); a timeline item's `featured` field must match it
//   repo:   GitHub URL; a published post with type "Build log" and the same repo adds a Build log button
//   shape:  "phone" | "window", used until the project has media (then media.json's shape wins)
// Media (screens + clip) lives in media/projects/<repo name>/ as described in MEDIA.md. Until it exists,
// the cards show a placeholder in the right shape.
import fs from "node:fs";

const projects = [
  {
    id: "mieracle-study", name: "Mieracle Study", kind: "iPhone + Mac App", status: "In progress", color: "#ffd55b",
    repo: "https://github.com/amierlorenz/mieracle-study", shape: "phone",
    stack: ["Swift", "SwiftUI", "SM-2 scheduling", "On-device AI"],
    blurb: "Spaced repetition with on-device AI grading and live exam dates from the Canvas LMS API.",
  },
  {
    id: "not-lang", name: "Not Lang", kind: "iOS App", status: "Completed", color: "#4cc6ce",
    repo: "https://github.com/amierlorenz/not-lang", shape: "phone",
    stack: ["Swift", "Gemini API", "Supabase", "SwiftData"],
    blurb: "Learn French slang in context with a content pipeline built on Gemini, Supabase and SwiftData.",
  },
  {
    id: "galea-digital", name: "Galea Digital", kind: "AI Fitness Platform · Team", status: "Completed", color: "#ff7e59",
    repo: "https://github.com/CodePath-Tech-Exchange-CTEx/ise-genai-galea-digital", shape: "window",
    stack: ["Python", "Gemini API", "Streamlit", "pytest + CI"],
    blurb: "Gemini-powered fitness app; set up CI/CD gated on pytest and shipped fixes from usability tests.",
  },
];

// Attach each project's media, if it has any: { shape, lead: { video, poster, alt }, stills: [{ src, alt }] }
function mediaFor(project) {
  const dir = `media/projects/${new URL(project.repo).pathname.split("/").filter(Boolean).pop()}`;
  if (!fs.existsSync(`${dir}/media.json`)) return null;
  const { shape, alt = {} } = JSON.parse(fs.readFileSync(`${dir}/media.json`, "utf8"));
  const file = (name) => (fs.existsSync(`${dir}/${name}`) ? `/${dir}/${name}` : null);
  return {
    shape,
    lead: { video: file("lead.mp4"), poster: file("lead.webp"), alt: alt.lead || `${project.name} in use` },
    stills: ["still-1", "still-2"].map((s) => ({ src: file(`${s}.webp`), alt: alt[s] || `${project.name} screen` })),
  };
}

export default () => projects.map((project) => {
  const media = mediaFor(project);
  return { ...project, media, shape: media?.shape || project.shape };
});
