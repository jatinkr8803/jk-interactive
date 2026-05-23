// contact.js - handles premium contact form submission

(function () {

  // =========================
  // Backend URL Detection
  // =========================
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  const BACKEND = isLocalhost
    ? "http://127.0.0.1:5000"
    : "https://jk-interactive.onrender.com";

  // =========================
  // Spinner
  // =========================
  function showSpinner() {

    if (document.getElementById('contact-spinner')) return;

    const overlay = document.createElement('div');

    overlay.id = 'contact-spinner';

    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.background = 'rgba(0,0,0,0.45)';
    overlay.style.backdropFilter = 'blur(10px)';
    overlay.style.zIndex = '99998';

    overlay.innerHTML = `
      <div style="
        width:70px;
        height:70px;
        border-radius:20px;
        background:rgba(255,255,255,0.12);
        backdrop-filter:blur(20px);
        display:flex;
        align-items:center;
        justify-content:center;
        border:1px solid rgba(255,255,255,0.15);
      ">
        <div style="
          width:34px;
          height:34px;
          border:4px solid rgba(255,255,255,0.2);
          border-top-color:#fff;
          border-radius:50%;
          animation:spin 1s linear infinite;
        "></div>
      </div>
    `;

    document.body.appendChild(overlay);

    if (!document.getElementById('spinner-style')) {
      const style = document.createElement('style');

      style.id = 'spinner-style';

      style.innerHTML = `
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `;

      document.head.appendChild(style);
    }
  }

  function hideSpinner() {

    const overlay = document.getElementById('contact-spinner');

    if (overlay) overlay.remove();
  }

  // =========================
  // Submit Helper
  // =========================
  async function submitContactPayload(payload, timeout = 15000) {

    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {

      showSpinner();

      const response = await fetch(`${BACKEND}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {

        window.showToast &&
          window.showToast(
            'Inquiry Received!',
            `Thank you ${payload.name}. We'll get back to you soon.`,
            'success'
          );

        return {
          ok: true,
          data
        };

      } else {

        window.showToast &&
          window.showToast(
            'Send Failed',
            data.error || 'Unable to send inquiry.',
            'error'
          );

        return {
          ok: false,
          data
        };
      }

    } catch (err) {

      console.error('Contact Form Error:', err);

      if (err.name === 'AbortError') {

        window.showToast &&
          window.showToast(
            'Timeout',
            'Request timed out. Please try again.',
            'error'
          );

      } else {

        window.showToast &&
          window.showToast(
            'Network Error',
            'Unable to connect to server.',
            'error'
          );
      }

      return {
        ok: false,
        error: err
      };

    } finally {

      clearTimeout(timeoutId);

      hideSpinner();
    }
  }

  // expose globally
  window.submitContactPayload = submitContactPayload;

  // =========================
  // Main Logic
  // =========================
  document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('contact-form');

    if (!form) return;

    // prevent duplicate binding
    if (form.dataset.bound === '1') return;

    form.dataset.bound = '1';

    form.addEventListener('submit', async (e) => {

      e.preventDefault();

      // prevent duplicate submits
      if (form.dataset.sending === '1') return;

      const submitBtn = form.querySelector('button[type="submit"]');

      const name =
        document.getElementById('contact-name')?.value.trim();

      const email =
        document.getElementById('contact-email')?.value.trim();

      const category =
        document.getElementById('contact-category')?.value.trim();

      const message =
        document.getElementById('contact-message')?.value.trim();

      // =========================
      // Validation
      // =========================
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {

        window.showToast &&
          window.showToast(
            'Validation Error',
            'Please fill all required fields.',
            'error'
          );

        return;
      }

      if (!emailRegex.test(email)) {

        window.showToast &&
          window.showToast(
            'Invalid Email',
            'Please enter a valid email address.',
            'error'
          );

        return;
      }

      // =========================
      // Button State
      // =========================
      form.dataset.sending = '1';

      if (submitBtn) {

        submitBtn.disabled = true;

        submitBtn.dataset.original =
          submitBtn.innerHTML;

        submitBtn.innerHTML = 'Sending...';

        submitBtn.style.opacity = '0.7';

        submitBtn.style.cursor = 'not-allowed';
      }

      // =========================
      // Submit
      // =========================
      const payload = {
        name,
        email,
        category,
        message
      };

      const result =
        await submitContactPayload(payload);

      // =========================
      // Success
      // =========================
      if (result && result.ok) {
        form.reset();
      }

      // =========================
      // Restore Button
      // =========================
      form.dataset.sending = '0';

      if (submitBtn) {

        submitBtn.disabled = false;

        submitBtn.innerHTML =
          submitBtn.dataset.original ||
          'Send Inquiry';

        submitBtn.style.opacity = '1';

        submitBtn.style.cursor = 'pointer';
      }

    });

  });

})();