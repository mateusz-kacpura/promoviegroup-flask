from flask import Blueprint, render_template, send_from_directory, abort, request, redirect, url_for, jsonify, current_app, flash
from flask_login import UserMixin, login_required, current_user
import json
import os

class User(UserMixin):
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

def load_user_from_file(user_id):
    try:
        with open('baza_danych/users.json') as f:
            users = json.load(f)
        user_data = users.get(user_id)
        if user_data:
            return User(user_id, user_data['username'], user_data['password'])
    except (FileNotFoundError, json.JSONDecodeError):
        return None
    return None

def load_all_users():
    try:
        with open('baza_danych/users.json') as f:
            users = json.load(f)
        return {user_id: User(user_id, data['username'], data['password']) for user_id, data in users.items()}
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

user_bp = Blueprint('user', __name__, url_prefix='/user', template_folder='templates')

@user_bp.route('/profile')
@login_required
def profile():
    return render_template('profile.html', user=current_user, section='home')

@user_bp.route('/profile/pages/<section>')
@login_required
def profile_section(section):
    return render_template('profile.html', user=current_user, section=section)

HERO_JSON_PATH = os.path.join('baza_danych', 'hero.json')

@user_bp.route('/profile/pages/hero', methods=['GET', 'POST'])
@login_required
def update_hero():
    if request.method == 'POST':
        try:
            # Pobierz dane z formularza
            data = {
                "carouselItems": request.form.getlist('carouselItems'),
                "mainSection": {
                    "backgroundURL": request.form['mainSection[backgroundURL]'],
                    "title1": request.form['mainSection[title1]'],
                    "title2": request.form['mainSection[title2]'],
                    "button1Text": request.form['mainSection[button1Text]'],
                    "button2Text": request.form['mainSection[button2Text]'],
                    "phoneNumber": request.form['mainSection[phoneNumber]'],
                },
                "membersTeamSection": {
                    "teamTitle": request.form['membersTeamSection[teamTitle]'],
                    "teamSubtitle": request.form['membersTeamSection[teamSubtitle]'],
                    "members": []
                },
                "jumbotron": {
                    "title1": request.form['jumbotron[title1]'],
                    "title2": request.form['jumbotron[title2]'],
                    "button1Text": request.form['jumbotron[button1Text]'],
                    "button2Text": request.form['jumbotron[button2Text]'],
                    "imageURL": request.form['jumbotron[imageURL]'],
                },
                "latestArticles": [],
                "adventure": {
                    "title1": request.form['adventure[title1]'],
                    "title2": request.form['adventure[title2]'],
                    "description": request.form['adventure[description]'],
                },
                "partners": {
                    "text1": request.form['partners[text1]'],
                    "text2": request.form['partners[text2]'],
                    "text3": request.form['partners[text3]'],
                    "images": request.form.getlist('partners[images]')
                },
                "clients": request.form.getlist('clients'),
                "video": {
                    "images": request.form.getlist('video[images]'),
                    "videos": request.form.getlist('video[videos]')
                }
            }

            # Obsługa członków zespołu
            member_count = len(request.form.getlist('team[0][name]'))
            for i in range(member_count):
                member = {
                    "name": request.form[f'team[{i}][name]'],
                    "role": request.form[f'team[{i}][role]'],
                    "imageURL": request.form[f'team[{i}][imageURL]'],
                    "socialIcons": request.form.getlist(f'team[{i}][socialIcons]'),
                    "socialLinks": request.form.getlist(f'team[{i}][socialLinks]'),
                    "details": {
                        "biography": request.form[f'team[{i}][details][biography]'],
                        "expirience": request.form[f'team[{i}][details][expirience]'],
                        "techniques": request.form[f'team[{i}][details][techniques]'],
                        "projects": request.form[f'team[{i}][details][projects]']
                    }
                }
                data["membersTeamSection"]["members"].append(member)

            # Obsługa artykułów
            article_count = len(request.form.getlist('latestArticles[0][title]'))
            for i in range(article_count):
                article = {
                    "title": request.form[f'latestArticles[{i}][title]'],
                    "category": request.form[f'latestArticles[{i}][category]'],
                    "description1": request.form[f'latestArticles[{i}][description1]'],
                    "description2": request.form[f'latestArticles[{i}][description2]'],
                    "imageURL": request.form[f'latestArticles[{i}][imageURL]'],
                }
                data["latestArticles"].append(article)

            # Zapisz dane do pliku JSON
            with open(HERO_JSON_PATH, 'w', encoding='utf-8') as json_file:
                json.dump(data, json_file, ensure_ascii=False, indent=4)

            flash('Dane zostały zaktualizowane.', 'success')
            return redirect(url_for('user.update_hero'))

        except Exception as e:
            flash(f'Wystąpił błąd podczas aktualizacji danych: {str(e)}', 'danger')
            return redirect(url_for('user.update_hero'))

    else:
        # Wczytaj dane z pliku JSON
        try:
            with open(HERO_JSON_PATH, 'r', encoding='utf-8') as json_file:
                data = json.load(json_file)
                print(data)  # Dodaj ten wiersz, aby sprawdzić, czy dane są poprawnie wczytywane

            return render_template('profile/pages/hero.html', json_data=data)

        except Exception as e:
            flash(f'Wystąpił błąd podczas wczytywania danych: {str(e)}', 'danger')
            return redirect(url_for('user_bp.update_hero'))

# Ścieżka do katalogów
VIDEO_DIR = {
    'komputer': os.path.join('frontend/static/efekty/adds/galeria/video/komputer/'),
    'mobile': os.path.join('frontend/static/efekty/adds/galeria/video/mobile/')
}

@user_bp.route('/upload_video', methods=['POST'])
@login_required
def upload_video():
    video_type = request.args.get('type')
    if 'file' not in request.files:
        return jsonify(success=False, error="No file provided")

    file = request.files['file']
    if file.filename == '':
        return jsonify(success=False, error="No selected file")

    file_path = os.path.join(VIDEO_DIR.get(video_type, ''), file.filename)
    try:
        file.save(file_path)
        return jsonify(success=True, filePath=file_path)
    except Exception as e:
        return jsonify(success=False, error=str(e))

@user_bp.route('/browse_files', methods=['GET'])
@login_required
def browse_files():
    video_type = request.args.get('type')
    print(f"Requested video type: {video_type}")
    
    if video_type not in VIDEO_DIR:
        return jsonify(success=False, error="Invalid video type")

    directory = VIDEO_DIR[video_type]
    print(f"Accessing directory: {directory}")

    if not os.path.exists(directory):
        return jsonify(success=False, error="Directory does not exist")

    try:
        files = os.listdir(directory)
        print(f"Files found: {files}")
        return jsonify(success=True, files=files)
    except FileNotFoundError:
        return jsonify(success=False, error="Directory not found")
    except PermissionError:
        return jsonify(success=False, error="Permission denied")
    except Exception as e:
        print(f"Error browsing files: {str(e)}")
        return jsonify(success=False, error="An unexpected error occurred")

MAIL_JSON_PATH = os.path.join('baza_danych', 'mail.json')

@user_bp.route('/profile/pages/mail', methods=['GET'])
@login_required
def display_mail():
    try:
        with open(MAIL_JSON_PATH, 'r', encoding='utf-8') as json_file:
            mails = json.load(json_file)
    except (FileNotFoundError, json.JSONDecodeError):
        mails = []

    return render_template('profile/pages/mail.html', mails=mails)

@user_bp.route('/profile/pages/delete_mail', methods=['POST'])
@login_required
def delete_mail():
    id_to_delete = request.form.get('id')

    if not id_to_delete:
        return jsonify({'status': 'error', 'message': 'No ID provided'}), 400

    try:
        with open(MAIL_JSON_PATH, 'r+', encoding='utf-8') as json_file:
            mails = json.load(json_file)
            
            # Filtrujemy maile i usuwamy te z podanym id
            mails = [mail for mail in mails if mail.get('id') != id_to_delete]
            
            # Ustawiamy wskaźnik na początek pliku i zapisujemy zmienioną listę
            json_file.seek(0)
            json.dump(mails, json_file, ensure_ascii=False, indent=4)
            
            # Usuwamy pozostałe dane po zmienionej liście
            json_file.truncate()
        
        return redirect(url_for('user.display_mail'))
    except (FileNotFoundError, json.JSONDecodeError) as e:
        # Logujemy błędy oraz zwracamy odpowiedni komunikat
        print(f"Error occurred: {e}")  # Zamień na logger w aplikacji produkcyjnej
        return jsonify({'status': 'error', 'message': 'Failed to delete email'}), 500


VISITORS_JSON_PATH = os.path.join('baza_danych', 'visitors.json')

@user_bp.route('/profile/pages/visitors', methods=['GET'])
@login_required
def display_visitors():
    try:
        with open(VISITORS_JSON_PATH, 'r', encoding='utf-8') as json_file:
            visitors = json.load(json_file)
    except (FileNotFoundError, json.JSONDecodeError):
        visitors = []

    return render_template('profile/pages/visitors.html', visitors=visitors)

@user_bp.route('/profile/pages/delete_visitor', methods=['POST'])
@login_required
def delete_visitor():
    id_to_delete = request.form.get('id')

    if not id_to_delete:
        return jsonify({'status': 'error', 'message': 'No ID provided'}), 400

    try:
        with open(VISITORS_JSON_PATH, 'r+', encoding='utf-8') as json_file:
            visitors = json.load(json_file)
            
            # Filtrujemy wizyty i usuwamy te z podanym id
            visitors = [visitor for visitor in visitors if visitor.get('id') != id_to_delete]
            
            # Ustawiamy wskaźnik na początek pliku i zapisujemy zmienioną listę
            json_file.seek(0)
            json.dump(visitors, json_file, ensure_ascii=False, indent=4)
            
            # Usuwamy pozostałe dane po zmienionej liście
            json_file.truncate()
        
        return redirect(url_for('user.display_visitors'))
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error occurred: {e}")  # Zamień na logger w aplikacji produkcyjnej
        return jsonify({'status': 'error', 'message': 'Failed to delete visitor'}), 500
    

# Ścieżka do pliku JSON
OPINIE_JSON_PATH = os.path.join('baza_danych', 'opinie.json')

def load_opinie():
    try:
        with open(OPINIE_JSON_PATH, 'r', encoding='utf-8') as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

def save_opinie(data):
    try:
        with open(OPINIE_JSON_PATH, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=4, ensure_ascii=False)
    except IOError:
        return False
    return True

@user_bp.route('/profile/pages/opinie', methods=['GET', 'POST'])
@login_required
def update_opinie():
    if request.method == 'POST':
        try:
            data = request.form.to_dict(flat=False)  # Pobieranie danych jako słownik

            # Przetwarzanie danych z formularza (konwersja na odpowiedni format)
            testimonials_data = []
            testimonial_keys = [key for key in data.keys() if key.startswith('testimonials[')]
            
            # Zbieranie unikalnych indeksów dla testimonials
            indices = set()
            for key in testimonial_keys:
                index = int(key.split('[')[1].split(']')[0])
                indices.add(index)
            
            for i in sorted(indices):
                testimonials_data.append({
                    "photo": data.get(f"testimonials[{i}][photo]", [""])[0],
                    "author": data.get(f"testimonials[{i}][author]", [""])[0],
                    "occupation": data.get(f"testimonials[{i}][occupation]", [""])[0],
                    "quote": data.get(f"testimonials[{i}][quote]", [""])[0],
                    "social": {
                        "facebook": data.get(f"testimonials[{i}][social][facebook]", [""])[0],
                        "twitter": data.get(f"testimonials[{i}][social][twitter]", [""])[0],
                        "instagram": data.get(f"testimonials[{i}][social][instagram]", [""])[0],
                    }
                })
            
            processed_data = {
                "hero": {
                    "backgroundImage": data.get("hero[backgroundImage]", [""])[0],
                    "title": data.get("hero[title]", [""])[0],
                    "description": data.get("hero[description]", [""])[0],
                },
                "about": {
                    "title": data.get("about[title]", [""])[0],
                    "description": data.get("about[description]", [""])[0],
                    "buttonText": data.get("about[buttonText]", [""])[0],
                    "image1": data.get("about[image1]", [""])[0],
                    "image2": data.get("about[image2]", [""])[0],
                },
                "clients": [value[0] for key, value in data.items() if key.startswith('clients[')],
                "testimonials": testimonials_data,
                "aboutUs": {
                    "videoSrc": data.get("aboutUs[videoSrc]", [""])[0],
                    "title": data.get("aboutUs[title]", [""])[0],
                    "description": data.get("aboutUs[description]", [""])[0],
                    "bulletPoints": data.get("aboutUs[bulletPoints]", []),
                },
                "contact": {
                    "backgroundImage": data.get("contact[backgroundImage]", [""])[0],
                    "title": data.get("contact[title]", [""])[0],
                    "buttonLink": data.get("contact[buttonLink]", [""])[0],
                    "buttonText": data.get("contact[buttonText]", [""])[0],
                    "email": data.get("contact[email]", [""])[0],
                    "phone": data.get("contact[phone]", [""])[0],
                    "address": data.get("contact[address]", [""])[0],
                    "mapUrl": data.get("contact[mapUrl]", [""])[0],
                    "social": {
                        "facebook": data.get("contact[social][facebook]", [""])[0],
                        "linkedin": data.get("contact[social][linkedin]", [""])[0],
                        "instagram": data.get("contact[social][instagram]", [""])[0],
                    }
                }
            }

            # Zapisywanie przetworzonych danych
            if save_opinie(processed_data):
                return jsonify({"success": True, "message": "Dane zostały zapisane pomyślnie!"})
            else:
                return jsonify({"success": False, "message": "Błąd podczas zapisu danych!"})

        except Exception as e:
            return jsonify({"success": False, "message": str(e)})

    # Gdy metoda jest GET
    opinie_data = load_opinie()
    return render_template('profile/pages/opinie.html', user=current_user, data=opinie_data)
