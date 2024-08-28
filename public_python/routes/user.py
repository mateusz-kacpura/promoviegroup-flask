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

def save_hero(hero_data):
    """Zapisuje dane do pliku JSON."""
    with open(HERO_JSON_PATH, 'w', encoding='utf-8') as json_file:
        json.dump(hero_data, json_file, indent=4, ensure_ascii=False)

def split_into_columns(data):
    # Zakłada, że wszystkie wiersze mają tę samą liczbę kolumn
    num_columns = len(data[0][0])
    
    # Inicjalizuj listy dla każdej kolumny
    columns = [[] for _ in range(num_columns)]
    
    # Przechodzimy przez dane i przypisujemy wartości do odpowiednich kolumn
    for row in data:
        for index, value in enumerate(row[0]):
            columns[index].append(value)
    
    # Połącz nagłówki z kolumnami
    result = columns
    return result

@user_bp.route('/profile/pages/hero', methods=['GET', 'POST'])
@login_required
def update_hero():
    """Obsługuje aktualizację sekcji hero."""
    if request.method == 'POST':
        try:
            # Pobranie danych z formularza
            data = request.form.to_dict(flat=False)
            hero_data = {
                "carouselItems": [],
                "mainSection": {},
                "membersTeamSection": {"teamTitle": "", "teamSubtitle": "", "members": []},  # social linki w sekcji member muszą też być poprawnie zapisane
                "jumbotron": {},
                "latestArticles": [],
                "adventure": {},
                "partners": {"text1": "", "text2": "", "text3": "", "images": []},
                "video": {"videos": [], "images": [], "titles": []}
            }

            # Procesowanie sekcji Carousel
            index = 0
            while f'carouselItems[{index}][videoSrc]' in data:
                carousel_item = {
                    "videoSrc": data.get(f'carouselItems[{index}][videoSrc]', [''])[0],
                    "videoMobileSrc": data.get(f'carouselItems[{index}][videoMobileSrc]', [''])[0],
                    "maskColor": data.get(f'carouselItems[{index}][maskColor]', [''])[0],
                    "heading": data.get(f'carouselItems[{index}][heading]', [''])[0],
                    "subheading": data.get(f'carouselItems[{index}][subheading]', [''])[0],
                    "buttons": [
                        {
                            "text": data.get(f'carouselItems[{index}][buttons][0][text]', [''])[0],
                            "url": data.get(f'carouselItems[{index}][buttons][0][url]', [''])[0],
                            "class": data.get(f'carouselItems[{index}][buttons][0][class]', [''])[0]
                        }
                    ]
                }
                hero_data["carouselItems"].append(carousel_item)
                index += 1

            # Procesowanie sekcji Main Section
            hero_data["mainSection"] = {
                "backgroundURL": data.get('mainSection[backgroundURL]', [''])[0],
                "title1": data.get('mainSection[title1]', [''])[0],
                "title2": data.get('mainSection[title2]', [''])[0],
                "button1Text": data.get('mainSection[button1Text]', [''])[0],
                "button2Text": data.get('mainSection[button2Text]', [''])[0],
                "phoneNumber": data.get('mainSection[phoneNumber]', [''])[0],
                "email": data.get('mainSection[email]', [''])[0]
            }

            
            # Procesowanie sekcji Team
            # Tworzenie list dla ikon i linków

            hero_data["membersTeamSection"]["teamTitle"] = data.get('membersTeamSection[teamTitle]', [''])[0]
            hero_data["membersTeamSection"]["teamSubtitle"] = data.get('membersTeamSection[teamSubtitle]', [''])[0]

            index = 0
            member_social_icons = []
            member_social_links = []
            while f'membersTeamSection[members][{index}][name]' in data:
                social_icons = []
                social_links = []

                # Pobieranie ikon i linków dla obecnego członka
                icons = data.get(f'membersTeamSection[members][{index}][socialIcons][]', [])
                links = data.get(f'membersTeamSection[members][{index}][socialLinks][]', [])

                # Zakładamy, że liczba ikon i linków jest taka sama
                for i in range(len(icons)):
                    if i < len(links):  # Upewnij się, że istnieje link dla każdej ikony
                        social_icons.append(icons[i])
                        social_links.append(links[i])
                member_social_icons.append([social_icons])
                member_social_links.append([social_links])
                index += 1 
            
            icons = split_into_columns(member_social_icons)
            links = split_into_columns(member_social_links)

            index = 0
            while f'membersTeamSection[members][{index}][name]' in data:
                member = {
                    "name": data.get(f'membersTeamSection[members][{index}][name]', [''])[0],
                    "role": data.get(f'membersTeamSection[members][{index}][role]', [''])[0],
                    "imageURL": data.get(f'membersTeamSection[members][{index}][imageURL]', [''])[0],
                    "details": {
                        "biography": data.get(f'membersTeamSection[members][{index}][details][biography]', [''])[0],
                        "expirience": data.get(f'membersTeamSection[members][{index}][details][expirience]', [''])[0],
                        "projects": data.get(f'membersTeamSection[members][{index}][details][projects]', [''])[0],
                        "techniques": data.get(f'membersTeamSection[members][{index}][details][techniques]', [''])[0]
                    },
                    "socialIcons": icons[index],  # Dodajemy ikonę
                    "socialLinks": links[index]   # Dodajemy link
                }

                hero_data["membersTeamSection"]["members"].append(member)
                index += 1


            # Procesowanie sekcji Jumbotron
            hero_data["jumbotron"] = {
                "title1": data.get('jumbotron[title1]', [''])[0],
                "title2": data.get('jumbotron[title2]', [''])[0],
                "button1Text": data.get('jumbotron[button1Text]', [''])[0],
                "button2Text": data.get('jumbotron[button2Text]', [''])[0],
                "imageURL": data.get('jumbotron[imageURL]', [''])[0]
            }

            # Procesowanie sekcji Articles
            index = 0
            while f'latestArticles[{index}][title]' in data:
                article = {
                    "title": data.get(f'latestArticles[{index}][title]', [''])[0],
                    "category": data.get(f'latestArticles[{index}][category]', [''])[0],
                    "description1": data.get(f'latestArticles[{index}][description1]', [''])[0],
                    "description2": data.get(f'latestArticles[{index}][description2]', [''])[0],
                    "imageURL": data.get(f'latestArticles[{index}][imageURL]', [''])[0]
                }
                hero_data["latestArticles"].append(article)
                index += 1

            # Procesowanie sekcji Adventure
            hero_data["adventure"] = {
                "title1": data.get('adventure[title1]', [''])[0],
                "title2": data.get('adventure[title2]', [''])[0],
                "description": data.get('adventure[description]', [''])[0]
            }

            # Procesowanie sekcji Partners
            hero_data["partners"]["text1"] = data.get('partners[text1]', [''])[0]
            hero_data["partners"]["text2"] = data.get('partners[text2]', [''])[0]
            hero_data["partners"]["text3"] = data.get('partners[text3]', [''])[0]
            index = 0
            while f'partners[images][{index}]' in data:
                hero_data["partners"]["images"].append(data.get(f'partners[images][{index}]', [''])[0])
                index += 1

            # Procesowanie sekcji Video
            index = 0
            while f'video[videos][{index}]' in data:
                hero_data["video"]["videos"].append(data.get(f'video[videos][{index}]', [''])[0])
                hero_data["video"]["images"].append(data.get(f'video[images][{index}]', [''])[0])
                hero_data["video"]["titles"].append(data.get(f'video[titles][{index}]', [''])[0])
                index += 1

            # Zapis przetworzonych danych do pliku JSON
            save_hero(hero_data)

            return jsonify({'success': True, 'message': 'Dane zostały zapisane pomyślnie.'})

        except Exception as e:
            return jsonify({'success': False, 'message': f'Backend:, {str(e)}' })

    try:
        with open(HERO_JSON_PATH, 'r', encoding='utf-8') as json_file:
            data = json.load(json_file)

        return render_template('profile/pages/hero.html', json_data=data)

    except Exception as e:
        flash(f'Wystąpił błąd podczas wczytywania danych: {str(e)}', 'danger')
        return redirect(url_for('user.update_hero'))

# Ścieżka do katalogów
VIDEO_DIR = {
    'komputer': os.path.join('frontend/static/efekty/adds/galeria/video/komputer/'),
    'mobile': os.path.join('frontend/static/efekty/adds/galeria/video/mobile/'),
    'member_image': os.path.join('frontend/static/efekty/adds/hero/assets/'),
    'galeria': os.path.join('frontend/static/efekty/adds/galeria/assets/'),
    'main_background': os.path.join('frontend/static/efekty/adds/hero/assets/'),
    'jumbotron': os.path.join('frontend/static/efekty/adds/hero/assets/'),
    'partners': os.path.join('frontend/static/efekty/adds/hero/assets/loga/')
}

@user_bp.route('/change_hero_names_files', methods=['POST'])
@login_required
def change_file_name():
    old_name = request.args.get('old_name')
    new_name = request.args.get('new_name')
    file_type = request.args.get('type')

    if not old_name or not new_name or not file_type:
        return jsonify({"success": False, "message": "Invalid parameters"}), 400

    # Użycie instrukcji warunkowej do wyboru ścieżki
    if file_type in VIDEO_DIR:
        file_dir = VIDEO_DIR[file_type]
    else:
        return jsonify({"success": False, "message": "Invalid file type"}), 400

    # Stworzenie pełnej ścieżki do plików
    old_file_path = os.path.join(current_app.root_path, file_dir, old_name)
    new_file_path = os.path.join(current_app.root_path, file_dir, new_name)

    try:
        if os.path.exists(new_file_path):
            return jsonify({"success": False, "message": "New file name already exists"}), 400

        os.rename(old_file_path, new_file_path)
        return jsonify({"success": True})
    except Exception as e:
        current_app.logger.error(f"Error renaming file: {e}")
        return jsonify({"success": False, "message": "Error renaming file"}), 500


@user_bp.route('/delete_hero_files', methods=['POST'])
@login_required
def delete_file():
    file_name = request.args.get('file_name')
    file_type = request.args.get('type')

    if not file_name or not file_type:
        return jsonify(success=False, error="Invalid parameters"), 400

    # Wybierz odpowiednią ścieżkę na podstawie typu pliku
    if file_type not in VIDEO_DIR:
        return jsonify(success=False, error="Invalid file type"), 400

    file_dir = VIDEO_DIR[file_type]
    file_path = os.path.join(current_app.root_path, file_dir, file_name)

    if not os.path.exists(file_path):
        return jsonify(success=False, error="File does not exist"), 404

    try:
        os.remove(file_path)
        return jsonify(success=True, message="File deleted successfully")
    except Exception as e:
        current_app.logger.error(f"Error deleting file: {e}")
        return jsonify(success=False, error="Error deleting file"), 500

@user_bp.route('/upload_hero_video', methods=['POST'])
@login_required
def upload_video():
    video_type = request.args.get('type')
    
    # Sprawdzenie, czy typ pliku jest obsługiwany
    if video_type not in VIDEO_DIR:
        return jsonify(success=False, error="Invalid video type"), 400
    
    # Sprawdzenie, czy plik został przesłany
    if 'file' not in request.files:
        return jsonify(success=False, error="No file provided"), 400

    file = request.files['file']
    
    # Sprawdzenie, czy wybrano plik do przesłania
    if file.filename == '':
        return jsonify(success=False, error="No selected file"), 400

    # Pobranie odpowiedniej ścieżki do zapisu pliku na podstawie typu
    file_dir = VIDEO_DIR[video_type]
    file_path = os.path.join(current_app.root_path, file_dir, file.filename)
    
    try:
        # Zapisanie pliku na dysku
        file.save(file_path)
        return jsonify(success=True, filePath=file_path)
    except Exception as e:
        # Obsługa błędów podczas zapisu pliku
        current_app.logger.error(f"Error saving file: {e}")
        return jsonify(success=False, error=str(e)), 500


@user_bp.route('/browse_hero_files', methods=['GET'])
@login_required
def browse_files():
    video_type = request.args.get('type')
    print(f"Requested video type: {video_type}")
    
    # Sprawdzenie, czy typ pliku jest obsługiwany
    if video_type not in VIDEO_DIR:
        return jsonify(success=False, error="Invalid video type"), 400

    directory = VIDEO_DIR[video_type]
    print(f"Accessing directory: {directory}")

    # Sprawdzenie, czy katalog istnieje
    if not os.path.exists(directory):
        return jsonify(success=False, error="Directory does not exist"), 404

    try:
        # Pobranie listy plików z katalogu
        files = os.listdir(directory)
        print(f"Files found: {files}")
        return jsonify(success=True, files=files)
    except FileNotFoundError:
        return jsonify(success=False, error="Directory not found"), 404
    except PermissionError:
        return jsonify(success=False, error="Permission denied"), 403
    except Exception as e:
        print(f"Error browsing files: {str(e)}")
        return jsonify(success=False, error="An unexpected error occurred"), 500
    
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
