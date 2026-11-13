// --- Transmission form: submit via fetch, no full-page reload ---
(function transmissionForm() {
  const form = document.getElementById('transmissionForm');
  const btn = document.getElementById('transmitBtn');
  const statusEl = document.getElementById('formStatus');
  if (!form || !btn || !statusEl) return;

  const label = btn.querySelector('.btn-label');
  const originalLabel = label ? label.textContent : 'Transmit Message';

  if (!btn.querySelector('.btn-spinner')) {
    const spinner = document.createElement('span');
    spinner.className = 'btn-spinner';
    btn.appendChild(spinner);
  }

  function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = 'form-status visible' + (type ? ' ' + type : '');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btn.disabled = true;
    btn.classList.add('is-loading');
    if (label) label.textContent = 'Transmitting…';
    setStatus('', '');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        setStatus('Transmission received — we\u2019ll be in touch soon.', 'success');
        form.reset();
      } else {
        setStatus('Transmission failed to send. Please try again or email us directly.', 'error');
      }
    } catch (err) {
      setStatus('Transmission failed to send. Please check your connection and try again.', 'error');
    } finally {
      btn.disabled = false;
      btn.classList.remove('is-loading');
      if (label) label.textContent = originalLabel;
    }
  });
})();
