from flask import Flask, request, jsonify, render_template, send_from_directory, abort
from flask_mail import Mail, Message
import json
from datetime import datetime
import os

app = Flask(__name__)

# Słownik mapujący ścieżki na odpowiednie nazwy plików szablonów
pages = {
    'o-nas': 'hero.html',
    'oferta': 'oferta.html',
    'galeria': 'galeria.html',
    'opinie': 'opinie.html',
    'kontakt': 'kontakt.html',
    'faq': 'faq.html',
    'articles': 'articles.html',
    'wsparcie': 'wsparcie.html'
}

@app.route('/')
@app.route('/<page>')
def index(page='o-nas'):
    if page in pages:
        return render_template('index.html', active_menu=page)
    else:
        abort(404)  # zwraca błąd 404 jeśli strona nie istnieje

# Funkcja pomocnicza do generowania tras dla każdego katalogu
def register_directory_route(directory_path, route_url, endpoint):
    @app.route(route_url + '/<path:filename>', endpoint=endpoint)
    def serve_files(filename):
        return send_from_directory(directory_path, filename)

# Rejestracja tras dla każdego katalogu z unikalnymi endpointami
register_directory_route(r'C:\xampp\htdocs\flask\static\efekty\adds\galeria\assets', '/efekty/adds/galeria/assets', 'galeria_assets')
register_directory_route(r'C:\xampp\htdocs\flask\static\efekty\adds\galeria\rolki', '/efekty/adds/galeria/rolki', 'reels_assets')
register_directory_route(r'C:\xampp\htdocs\flask\static\efekty\adds\galeria\video', '/efekty/adds/galeria/video', 'galeria_video')
register_directory_route(r'C:\xampp\htdocs\flask\static\efekty\adds\hero\img', '/efekty/adds/hero/img', 'hero_img')
register_directory_route(r'C:\xampp\htdocs\flask\static\efekty\adds\hero\assets', '/efekty/adds/hero/assets', 'hero_assets')
register_directory_route(r'C:\xampp\htdocs\flask\static\efekty\adds\oferta\images', '/efekty/adds/oferta/images', 'oferta_images')
register_directory_route(r'C:\xampp\htdocs\flask\static\efekty\adds\opinie\images', '/efekty/adds/opinie/images', 'opinie_images')
register_directory_route(r'C:\xampp\htdocs\flask\static\efekty\adds\testimonials\img', '/efekty/adds/testimonials/img', 'testimonials_img')
register_directory_route(r'C:\xampp\htdocs\flask\static\efekty\adds\testimonials-grid-section-frontendmentor\images', '/efekty/adds/testimonials-grid-section-frontendmentor/images', 'testimonials_grid_section_images')
register_directory_route(r'C:\xampp\htdocs\flask\static\efekty\adds\workers\img', '/efekty/adds/workers/img', 'workers_img')

# Trasa dla full_logo.png
@app.route('/full_logo.png')
def serve_full_logo():
    return send_from_directory('static', 'full_logo.png')

# Trasa dla logo_1080p.mp4
@app.route('/logo_1080p.mp4')
def serve_video_logo():
    return send_from_directory('static', 'logo_1080p.mp4')

# Trasa dla logo.svg
@app.route('/logo.svg')
def serve_svg_logo():
    return send_from_directory('static', 'logo.svg')

# Wysyłanie maila
# Configuring Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.example.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'your_email@example.com'
app.config['MAIL_PASSWORD'] = 'your_password'
app.config['MAIL_DEFAULT_SENDER'] = 'your_email@example.com'

mail = Mail(app)

@app.route('/submit_form', methods=['POST'])
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

    # Define the path to the JSON file
    file_path = 'C:/xampp/htdocs/flask/static/baza_danych/mail.json'

    # Data to be saved in the JSON file
    log_entry = {
        "firstname": data['firstname'],
        "lastname": data['lastname'],
        "email": data['email'],
        "phone": data['phone'],
        "jobtitle": data['jobtitle'],
        "message": data['message'],
        "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }

    # Write to the JSON file
    def write_to_file(entry):
        if os.path.exists(file_path):
            with open(file_path, 'r+', encoding='utf-8') as file:
                try:
                    # Load existing data
                    data = json.load(file)
                except json.JSONDecodeError:
                    # If file is empty or invalid JSON, start with an empty list
                    data = []
                # Append the new entry
                data.append(entry)
                # Move to the beginning of the file
                file.seek(0)
                # Write updated data
                json.dump(data, file, ensure_ascii=False, indent=4)
        else:
            # If file does not exist, create it and write the entry
            with open(file_path, 'w', encoding='utf-8') as file:
                json.dump([entry], file, ensure_ascii=False, indent=4)

    try:
        mail.send(msg)
        write_to_file(log_entry)
        return jsonify({"message": "Wiadomość została wysłana!"})
    except Exception as e:
        print(e)
        write_to_file(log_entry)
        return jsonify({"message": "Błąd podczas wysyłania wiadomości."}), 500

if __name__ == "__main__":
    app.run(debug=True)
