import json
import os
import logging

def write_to_file(entry, file_path):
    # Odczyt istniejących danych z pliku JSON lub utworzenie nowej listy
    data_list = []
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r') as file:
                data_list = json.load(file)
        except json.JSONDecodeError:
            logging.error('Błąd dekodowania JSON podczas odczytu pliku')
        except Exception as e:
            logging.error(f'Błąd odczytu pliku: {e}')
    
    # Dodanie nowego wpisu do listy
    data_list.append(entry)

    # Zapis całej listy z nowym wpisem do pliku
    try:
        with open(file_path, 'w') as file:
            json.dump(data_list, file, indent=4)
    except Exception as e:
        logging.error(f'Błąd podczas zapisu do pliku: {e}')
