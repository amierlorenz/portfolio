// Entry point: loaded by index.html as <script type="module">, one import per feature.
// No build step: browsers load these modules natively (serve the folder over http, not file://).
//
// Cache-busting: every local CSS/JS URL carries the same ?v=<date> (_data/site.js for the pages, the imports here and
// in js/timeline.js and js/timeline-graph.js), so phones fetch fresh files after a deploy. Bump them all together, e.g.:
//   grep -rl 20261119a _data js | xargs sed -i '' 's/20261119a/20261201a/g'
// Every import of a module must use the same version, or the browser loads it twice.
import { setupAnchors } from './anchors.js?v=20261119a';
import { setupMobileMenu } from './mobile-menu.js?v=20261119a';
import { setupReveal } from './reveal.js?v=20261119a';
import { setupQuotes } from './card-grids.js?v=20261119a';
import { setupEmailPill } from './contact.js?v=20261119a';
import { setupProjects } from './projects.js?v=20261119a';
import { setupHeroFloat } from './hero.js?v=20261119a';
import { setupDock } from './dock.js?v=20261119a';
import { setupTimeline } from './timeline.js?v=20261119a';
import { setupTimelineGraph } from './timeline-graph.js?v=20261119a';

setupAnchors();

document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupReveal();
    setupQuotes();
    setupEmailPill();
    setupProjects();
    setupHeroFloat();
    setupDock();
    setupTimeline();
    setupTimelineGraph(); // draws over the timeline setupTimeline() just built
});
