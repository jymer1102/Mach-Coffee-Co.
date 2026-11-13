// --- Generate engraved degree ticks on the static bezel ---
(function buildTicks() {
  const ticksGroup = document.getElementById('ticks');
  if (!ticksGroup) return;
  const cx = 220, cy = 220;
  const outerR = 190;
  for (let deg = 0; deg < 360; deg += 10) {
    const isMajor = deg % 30 === 0;
    const len = isMajor ? 16 : 9;
    const innerR = outerR - len;
    const rad = (deg - 90) * Math.PI / 180; // 0deg = up
    const x1 = cx + outerR * Math.cos(rad);
    const y1 = cy + outerR * Math.sin(rad);
    const x2 = cx + innerR * Math.cos(rad);
    const y2 = cy + innerR * Math.sin(rad);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1.toFixed(1));
    line.setAttribute('y1', y1.toFixed(1));
    line.setAttribute('x2', x2.toFixed(1));
    line.setAttribute('y2', y2.toFixed(1));
    line.setAttribute('opacity', isMajor ? '0.8' : '0.35');
    ticksGroup.appendChild(line);
  }
})();

// --- Live compass heading (device orientation), with ambient fallback ---
(function compassLogic() {
  const needle = document.getElementById('compassNeedle');
  const statusEl = document.getElementById('compassStatus');
  const statusText = document.getElementById('compassStatusText');
  const enableBtn = document.getElementById('compassEnableBtn');
  if (!needle || !statusEl) return;

  let liveActive = false;
  let currentRotation = 0; // cumulative rotation applied to the needle layer (can exceed +-360)
  let lastHeading = null;  // last raw heading value (0-360) we received

  function setHeading(heading) {
    // heading is raw compass degrees, 0-360, where the needle should point to "north"
    if (lastHeading === null) {
      // First reading: just snap to it directly, no delta to compute yet
      currentRotation = -heading;
    } else {
      // Find the shortest signed angular difference between the new and last heading,
      // so the needle never takes the "long way around" through 0/360.
      let delta = heading - lastHeading;
      delta = ((delta + 180) % 360 + 360) % 360 - 180; // normalize to [-180, 180]
      currentRotation += -delta;
    }
    lastHeading = heading;
    needle.style.transform = `rotate(${currentRotation.toFixed(1)}deg)`;
  }

  function goLive() {
    needle.classList.remove('ambient-spin');
    liveActive = true;
    statusEl.classList.add('live');
    if (enableBtn) enableBtn.style.display = 'none';
  }

  function handleOrientation(e) {
    let heading = null;
    if (typeof e.webkitCompassHeading === 'number') {
      // iOS Safari gives compass heading directly (already true/magnetic north relative)
      heading = e.webkitCompassHeading;
    } else if (typeof e.alpha === 'number') {
      // Other browsers: alpha is rotation around z-axis; absolute orientation events are closer to compass heading
      heading = 360 - e.alpha;
    }
    if (heading === null || isNaN(heading)) return;
    heading = ((heading % 360) + 360) % 360; // normalize to [0, 360)
    if (!liveActive) goLive();
    statusText.textContent = 'Live heading: ' + Math.round(heading) + '\u00B0';
    setHeading(heading);
  }

  function startListening() {
    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);
    // If nothing fires within a couple seconds, stay in ambient mode quietly
    setTimeout(() => {
      if (!liveActive) {
        statusText.textContent = 'Ambient mode \u2014 live heading unavailable on this device';
        if (enableBtn) enableBtn.style.display = 'none';
      }
    }, 2500);
  }

  function requestPermissionAndStart() {
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS 13+ requires explicit user-gesture permission
      DeviceOrientationEvent.requestPermission()
        .then(result => {
          if (result === 'granted') {
            startListening();
          } else {
            statusText.textContent = 'Permission denied \u2014 ambient mode';
            if (enableBtn) enableBtn.style.display = 'none';
          }
        })
        .catch(() => {
          statusText.textContent = 'Ambient mode \u2014 tap not supported here';
          if (enableBtn) enableBtn.style.display = 'none';
        });
    } else if (window.DeviceOrientationEvent) {
      // Android / other browsers: no explicit permission step needed
      startListening();
    } else {
      statusText.textContent = 'Ambient mode \u2014 this device has no compass sensor';
      if (enableBtn) enableBtn.style.display = 'none';
    }
  }

  if (enableBtn) {
    enableBtn.addEventListener('click', requestPermissionAndStart);
  }

  // On Android, sensor data can flow without a permission prompt, so try silently too.
  // (No-op on iOS Safari until the user taps Enable, by design of the platform.)
  if (window.DeviceOrientationEvent &&
      typeof DeviceOrientationEvent.requestPermission !== 'function') {
    startListening();
  }
})();
