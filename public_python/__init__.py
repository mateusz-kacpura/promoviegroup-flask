from flask import Flask
from flask_mail import Mail
from public_python.config import Config
from public_python.routes import bp as routes_bp

mail = Mail()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    mail.init_app(app)

    app.register_blueprint(routes_bp)

    return app