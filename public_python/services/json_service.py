import json

def load_json_file(file_path):
    """Wczytaj plik JSON i zwróć jego zawartość."""
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data
