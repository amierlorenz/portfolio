# Project media: how screenshots and clips are captured

DRAFT from the prototype branch. Rules for whoever (me or an agent) sources images for the Featured Projects
section. The layout only works if every capture follows them.

## Shapes: only two

| Shape | Size (px) | Used for |
|---|---|---|
| **phone** | 1179 × 2556 (iPhone 15/16 Pro, portrait) | iOS apps |
| **window** | 2560 × 1600 (16:10) | Mac, web and terminal projects |

Never crop a capture into another shape. The page picks the frame from the shape; a capture that doesn't fit gets re-taken.

## Per project

- **1 clip** (the lead): one action, 3 to 6 seconds, loops cleanly (end where it started).
- **2 stills** (the cards behind it): the two screens that best explain the app.
- Web and terminal projects use the window shape for all three; phone apps use phone for all three.

## Capture rules

- Same simulator every time: iPhone 16 Pro, light mode, default text size.
- Clean status bar: `xcrun simctl status_bar booted override --time 9:41 --batteryState charged --batteryLevel 100 --cellularBars 4`
- Realistic sample data, never real personal data (no real names, emails or journal pages).
- No keyboard on screen unless typing is the point. No debug overlays.
- Mac/web: hide the bookmarks bar and extensions, window exactly 1280 × 800 points, no desktop showing.
- Use the `capturing-xcode-app-screenshots` skill for simulator and Mac captures.

## Recording clips

- iOS: `xcrun simctl io booted recordVideo --codec h264 clip.mov`
- Export as a silent, looping **MP4** (H.264, ~30 fps, ≤ 1.5 MB) plus a **poster** still of its first frame.
  The page plays it as `<video autoplay muted loop playsinline poster=…>`, which looks like a GIF at a fraction of the size.
- Respect reduced motion: the page shows the poster instead of playing.

## Files

```
media/projects/<repo-name>/
  lead.mp4        the clip
  lead.webp       its poster (first frame)
  still-1.webp    card behind, left
  still-2.webp    card behind, right
  media.json      { "shape": "phone" | "window", "alt": { "lead": "...", "still-1": "...", "still-2": "..." } }
```

- Stills: WebP, quality ~80, longest side ≤ 1600 px.
- Every file gets alt text in `media.json` describing what the screen shows, not "screenshot of app".

## Done when

- [ ] Three files plus `media.json` per featured project
- [ ] All three share one shape
- [ ] Clip loops without a visible jump
- [ ] Nothing personal on screen
