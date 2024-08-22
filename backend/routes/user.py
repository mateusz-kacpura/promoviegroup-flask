from flask import Blueprint, render_template, request, redirect, url_for
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
        # Process form data and save to JSON file
        updated_data = request.form.to_dict(flat=False)
        
        hero_data = {
            "carouselItems": [],
            "mainSection": {
                "backgroundURL": updated_data['mainSection[backgroundURL]'][0],
                "title1": updated_data['mainSection[title1]'][0],
                "title2": updated_data['mainSection[title2]'][0],
                "button1Text": updated_data['mainSection[button1Text]'][0],
                "button2Text": updated_data['mainSection[button2Text]'][0],
                "phoneNumber": updated_data['mainSection[phoneNumber]'][0]
            }
        }

        for i in range(len(updated_data['carouselItems[0][videoSrc]'])):
            hero_data['carouselItems'].append({
                "videoSrc": updated_data[f'carouselItems[{i}][videoSrc]'][0],
                "videoMobileSrc": updated_data[f'carouselItems[{i}][videoMobileSrc]'][0],
                "maskColor": updated_data[f'carouselItems[{i}][maskColor]'][0],
                "heading": updated_data[f'carouselItems[{i}][heading]'][0],
                "subheading": updated_data[f'carouselItems[{i}][subheading]'][0],
                "buttons": [
                    {
                        "text": updated_data[f'carouselItems[{i}][buttons][0][text]'][0],
                        "url": updated_data[f'carouselItems[{i}][buttons][0][url]'][0],
                        "class": "btn-outline-light custom-btn"
                    }
                ]
            })

        try:
            with open(HERO_JSON_PATH, 'w', encoding='utf-8') as json_file:
                json.dump(hero_data, json_file, ensure_ascii=False, indent=4)
            return redirect(url_for('user.update_hero'))
        except IOError:
            # Handle file I/O errors
            pass

    try:
        with open(HERO_JSON_PATH, 'r', encoding='utf-8') as json_file:
            data = json.load(json_file)
    except (FileNotFoundError, json.JSONDecodeError):
        data = {}

    return render_template('profile/pages/hero.html', data=data)
