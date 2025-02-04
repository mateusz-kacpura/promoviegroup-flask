import uuid
from flask import Blueprint, render_template, request, abort
from user_agents import parse
from services.location_service import get_location
from services.visitor_service import save_visitor_info
from datetime import datetime

index_bp = Blueprint('index', __name__)

dashboard = {
    'o-nas': 'hero.html',
    'oferta': 'oferta.html',
    'galeria': 'galeria.html',
    'opinie': 'opinie.html',
    'kontakt': 'kontakt.html',
    'faq': 'faq.html',
    'articles': 'articles.html',
    'wsparcie': 'wsparcie.html'
}


@index_bp.route('/')
@index_bp.route('/<page>')
def index(page='o-nas'):
    if page in dashboard:
        ip_address = request.remote_addr
        user_agent = request.headers.get('User-Agent')
        parsed_ua = parse(user_agent)
        browser = parsed_ua.browser.family
        os = parsed_ua.os.family
        device = parsed_ua.device.family

        location = get_location(ip_address)
        visit_time = datetime.now()

        visitor_info = {
            "id": str(uuid.uuid4()),  # Generowanie unikalnego ID
            "ip": ip_address,
            "date": visit_time.strftime("%Y-%m-%d %H:%M:%S"),
            "location": location,
            "browser": browser,
            "os": os,
            "device": device
        }

        save_visitor_info(visitor_info)
        print(visitor_info)

        return render_template('index.html', active_menu=page)
    else:
        abort(404)
