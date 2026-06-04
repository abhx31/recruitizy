import re
from datetime import datetime, timezone
from pathlib import Path

import resend
from jinja2 import Environment, FileSystemLoader

from app.core.config import settings

resend.api_key = settings.RESEND_API_KEY

TEMPLATE_DIR = Path(__file__).resolve().parent.parent / "templates" / "emails"

env = Environment(loader=FileSystemLoader(str(TEMPLATE_DIR)))


def render_template(template_name: str, context: dict) -> str:
    template = env.get_template(template_name)
    # `now_year` is consumed by the shared base template footer.
    return template.render({"now_year": datetime.now(timezone.utc).year, **context})


def _html_to_text(html: str) -> str:
    # Quick-and-dirty plain-text alternative. Spam filters score HTML-only mail
    # higher; even a rough text body brings the score down meaningfully.
    text = re.sub(r"<(script|style)[^>]*>.*?</\1>", "", html, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"</(p|div|h[1-6]|li|tr|br)\s*/?>", "\n", text, flags=re.IGNORECASE)
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.IGNORECASE)
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def send_email(to: str, subject: str, template: str, context: dict):
    html_content = render_template(template, context)
    text_content = _html_to_text(html_content)

    resend.Emails.send({
        "from": settings.EMAIL_FROM,
        "to": to,
        "reply_to": settings.EMAIL_REPLY_TO,
        "subject": subject,
        "html": html_content,
        "text": text_content,
    })
