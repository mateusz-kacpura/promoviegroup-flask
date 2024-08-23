from flask import Blueprint, jsonify, request
from services.json_service import load_json_file
import os

json_bp = Blueprint('json_routes', __name__)

# Ścieżka do pliku JSON
JSON_DIRECTORY = 'baza_danych'

@json_bp.route('/get-json', methods=['GET'])
def get_json():
    """Trasa do pobrania pliku JSON na podstawie parametru file."""
    file_name = request.args.get('file')
    if not file_name:
        return jsonify({"error": "Parametr file jest wymagany"}), 400

    file_path = os.path.join(JSON_DIRECTORY, file_name)
    
    if not os.path.exists(file_path):
        return jsonify({"error": "Plik nie został znaleziony"}), 404
    
    try:
        data = load_json_file(file_path)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500