// Entry point: loaded by index.html as <script type="module">, one import per feature.
// No build step: browsers load these modules natively (serve the folder over http, not file://).
//
// Cache-busting: every local CSS/JS URL carries the same ?v=<date> (index.html, the imports here and
// in js/timeline.js), so phones fetch fresh files after a deploy. Bump them all together, e.g.:
//   grep -rl '?v=20261109' index.html js | xargs sed -i '' 's/?v=20261109/?v=20261201/g'
// Every import of a module must use the same version, or the browser loads it twice.
import { setupAnchors } from './anchors.js?v=20261109';
import { setupMobileMenu } from './mobile-menu.js?v=20261109';
import { setupReveal } from './reveal.js?v=20261109';
import { setupPillars, setupQuotes } from './card-grids.js?v=20261109';
import { setupEmailPill } from './contact.js?v=20261109';
import { setupWorkRail } from './work-rail.js?v=20261109';
import { setupHeroFloat } from './hero.js?v=20261109';
import { setupTimeline } from './timeline.js?v=20261109';

setupAnchors();

document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupReveal();
    setupPillars();
    setupQuotes();
    setupEmailPill();
    setupWorkRail();
    setupHeroFloat();
    setupTimeline();
});
