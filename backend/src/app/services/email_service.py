from pathlib import Path

import resend
from jinja2 import Environment, FileSystemLoader

from app.core.config import settings

resend.api_key = settings.RESEND_API_KEY

TEMPLATE_DIR = Path(__file__).resolve().parent.parent / "templates" / "emails"

env = Environment(loader=FileSystemLoader(str(TEMPLATE_DIR)))

def render_template(template_name: str, context: dict):
    template = env.get_template(template_name)
    return template.render(context)

def send_email(to: str, subject: str, template: str, context: dict):
    html_content = render_template(template, context)
    
    resend.Emails.send({
        "from": "noreply@abhinavdev.in.net",
        "to": to,
        "subject": subject,
        "html": html_content,
    })