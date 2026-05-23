// contact.js - handles premium contact form submission

(function () {

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
      // Submit via FormSubmit
      // =========================
      showSpinner();

      form.submit();

    });

  });

})();