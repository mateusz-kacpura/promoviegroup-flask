from flask import Blueprint, request, jsonify
from flask_mail import Message
from services.file_service import write_to_file
from datetime import datetime
import os
import json
import logging
import uuid  # Import do generowania unikalnych identyfikatorów

# Konfiguracja logowania
logging.basicConfig(filename='app.log', level=logging.INFO, 
                    format='%(asctime)s %(levelname)s: %(message)s')

def sanitize_input(input_string):
    """Prosta funkcja do sanitizacji danych wejściowych"""
    return input_string.replace('<', '&lt;').replace('>', '&gt;')

def create_email_blueprint(mail):
    email_bp = Blueprint('email', __name__)

    @email_bp.route('/submit_form', methods=['POST'])
    def submit_form():
        data = request.json

        # Walidacja danych wejściowych
        required_fields = ['firstname', 'lastname', 'email', 'phone', 'jobtitle', 'message']
        for field in required_fields:
            if not data.get(field):
                logging.warning(f'Brak wymaganego pola: {field}')
                return jsonify({"message": f"Brak wymaganego pola: {field}"}), 400

        # Sanitizacja danych
        data = {key: sanitize_input(value) for key, value in data.items()}

        subject = f"Nowa wiadomość od {data['firstname']} {data['lastname']}"
        body = f"""
        Imię: {data['firstname']}
        Nazwisko: {data['lastname']}
        Email: {data['email']}
        Telefon: {data['phone']}
        Czego szuka: {data['jobtitle']}
        Wiadomość: {data['message']}
        """
        logging.info(f'Próba wysłania e-maila: {subject}')

        msg = Message(subject=subject, recipients=['kontakt@promoviegroup.pl', 'kontakt@promoviegroup.com', 'mateusz.kacpura@protonmail.com'], body=body)
        file_path = 'baza_danych/mail.json'
        log_entry = {
            "id": str(uuid.uuid4()),  # Generowanie unikalnego identyfikatora
            "firstname": data['firstname'],
            "lastname": data['lastname'],
            "email": data['email'],
            "phone": data['phone'],
            "jobtitle": data['jobtitle'],
            "message": data['message'],
            "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

        try:
            mail.send(msg)
            logging.info(f'E-mail wysłany pomyślnie do: {msg.recipients[0]}')
            write_to_file(log_entry, file_path)
            return jsonify({"message": "Wiadomość została wysłana!"})
        except Exception as e:
            logging.error(f'Błąd podczas wysyłania wiadomości e-mail: {e}')
            write_to_file(log_entry, file_path)
            return jsonify({"message": "Niestety nie udało się wysłać do nas e-maila, ale Twoja wiadomość szczęśliwie dotarła do nas!"}), 500

    def is_valid_email(email):
        """Sprawdza, czy e-mail ma poprawny format."""
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        return re.match(email_regex, email) is not None

    @email_bp.route('/save_email', methods=['POST'])
    def save_email():
        file_path = 'baza_danych/list_mail.json'
        data = request.json

        # Walidacja danych wejściowych
        email = data.get('email')
        if not email:
            logging.warning('Brak adresu e-mail w zapytaniu')
            return jsonify({'status': 'error', 'message': 'No email provided'}), 400

        if not is_valid_email(email):
            logging.warning('Nieprawidłowy format adresu e-mail')
            return jsonify({'status': 'error', 'message': 'Invalid email format'}), 400

        # Dodanie znacznika czasu do danych
        data['timestamp'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Generowanie unikalnego identyfikatora
        data['id'] = str(uuid.uuid4())

        # Odczyt istniejących danych z pliku
        email_list = []
        if os.path.exists(file_path):
            try:
                with open(file_path, 'r') as file:
                    email_list = json.load(file)
            except json.JSONDecodeError:
                logging.error('Błąd dekodowania JSON podczas odczytu pliku list_mail.json')

        # Dodanie nowych danych do listy
        email_list.append(data)
        logging.info(f'Zapisano dane: {data}')

        # Zapis całej listy do pliku
        try:
            with open(file_path, 'w') as file:
                json.dump(email_list, file, indent=4)
            logging.info('Zapis do pliku zakończony sukcesem')
            return jsonify({'status': 'success', 'message': 'Data saved successfully'})
        except Exception as e:
            logging.error(f'Błąd podczas zapisu pliku: {e}')
            return jsonify({'status': 'error', 'message': 'Failed to save data'}), 500

    @email_bp.route('/delete_email', methods=['POST'])
    def delete_email():
        file_path = 'baza_danych/list_mail.json'
        data = request.json
        email_id = data.get('id')

        if not email_id:
            logging.warning('Brak ID e-maila w zapytaniu')
            return jsonify({'status': 'error', 'message': 'No ID provided'}), 400

        # Odczyt istniejących danych z pliku
        email_list = []
        if os.path.exists(file_path):
            try:
                with open(file_path, 'r') as file:
                    email_list = json.load(file)
            except json.JSONDecodeError:
                logging.error('Błąd dekodowania JSON podczas odczytu pliku list_mail.json')

        # Filtracja wiadomości do usunięcia
        email_list = [email for email in email_list if email['id'] != email_id]
        logging.info(f'Usunięto e-mail z ID: {email_id}')

        # Zapis całej listy do pliku
        try:
            with open(file_path, 'w') as file:
                json.dump(email_list, file, indent=4)
            logging.info('Zapis do pliku zakończony sukcesem')
            return jsonify({'status': 'success', 'message': 'Email deleted successfully'})
        except Exception as e:
            logging.error(f'Błąd podczas zapisu pliku: {e}')
            return jsonify({'status': 'error', 'message': 'Failed to delete email'}), 500

    return email_bp
