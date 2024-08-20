from flask import Blueprint, request, jsonify
from flask_mail import Message
from services.file_service import write_to_file
from datetime import datetime
import os 
import json

def create_email_blueprint(mail):
    email_bp = Blueprint('email', __name__)

    @email_bp.route('/submit_form', methods=['POST'])
    def submit_form():
        data = request.json
        subject = f"Nowa wiadomość od {data['firstname']} {data['lastname']}"
        body = f"""
        Imię: {data['firstname']}
        Nazwisko: {data['lastname']}
        Email: {data['email']}
        Telefon: {data['phone']}
        Czego szuka: {data['jobtitle']}
        Wiadomość: {data['message']}
        """
        print(body)
        msg = Message(subject=subject, recipients=['recipient@example.com'], body=body)
        file_path = 'static/baza_danych/mail.json'
        log_entry = {
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
            write_to_file(log_entry, file_path)
            return jsonify({"message": "Wiadomość została wysłana!"})
        except Exception as e:
            print(f"Błąd podczas wysyłania wiadomości e-mail: {e}")
            write_to_file(log_entry, file_path)
            return jsonify({"message": "Błąd podczas wysyłania wiadomości."}), 500

    @email_bp.route('/save_email', methods=['POST'])
    def save_email():
        file_path = 'static/baza_danych/list_mail.json'
        data = request.json
        email = data.get('email')
        if email:
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            email_list = []

            if os.path.exists(file_path):
                try:
                    with open(file_path, 'r') as file:
                        email_list = json.load(file)
                except json.JSONDecodeError:
                    pass

            email_list.append({'email': email, 'timestamp': timestamp})

            with open(file_path, 'w') as file:
                json.dump(email_list, file, indent=4)

            return jsonify({'status': 'success', 'message': 'Email saved successfully'})
        else:
            return jsonify({'status': 'error', 'message': 'No email provided'}), 400

    return email_bp
