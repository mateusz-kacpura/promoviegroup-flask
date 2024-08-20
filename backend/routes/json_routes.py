from flask import Blueprint, jsonify
from services.json_service import load_json_file

json_bp = Blueprint('json_routes', __name__)

# Ścieżka do pliku JSON
JSON_FILE_PATH = 'baza_danych/hero.json'

@json_bp.route('/get-json', methods=['GET'])
def get_json():
    """Trasa do pobrania pliku JSON."""
    data = load_json_file(JSON_FILE_PATH)
    return jsonify(data)
