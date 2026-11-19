// Entry point for blog pages (/blog/ and posts), loaded by _includes/layouts/blog-base.njk.
// The homepage's js/main.js isn't loaded here: no hero, timeline or dock to set up.
// Same ?v= as everywhere else (see js/main.js).
import { setupMobileMenu } from './mobile-menu.js?v=20261119a';
import { setupTopicFilter } from './topic-filter.js?v=20261119a';
import { setupPostPage } from './post-page.js?v=20261119a';

setupMobileMenu();
setupTopicFilter();
setupPostPage();
