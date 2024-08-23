import requests
import os
import json

def get_location(ip_address):
    try:
        response = requests.get(f"http://ipapi.co/{ip_address}/json/")
        data = response.json()
        return {
            "ip": ip_address,
            "city": data.get("city"),
            "region": data.get("region"),
            "country": data.get("country_name"),
            "latitude": data.get("latitude"),
            "longitude": data.get("longitude"),
        }
    except Exception as e:
        return {"ip": ip_address, "city": None, "region": None, "country": None, "latitude": None, "longitude": None}

def save_visitor_info(visitor_info):
    file_path = "baza_danych/visitors.json"
    
    if not os.path.exists(file_path):
        with open(file_path, 'w') as f:
            json.dump([], f)

    with open(file_path, 'r') as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            data = []

    data.append(visitor_info)

    with open(file_path, 'w') as f:
        json.dump(data, f, indent=4)

def ensure_dir_exists(file_path):
    directory = os.path.dirname(file_path)
    if not os.path.exists(directory):
        os.makedirs(directory)

def write_to_file(entry, file_path):
    ensure_dir_exists(file_path)
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r+', encoding='utf-8') as file:
                try:
                    data = json.load(file)
                except json.JSONDecodeError:
                    data = []
                data.append(entry)
                file.seek(0)
                json.dump(data, file, ensure_ascii=False, indent=4)
                file.truncate()
        except IOError as e:
            print(f"Błąd przy otwieraniu pliku: {e}")
    else:
        try:
            with open(file_path, 'w', encoding='utf-8') as file:
                json.dump([entry], file, ensure_ascii=False, indent=4)
        except IOError as e:
            print(f"Błąd przy tworzeniu pliku: {e}")
