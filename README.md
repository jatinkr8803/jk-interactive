````markdown
# Simple Flask backend for static premium frontend

This project keeps your existing `code.html` frontend intact and adds a
minimal Flask backend that exposes a single JSON endpoint to send contact
form submissions via Gmail SMTP.

Files of interest
- `code.html` — your original frontend (served as-is at `/`).
- `app.py` — Flask app exposing `POST /api/contact` to send email.
 - `static/js/contact.js` — client-side shim that intercepts the contact form and POSTs to the backend (already injected into `code.html`).
- `Procfile` — for Render/Gunicorn deployment.
- `.env.example` — example env vars (copy to `.env`).

Environment variables (create a `.env` file locally)
- `EMAIL_USER` — the Gmail address to send from (your@gmail.com).
- `EMAIL_PASSWORD` — Gmail App Password (recommended) or account password.
- `SECRET_KEY` — Flask secret key for session security.
- `PORT` — optional. Render sets this automatically.

Local development
```
python -m venv venv
venv\Scripts\activate    # Windows
pip install -r requirements.txt
copy .env.example .env
set EMAIL_USER=your-email@gmail.com
set EMAIL_PASSWORD=your-app-password
set SECRET_KEY=replace-me
python app.py
```
Open http://localhost:5000 and submit the contact form to test.

Production / Render
- Add the environment variables in the Render dashboard (do NOT commit `.env`).
- The included `Procfile` uses Gunicorn: `web: gunicorn app:app`.
- For Gmail, create an App Password (recommended) and put it in
  `EMAIL_PASSWORD` to avoid login blocks.

Security notes
- Do not commit real credentials. Use `.env` locally and add `.env` to `.gitignore`.
- Use Gmail App Passwords or a dedicated sending service (SendGrid, Mailgun)
  for production reliability and deliverability.

If you want, I can run a local test (you provide environment values) or
add a small health-check route and a smoke test script.

Render-specific notes
- Ensure the `EMAIL_USER` and `EMAIL_PASSWORD` env vars are configured in Render.
- `Procfile` and `requirements.txt` are present; Render will use Gunicorn to run `app:app`.
- A simple health endpoint is available at `/_health`.

````
