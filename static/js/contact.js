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
  // Error Modal
  // =========================
  function showFormErrorModal() {
    // Remove any existing modal
    const existing = document.getElementById('contact-error-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'contact-error-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'contact-error-title');
    modal.style.cssText = [
      'position:fixed',
      'inset:0',
      'z-index:99999',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'padding:24px',
      'background:rgba(0,0,0,0.45)',
      'backdrop-filter:blur(10px)',
      'opacity:0',
      'transition:opacity 0.3s ease',
    ].join(';');

    modal.innerHTML = `
      <div style="
        max-width:480px;
        width:100%;
        background:var(--glass-bg, rgba(255,255,255,0.4));
        backdrop-filter:blur(20px);
        border:1px solid var(--glass-border, rgba(255,255,255,0.2));
        border-radius:2rem;
        padding:2.5rem;
        box-shadow:0 25px 60px rgba(0,0,0,0.2);
        transform:scale(0.95);
        transition:transform 0.3s cubic-bezier(0.16,1,0.3,1);
        position:relative;
      " id="contact-error-inner">
        <!-- Close button -->
        <button
          id="contact-error-close"
          aria-label="Close dialog"
          style="
            position:absolute;
            top:1.25rem;
            right:1.25rem;
            width:2.25rem;
            height:2.25rem;
            border-radius:50%;
            background:var(--surface-container, #edeeef);
            border:none;
            cursor:pointer;
            display:flex;
            align-items:center;
            justify-content:center;
            transition:background 0.2s;
            color:var(--on-surface, #191c1d);
          "
        >
          <span class="material-symbols-outlined" style="font-size:18px;line-height:1;">close</span>
        </button>

        <!-- Icon -->
        <div style="
          width:3rem;
          height:3rem;
          border-radius:50%;
          background:var(--error-container, #ffdad6);
          display:flex;
          align-items:center;
          justify-content:center;
          margin-bottom:1.25rem;
        ">
          <span class="material-symbols-outlined" style="color:var(--error,#ba1a1a);font-size:24px;">error</span>
        </div>

        <!-- Title -->
        <h3
          id="contact-error-title"
          style="
            font-family:'Plus Jakarta Sans',sans-serif;
            font-size:1.375rem;
            font-weight:700;
            line-height:1.3;
            letter-spacing:-0.01em;
            color:var(--on-surface, #191c1d);
            margin:0 0 0.75rem;
          "
        >Something went wrong</h3>

        <!-- Body -->
        <p style="
          font-family:Inter,sans-serif;
          font-size:0.9375rem;
          line-height:1.65;
          color:var(--on-surface-variant, #434656);
          margin:0 0 1.75rem;
        ">
          Something went wrong while submitting the form. This may be due to a temporary server issue.
          Please try again later or reach out to us manually at
          <a
            href="mailto:jkinteractiveofficial@gmail.com"
            style="color:var(--primary,#0040e0);text-decoration:none;font-weight:600;word-break:break-all;"
          >jkinteractiveofficial@gmail.com</a>.
        </p>

        <!-- Actions -->
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <button
            id="contact-error-retry"
            style="
              flex:1;
              min-width:120px;
              background:var(--primary,#0040e0);
              color:var(--on-primary,#fff);
              border:none;
              border-radius:9999px;
              padding:0.75rem 1.5rem;
              font-family:Inter,sans-serif;
              font-size:0.8125rem;
              font-weight:600;
              letter-spacing:0.05em;
              text-transform:uppercase;
              cursor:pointer;
              transition:opacity 0.2s, transform 0.15s;
            "
          >Try Again</button>
          <a
            href="mailto:jkinteractiveofficial@gmail.com"
            style="
              flex:1;
              min-width:120px;
              text-align:center;
              border:2px solid var(--outline-variant,#c4c5d9);
              color:var(--on-surface,#191c1d);
              border-radius:9999px;
              padding:0.75rem 1.5rem;
              font-family:Inter,sans-serif;
              font-size:0.8125rem;
              font-weight:600;
              letter-spacing:0.05em;
              text-transform:uppercase;
              text-decoration:none;
              cursor:pointer;
              transition:border-color 0.2s;
              box-sizing:border-box;
            "
          >Email Us</a>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Animate in
    requestAnimationFrame(() => {
      modal.style.opacity = '1';
      const inner = document.getElementById('contact-error-inner');
      if (inner) inner.style.transform = 'scale(1)';
    });

    // Trap focus on close/retry/email buttons
    const closeBtn = document.getElementById('contact-error-close');
    const retryBtn = document.getElementById('contact-error-retry');
    if (closeBtn) closeBtn.focus();

    function closeModal() {
      modal.style.opacity = '0';
      const inner = document.getElementById('contact-error-inner');
      if (inner) inner.style.transform = 'scale(0.95)';
      setTimeout(() => { modal.remove(); }, 300);
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (retryBtn) {
      retryBtn.addEventListener('click', function () {
        closeModal();
      });
    }

    // Close on backdrop click
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });

    // Close on Escape key
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', onKeyDown);
      }
    }
    document.addEventListener('keydown', onKeyDown);
  }

  // =========================
  // Reset button state helper
  // =========================
  function resetSubmitBtn(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      if (submitBtn.dataset.original) {
        submitBtn.innerHTML = submitBtn.dataset.original;
      }
      submitBtn.style.opacity = '';
      submitBtn.style.cursor = '';
    }
    delete form.dataset.sending;
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

      const name = document.getElementById('contact-name')?.value.trim();
      const email = document.getElementById('contact-email')?.value.trim();
      const phone = document.getElementById('contact-phone')?.value?.trim() || '';
      const company = document.getElementById('contact-company')?.value?.trim() || '';
      const service = document.getElementById('contact-category')?.value || document.getElementById('contact-service')?.value || '';
      const budget = document.getElementById('contact-budget')?.value || '';
      const message = document.getElementById('contact-message')?.value.trim();
      const gotcha = form.querySelector('[name="_gotcha"]')?.value || '';

      // =========================
      // Validation
      // =========================
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        window.showToast &&
          window.showToast(
            'Validation Error',
            'Please fill in all required fields (Name, Email, Message).',
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
      // Honeypot Check (Spam Protection)
      // =========================
      if (gotcha !== '') {
        // Silent rejection for spam bots (pretend success)
        form.reset();
        window.showToast &&
          window.showToast(
            'Message Sent!',
            'Thank you for reaching out. We\'ll get back to you soon.',
            'success'
          );
        return;
      }

      // =========================
      // Button State
      // =========================
      form.dataset.sending = '1';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.original = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending...';
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'not-allowed';
      }

      // =========================
      // Submit via Google Apps Script (fetch JSON)
      // =========================
      showSpinner();

      try {
        const payload = {
          name: name,
          email: email,
          phone: phone,
          company: company,
          service: service,
          budget: budget,
          message: message,
          _gotcha: gotcha
        };

        const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxaBUSeu9FxUJD8Wa1TSyxmYD08Q1P4xsqZ6oT9rg_D5iI6sAtkbLgTdMp8d7til-vsdg/exec';
        const targetUrl = (form.action && form.action.startsWith('http')) ? form.action : APPS_SCRIPT_URL;

        const response = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(payload),
        });

        hideSpinner();

        let result = {};
        try {
          result = await response.json();
        } catch (e) {
          result = { success: response.ok };
        }

        if (result && result.success) {
          // Success — reset form and show success toast
          form.reset();
          resetSubmitBtn(form);

          window.showToast &&
            window.showToast(
              'Message Sent!',
              'Thank you for reaching out. We\'ll get back to you soon.',
              'success'
            );
        } else {
          // Server responded with failure
          resetSubmitBtn(form);
          if (result && result.message) {
            window.showToast &&
              window.showToast(
                'Submission Error',
                result.message,
                'error'
              );
          } else {
            showFormErrorModal();
          }
        }

      } catch (err) {
        // Network failure or Apps Script unreachable
        hideSpinner();
        resetSubmitBtn(form);
        showFormErrorModal();
      }

    });

  });

})();