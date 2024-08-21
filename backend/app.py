from flask import Flask
from flask_mail import Mail
from flask_cors import CORS
from routes.index import index_bp
from routes.files import files_bp
from routes.json_routes import json_bp
from routes.email import create_email_blueprint
import os

def create_app():
    app = Flask(__name__, template_folder='frontend/templates', static_folder='frontend/static')
    CORS(app)
    
    # Załaduj konfigurację
    app.config.from_object('config.Config')

    # Inicjalizacja Flask-Mail
    mail = Mail(app)

    # Rejestracja blueprintów
    app.register_blueprint(index_bp)
    app.register_blueprint(files_bp)
    app.register_blueprint(json_bp)
    app.register_blueprint(create_email_blueprint(mail))

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
