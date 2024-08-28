import os

class Config:
    # Ustawienia dla wysyłania e-maili (SMTP)
    MAIL_SERVER = 'smtp.promoviegroup.pl'  # Adres serwera SMTP
    MAIL_PORT = 587  # Port dla STARTTLS
    MAIL_USE_TLS = True  # Używaj TLS
    MAIL_USE_SSL = False  # Nie używaj SSL, ponieważ używamy TLS
    MAIL_USERNAME = 'kontakt@promoviegroup.com'  # Twój adres e-mail
    MAIL_PASSWORD = '=PLama=1'  # Twoje hasło do e-maila
    MAIL_DEFAULT_SENDER = 'kontakt@promoviegroup.com'  # Adres nadawcy

    # Ustawienia dla odbierania e-maili (IMAP)
    IMAP_SERVER = 'imap.promoviegroup.pl'  # Adres serwera IMAP
    IMAP_PORT = 993  # Port TLS dla IMAP

    # Ustawienia dla odbierania e-maili (POP3)
    POP3_SERVER = 'imap.promoviegroup.pl'  # Adres serwera POP3
    POP3_PORT = 995  # Port TLS dla POP3

    # Klucz do zabezpieczania sesji
    SECRET_KEY = os.urandom(24)

    # Możesz dodać inne opcje konfiguracyjne, jeśli są wymagane
    REGISTRATION_ENABLED = True  # Domyślnie włączona