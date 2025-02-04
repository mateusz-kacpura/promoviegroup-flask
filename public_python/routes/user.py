from flask import Blueprint, render_template, send_from_directory, abort, request, redirect, url_for, jsonify, current_app, flash
from flask_login import UserMixin, login_required, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
from models.user import User
import json
import os

user_bp = Blueprint('user', __name__, url_prefix='/user', template_folder='templates')

@user_bp.route('/admin')
@login_required
def admin():
    return render_template('admin.html', user=current_user, section='home')

@user_bp.route('/admin/dashboard/<section>')
@login_required
def admin_section(section):
    return render_template('admin.html', user=current_user, section=section)

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

@user_bp.route('/admin/dashboard/hero', methods=['GET', 'POST'])
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

        return render_template('admin/dashboard/hero.html', json_data=data)

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
    'partners': os.path.join('frontend/static/efekty/adds/hero/assets/loga/'),
    'video': os.path.join('frontend/static/efekty/adds/hero/assets/video/')
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

@user_bp.route('/admin/dashboard/mail', methods=['GET'])
@login_required
def display_mail():
    try:
        with open(MAIL_JSON_PATH, 'r', encoding='utf-8') as json_file:
            mails = json.load(json_file)
    except (FileNotFoundError, json.JSONDecodeError):
        mails = []

    return render_template('admin/dashboard/mail.html', mails=mails)

@user_bp.route('/admin/dashboard/delete_mail', methods=['POST'])
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
VISITORS_PER_PAGE = 10  # Number of visitors per page

@user_bp.route('/admin/dashboard/visitors', methods=['GET'])
@login_required
def display_visitors():
    page = int(request.args.get('page', 1))
    start = (page - 1) * VISITORS_PER_PAGE
    end = start + VISITORS_PER_PAGE

    try:
        with open(VISITORS_JSON_PATH, 'r', encoding='utf-8') as json_file:
            visitors = json.load(json_file)
        
        total_visitors = len(visitors)
        total_dashboard = (total_visitors + VISITORS_PER_PAGE - 1) // VISITORS_PER_PAGE

        visitors_to_display = visitors[start:end]

    except (FileNotFoundError, json.JSONDecodeError):
        visitors_to_display = []
        total_dashboard = 1

    return render_template('admin/dashboard/visitors.html', visitors=visitors_to_display, page=page, total_dashboard=total_dashboard)

@user_bp.route('/admin/dashboard/delete_visitor', methods=['POST'])
@login_required
def delete_visitor():
    id_to_delete = request.form.get('id')

    if not id_to_delete:
        return jsonify({'status': 'error', 'message': 'No ID provided'}), 400

    try:
        with open(VISITORS_JSON_PATH, 'r+', encoding='utf-8') as json_file:
            visitors = json.load(json_file)
            
            # Filter out the visitor with the given ID
            visitors = [visitor for visitor in visitors if visitor.get('id') != id_to_delete]
            
            # Write the updated list back to the file
            json_file.seek(0)
            json.dump(visitors, json_file, ensure_ascii=False, indent=4)
            json_file.truncate()
        
        return redirect(url_for('user.display_visitors'))
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error occurred: {e}")  # Replace with a proper logger in production
        return jsonify({'status': 'error', 'message': 'Failed to delete visitor'}), 500

@user_bp.route('/admin/dashboard/delete_selected_visitors', methods=['POST'])
@login_required
def delete_selected_visitors():
    ids_to_delete = request.form.getlist('ids')

    if not ids_to_delete:
        return jsonify({'status': 'error', 'message': 'No IDs provided'}), 400

    try:
        with open(VISITORS_JSON_PATH, 'r+', encoding='utf-8') as json_file:
            visitors = json.load(json_file)
            
            # Filter out visitors with the given IDs
            visitors = [visitor for visitor in visitors if visitor.get('id') not in ids_to_delete]
            
            # Write the updated list back to the file
            json_file.seek(0)
            json.dump(visitors, json_file, ensure_ascii=False, indent=4)
            json_file.truncate()
        
        return redirect(url_for('user.display_visitors'))
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error occurred: {e}")  # Replace with a proper logger in production
        return jsonify({'status': 'error', 'message': 'Failed to delete selected visitors'}), 500

@user_bp.route('/admin/dashboard/delete_all_visitors', methods=['POST'])
@login_required
def delete_all_visitors():
    try:
        open(VISITORS_JSON_PATH, 'w').close()  # Clear the file content by reopening it in write mode

        return redirect(url_for('user.display_visitors'))
    except Exception as e:
        print(f"Error occurred: {e}")  # Replace with a proper logger in production
        return jsonify({'status': 'error', 'message': 'Failed to delete all visitors'}), 500


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

@user_bp.route('/admin/dashboard/opinie', methods=['GET', 'POST'])
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
    return render_template('admin/dashboard/opinie.html', user=current_user, data=opinie_data)

@user_bp.route('/admin/dashboard/users')
@login_required
def user_list():
    users = User.load_all_users()
    return render_template('admin/dashboard/users.html', users=users.values(), registration_enabled=current_app.config['REGISTRATION_ENABLED'])

@user_bp.route('/admin/dashboard/delete_user/<uuid>', methods=['POST'])
@login_required
def delete_user(uuid):
    print("delete")
    user = User.get_by_uuid(uuid)
    if user is None:
        return jsonify(success=False, message='User not found'), 404

    password = request.form.get('password')
    if not check_password_hash(current_user.password, password):
        return jsonify(success=False, message='Invalid password'), 400

    if User.delete(uuid):
        return jsonify(success=True, message='User deleted successfully'), 200
    else:
        return jsonify(success=False, message='User deletion failed'), 500


@user_bp.route('/admin/dashboard/edit_user/<uuid>', methods=['POST'])
@login_required
def edit_user(uuid):
    user = User.get_by_uuid(uuid)
    if user is None:
        return jsonify(success=False, message='User not found'), 404

    try:
        new_username = request.form['username']
        new_password = request.form.get('password', None)
        hashed_password = generate_password_hash(new_password) if new_password else None

        if User.update_user(uuid, new_username, hashed_password):
            return jsonify(success=True)
        else:
            return jsonify(success=False, message='Failed to update user'), 500
    except Exception as e:
        return jsonify(success=False, message=str(e)), 500

@user_bp.route('/admin/dashboard//toggle_registration', methods=['POST'])
@login_required
def toggle_registration():
    current_status = current_app.config['REGISTRATION_ENABLED']
    current_app.config['REGISTRATION_ENABLED'] = not current_status
    flash('User registration has been {}'.format('enabled' if not current_status else 'disabled'), 'success')
    return redirect(url_for('user.user_list'))

OFERTA_JSON_PATH = os.path.join('baza_danych', 'oferta.json')

# Mapping Polish month names to English month names
MONTHS_TO_ENGLISH = {
    'stycznia': 'January', 'lutego': 'February', 'marca': 'March', 'kwietnia': 'April',
    'maja': 'May', 'czerwca': 'June', 'lipca': 'July', 'sierpnia': 'August',
    'września': 'September', 'października': 'October', 'listopada': 'November', 'grudnia': 'December'
}

# Reverse mapping from English month names to Polish month names
ENGLISH_TO_MONTHS = {v: k for k, v in MONTHS_TO_ENGLISH.items()}

def convert_month_name_to_english(date_string):
    for pl_month, en_month in MONTHS_TO_ENGLISH.items():
        if pl_month in date_string:
            return date_string.replace(pl_month, en_month)
    return date_string

def convert_month_name_to_polish(date_string):
    for en_month, pl_month in ENGLISH_TO_MONTHS.items():
        if en_month in date_string:
            return date_string.replace(en_month, pl_month)
    return date_string

def format_date(date_string, to_english=True):
    """Convert date format with optional language conversion."""
    if to_english:
        # Convert from Polish month names to English
        date_string = convert_month_name_to_english(date_string)
        # Convert date from format "25 April 2019" to "2019-04-25"
        return datetime.strptime(date_string, "%d %B %Y").strftime("%Y-%m-%d")
    else:
        # Convert date from format "2019-04-25" to "25 kwietnia 2019"
        dt = datetime.strptime(date_string, "%Y-%m-%d")
        date_string = dt.strftime("%d %B %Y")
        return convert_month_name_to_polish(date_string)

def update_dates_in_posts(data, to_english=True):
    """Aktualizuje format dat w postach na blogu."""
    if 'blog' in data and 'posts' in data['blog']:
        for post in data['blog']['posts']:
            post['date'] = format_date(post['date'], to_english)
    return data

def load_offer_data():
    """Ładuje dane z pliku JSON."""
    if os.path.exists(OFERTA_JSON_PATH):
        with open(OFERTA_JSON_PATH, 'r', encoding='utf-8') as f:
            return update_dates_in_posts(json.load(f), to_english=True)
    return {}

def save_offer_data(data):
    """Zapisuje dane do pliku JSON."""
    # Convert dates back to Polish format before saving
    updated_data = update_dates_in_posts(data, to_english=False)
    with open(OFERTA_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(updated_data, f, ensure_ascii=False, indent=4)

def update_section(data, form_data, section_name):
    """Aktualizuje sekcję danych na podstawie formularza."""
    for key, value in form_data.items():
        if key.startswith(f'{section_name}['):
            sub_key = key[len(section_name) + 1:-1]  # Usuwa "section_name[" z początku i "]" z końca
            data[section_name][sub_key] = value[0]

def update_services_section(oferta_data, form_data):
    services = []
    service_keys = [key for key in form_data.keys() if 'services[' in key and '][' in key]
    service_indices = sorted(set(int(key.split('[')[1].split(']')[0]) for key in service_keys))

    for idx in service_indices:
        service_data = {
            'icon': form_data.get(f'services[{idx}][icon]', [''])[0],
            'title': form_data.get(f'services[{idx}][title]', [''])[0],
            'description': form_data.get(f'services[{idx}][description]', [''])[0],
            'buttonText': form_data.get(f'services[{idx}][buttonText]', [''])[0],
            'services': form_data.get(f'services[{idx}][services]', [''])[0].split(', '),
            'details': {
                'additionalInfo': form_data.get(f'services[{idx}][details][additionalInfo]', [''])[0],
                'products': []
            }
        }

        product_keys = [key for key in form_data.keys() if f'services[{idx}][details][products][' in key]
        product_indices = sorted(set(int(key.split('[')[4].split(']')[0]) for key in product_keys))

        for p_idx in product_indices:
            product_data = {
                'name': form_data.get(f'services[{idx}][details][products][{p_idx}][name]', [''])[0],
                'price': form_data.get(f'services[{idx}][details][products][{p_idx}][price]', [''])[0],
                'details': form_data.get(f'services[{idx}][details][products][{p_idx}][details]', [''])[0],
            }
            service_data['details']['products'].append(product_data)

        services.append(service_data)

    oferta_data['services'] = services

@user_bp.route('/admin/dashboard/oferta', methods=['GET', 'POST'])
@login_required
def update_oferta():
    if request.method == 'POST':
        try:
            form_data = request.form.to_dict(flat=False)
            oferta_data = load_offer_data()

            # Aktualizacja sekcji "hero"
            update_section(oferta_data, form_data, 'hero')

            # Aktualizacja sekcji "services"
            update_services_section(oferta_data, form_data)

            # Aktualizacja pozostałych sekcji
            for section in ['contactSection', 'feature1', 'feature2', 'contactBanner', 'aboutUs']:
                if section in form_data:
                    update_section(oferta_data, form_data, section)

            # Aktualizacja sekcji "blog"
            if 'blog' in form_data:
                posts = []
                post_keys = [key for key in form_data.keys() if 'blog[posts]' in key]
                post_indices = sorted(set(int(key.split('[')[2].split(']')[0]) for key in post_keys))

                for idx in post_indices:
                    post_data = {
                        'image': form_data.get(f'blog[posts][{idx}][image]', [''])[0],
                        'title': form_data.get(f'blog[posts][{idx}][title]', [''])[0],
                        'date': form_data.get(f'blog[posts][{idx}][date]', [''])[0],
                        'content': form_data.get(f'blog[posts][{idx}][content]', [''])[0],
                        'buttonText': form_data.get(f'blog[posts][{idx}][buttonText]', [''])[0],
                        'buttonLink': form_data.get(f'blog[posts][{idx}][buttonLink]', [''])[0]
                    }
                    posts.append(post_data)

                oferta_data['blog']['posts'] = posts
                update_section(oferta_data['blog'], form_data, 'blog')

            save_offer_data(oferta_data)

            flash('Oferta została zaktualizowana pomyślnie!', 'success')
            return redirect(url_for('user.update_oferta'))

        except Exception as e:
            flash(f'Wystąpił błąd podczas aktualizacji oferty: {str(e)}', 'danger')
            return redirect(url_for('user.update_oferta'))

    current_offer = load_offer_data()
    return render_template('admin/dashboard/oferta.html', data=current_offer)

@user_bp.route('/upload_file', methods=['POST'])
@login_required
def upload_file():
    """
    Endpoint przyjmujący plik i zapisujący go w katalogu wybranym przez użytkownika.
    Oczekuje parametrów:
      - target: klucz określający docelowy katalog (np. 'member_image', 'partners', itd.)
      - file: przesłany plik (pole w formularzu)
    """
    # Pobranie parametru target z formularza (przekazywany przez FormData)
    target = request.form.get('target')
    if not target:
        return jsonify(success=False, error="Target directory not provided"), 400

    # Sprawdzenie czy target jest obsługiwany
    if target not in VIDEO_DIR:
        return jsonify(success=False, error="Invalid target directory"), 400

    # Sprawdzenie czy plik został przesłany
    if 'file' not in request.files:
        return jsonify(success=False, error="No file provided"), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify(success=False, error="No selected file"), 400

    # Ustal katalog docelowy na podstawie klucza target
    file_dir = VIDEO_DIR[target]
    full_dir = os.path.join(current_app.root_path, file_dir)

    # Upewnij się, że katalog istnieje – jeśli nie, utwórz go
    if not os.path.exists(full_dir):
        try:
            os.makedirs(full_dir)
        except Exception as e:
            current_app.logger.error(f"Error creating directory {full_dir}: {e}")
            return jsonify(success=False, error="Error creating directory"), 500

    # Stwórz pełną ścieżkę do zapisu pliku
    file_path = os.path.join(full_dir, file.filename)
    try:
        file.save(file_path)
        # Jeśli chcesz zwrócić URL, który będzie odpowiadał wpisom w Twoim frontendowym słowniku FILES,
        # możesz stworzyć mapowanie – poniżej przykład:
        FILES = {
            'komputer': '/static/efekty/adds/galeria/video/komputer/',
            'mobile': '/static/efekty/adds/galeria/video/mobile/',
            'member_image': '/static/efekty/adds/hero/assets/',
            'galeria': '/static/efekty/adds/galeria/assets/',
            'main_background': '/static/efekty/adds/hero/assets/',
            'jumbotron': '/static/efekty/adds/hero/assets/',
            'partners': '/static/efekty/adds/hero/assets/loga/',
            'video': '/static/efekty/adds/hero/assets/video/'
        }
        # Ustal URL pliku – zakładając, że pliki dostępne są przez statyczną ścieżkę
        file_url = os.path.join(FILES[target], file.filename)
        return jsonify(success=True, filePath=file_url)
    except Exception as e:
        current_app.logger.error(f"Error saving file: {e}")
        return jsonify(success=False, error=str(e)), 500
