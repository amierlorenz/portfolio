// Entry point: loaded by index.html as <script type="module">, one import per feature.
// No build step: browsers load these modules natively (serve the folder over http, not file://).
//
// Cache-busting: every local CSS/JS URL carries the same ?v=<date> (index.html, the imports here and
// in js/timeline.js and js/timeline-graph.js), so phones fetch fresh files after a deploy. Bump them all together, e.g.:
//   grep -rl '?v=20261110c' index.html js | xargs sed -i '' 's/?v=20261110c/?v=20261201/g'
// Every import of a module must use the same version, or the browser loads it twice.
import { setupAnchors } from './anchors.js?v=20261110c';
import { setupMobileMenu } from './mobile-menu.js?v=20261110c';
import { setupReveal } from './reveal.js?v=20261110c';
import { setupQuotes } from './card-grids.js?v=20261110c';
import { setupEmailPill } from './contact.js?v=20261110c';
import { setupWorkRail } from './work-rail.js?v=20261110c';
import { setupHeroFloat } from './hero.js?v=20261110c';
import { setupTimeline } from './timeline.js?v=20261110c';
import { setupTimelineGraph } from './timeline-graph.js?v=20261110c';

setupAnchors();

document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupReveal();
    setupQuotes();
    setupEmailPill();
    setupWorkRail();
    setupHeroFloat();
    setupTimeline();
    setupTimelineGraph(); // draws over the timeline setupTimeline() just built
});
