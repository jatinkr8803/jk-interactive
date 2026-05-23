from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from dotenv import load_dotenv
import resend

# =========================
# Load Environment Variables
# =========================
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

load_dotenv(os.path.join(BASE_DIR, '.env'))

# =========================
# Resend Config
# =========================
resend.api_key = os.environ.get("RESEND_API_KEY")

# =========================
# Flask App Setup
# =========================
app = Flask(
    __name__,
    static_folder='static',
    template_folder='templates'
)

# =========================
# Enable CORS
# =========================
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "http://127.0.0.1:5500",
                "http://localhost:5500",
                "https://jkinteractive.netlify.app",
                "https://jk-interactive.onrender.com"
            ]
        }
    }
)

app.config['SECRET_KEY'] = os.environ.get(
    'SECRET_KEY',
    'change-this-secret'
)

# =========================
# Email Helper
# =========================
def send_email(subject, body, reply_to=None):

    EMAIL_USER = os.environ.get('EMAIL_USER')

    if not EMAIL_USER:
        raise RuntimeError(
            'EMAIL_USER missing'
        )

    params = {
        "from": "JK Interactive <onboarding@resend.dev>",
        "to": [EMAIL_USER],
        "subject": subject,
        "text": body,
    }

    if reply_to:
        params["reply_to"] = reply_to

    resend.Emails.send(params)

# =========================
# Routes
# =========================

@app.route('/')
def index():

    return send_file(
        os.path.join(BASE_DIR, 'code.html')
    )

@app.route('/_health')
def health():

    return jsonify({
        'status': 'ok'
    })

@app.route('/api/test')
def test():

    return jsonify({
        'success': True,
        'message': 'Backend working'
    })

@app.route('/api/contact', methods=['POST'])
def api_contact():

    data = request.get_json() or {}

    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    category = data.get('category', '').strip()
    message = data.get('message', '').strip()

    # =========================
    # Validation
    # =========================
    if not name or not email or not message:

        return jsonify({
            'success': False,
            'error': 'Name, email and message are required'
        }), 400

    if '@' not in email:

        return jsonify({
            'success': False,
            'error': 'Invalid email address'
        }), 400

    subject = f"New Inquiry from {name}"

    body = f"""
New Contact Inquiry

Name:
{name}

Email:
{email}

Project Category:
{category}

Message:
{message}
"""

    try:

        send_email(
            subject,
            body,
            reply_to=email
        )

        return jsonify({
            'success': True,
            'message': 'Inquiry sent successfully'
        }), 200

    except Exception as e:

        app.logger.exception(
            'Failed to send email'
        )

        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# =========================
# Run App
# =========================
if __name__ == "__main__":

    port = int(
        os.environ.get("PORT", 5000)
    )

    app.run(
        host="0.0.0.0",
        port=port
    )