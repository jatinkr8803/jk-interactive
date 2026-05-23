from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# =========================
# Load Environment Variables
# =========================
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

load_dotenv(os.path.join(BASE_DIR, '.env'))

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
# SMTP Email Helper
# =========================
def send_email(subject, body, reply_to=None):

    EMAIL_USER = os.environ.get('EMAIL_USER')
    EMAIL_PASSWORD = os.environ.get('EMAIL_PASSWORD')

    if not EMAIL_USER or not EMAIL_PASSWORD:
        raise RuntimeError(
            'EMAIL_USER or EMAIL_PASSWORD missing'
        )

    msg = MIMEMultipart()

    msg['From'] = EMAIL_USER
    msg['To'] = EMAIL_USER
    msg['Subject'] = subject

    if reply_to:
        msg['Reply-To'] = reply_to

    msg.attach(
        MIMEText(body, 'plain')
    )

    try:

        # =========================
        # Gmail SMTP SSL
        # =========================
        with smtplib.SMTP_SSL(
            "smtp.gmail.com",
            465,
            timeout=30
        ) as server:

            server.login(
                EMAIL_USER,
                EMAIL_PASSWORD
            )

            server.sendmail(
                EMAIL_USER,
                [EMAIL_USER],
                msg.as_string()
            )

    except smtplib.SMTPAuthenticationError:

        raise RuntimeError(
            'SMTP authentication failed. Use Google App Password.'
        )

    except smtplib.SMTPException as e:

        raise RuntimeError(
            f'SMTP error: {str(e)}'
        )

    except Exception as e:

        raise RuntimeError(
            f'Unexpected email error: {str(e)}'
        )

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