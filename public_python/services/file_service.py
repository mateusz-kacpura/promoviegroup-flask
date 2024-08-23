import json

def write_to_file(data, file_path):
    try:
        with open(file_path, 'a') as file:
            json.dump(data, file)
            file.write('\n')
    except Exception as e:
        print(f"Error writing to file: {e}")