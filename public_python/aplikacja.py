from flask import Flask
from flask_mail import Mail
from flask_login import LoginManager
from flask_cors import CORS
from routes.index import index_bp
from routes.files import files_bp
from routes.json_routes import json_bp
from routes.email import create_email_blueprint
from routes.auth import auth_bp  # Upewnij się, że importujesz auth_bp
from routes.cms import cms_bp
from routes.user import user_bp
from models.user import User
import config

def create_app():
    app = Flask(__name__, template_folder='frontend/templates', static_folder='frontend/static')

    # Załaduj konfigurację
    app.config.from_object(config.Config)

    # Inicjalizacja CORS
    CORS(app)

    # Inicjalizacja Flask-Mail
    mail = Mail(app)

    # Inicjalizacja Flask-Login
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'

    @login_manager.user_loader
    def load_user(user_id):
        return User.get_by_uuid(user_id)

    # Rejestracja blueprintów
    app.register_blueprint(index_bp)
    app.register_blueprint(files_bp)
    app.register_blueprint(json_bp)
    app.register_blueprint(create_email_blueprint(mail))
    app.register_blueprint(auth_bp)  # Upewnij się, że rejestrujesz auth_bp
    app.register_blueprint(cms_bp)
    app.register_blueprint(user_bp)

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
