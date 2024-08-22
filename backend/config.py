import os

class Config:
    MAIL_SERVER = 'smtp.example.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'your_email@example.com'
    MAIL_PASSWORD = 'your_password'
    MAIL_DEFAULT_SENDER = 'your_email@example.com'
    SECRET_KEY = os.urandom(24)  # Klucz do zabezpieczania sesji