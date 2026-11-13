(function animateFavicon() {
  const FRAME_COUNT = 48;
  // Base URL of the favicon frames, passed in from the layout via data-frame-base
  const FRAME_BASE = document.currentScript.dataset.frameBase;
  const FRAME_INTERVAL_MS = 45; // ~2.1s per full rotation

  const frameUrls = [];
  for (let i = 0; i < FRAME_COUNT; i++) {
    frameUrls.push(`${FRAME_BASE}frame_${String(i).padStart(2, '0')}.png`);
  }
  // Preload frames so swapping is instant, no flicker
  frameUrls.forEach(src => { const img = new Image(); img.src = src; });

  let frameIndex = 0;

  function setFavicon(href) {
    // Recreate the <link> element each frame rather than mutating href.
    // Some browsers defer/batch repaints when only the attribute changes
    // while the tab is focused; swapping the element forces an immediate repaint.
    const old = document.getElementById('favicon');
    const link = document.createElement('link');
    link.id = 'favicon';
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = href;
    if (old) {
      old.parentNode.replaceChild(link, old);
    } else {
      document.head.appendChild(link);
    }
  }

  setInterval(() => {
    frameIndex = (frameIndex + 1) % FRAME_COUNT;
    setFavicon(frameUrls[frameIndex]);
  }, FRAME_INTERVAL_MS);
})();
