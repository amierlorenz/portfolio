// Site-wide values every template can read as {{ site.* }}.
export default {
  url: "https://amierlorenz.com",
  name: "Amier Lorenz Davis",
  // Cache-busting version on every local CSS/JS URL (?v=). The JS imports carry it too, so bump them all
  // together (see js/main.js):  grep -rl 20261119a _data js | xargs sed -i '' 's/20261119a/<new>/g'
  v: "20261119a",
  medium: "https://medium.com/@amierlorenz",
};
