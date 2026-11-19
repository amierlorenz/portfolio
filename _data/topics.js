// Post topics: the dot colour, the hover ring (dot colour, see-through) and a deeper text shade that
// stays readable on white. Must match the `topic` options in .pages.yml. A topic missing here shows grey.
const topics = {
  AI: { color: "#4cc6ce", ring: "rgba(76,198,206,.35)", text: "#1f98a1" },
  Swift: { color: "#ff7e59", ring: "rgba(255,126,89,.35)", text: "#e0603a" },
  Teaching: { color: "#ffd55b", ring: "rgba(255,213,91,.35)", text: "#b98900" },
  Career: { color: "#222222", ring: "rgba(34,34,34,.35)", text: "#222222" },
  "Open source": { color: "#bbbbbb", ring: "rgba(187,187,187,.35)", text: "#7a7a7a" },
};

export const fallback = { color: "#bbbbbb", ring: "rgba(187,187,187,.35)", text: "#7a7a7a" };
export default topics;
