from jinja2 import Environment, FileSystemLoader
import resend
from app.core.config import settings

resend.api_key = settings.RESEND_API_KEY

env = Environment(loader=FileSystemLoader("app/templates/emails"))

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