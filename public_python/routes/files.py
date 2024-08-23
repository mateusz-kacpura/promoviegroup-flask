from flask import Blueprint, send_from_directory
import os

files_bp = Blueprint('files', __name__)

def register_directory_route(directory_path, route_url, endpoint):
    """Rejestracja trasy dla katalogu."""
    @files_bp.route(route_url + '/<path:filename>', endpoint=endpoint)
    def serve_files(filename):
        return send_from_directory(directory_path, filename)

def register_file_route(file_path, route_url, endpoint):
    """Rejestracja trasy dla pojedynczego pliku."""
    @files_bp.route(route_url, endpoint=endpoint)
    def serve_file():
        return send_from_directory(os.path.dirname(file_path), os.path.basename(file_path))

# Rejestracja tras dla katalogów
register_directory_route('frontend/static/efekty/adds/galeria/assets', '/efekty/adds/galeria/assets', 'galeria_assets')
register_directory_route('frontend/static/efekty/adds/galeria/rolki', '/efekty/adds/galeria/rolki', 'reels_assets')
register_directory_route('frontend/static/efekty/adds/galeria/video', '/efekty/adds/galeria/video', 'galeria_video')
register_directory_route('frontend/static/efekty/adds/hero/img', '/efekty/adds/hero/img', 'hero_img')
register_directory_route('frontend/static/efekty/adds/oferta/images', '/efekty/adds/oferta/images', 'oferta_images')
register_directory_route('frontend/static/efekty/adds/opinie/images', '/efekty/adds/opinie/images', 'opinie_images')
register_directory_route('frontend/static/efekty/adds/testimonials/img', '/efekty/adds/testimonials/img', 'testimonials_img')
register_directory_route('frontend/static/efekty/adds/testimonials-grid-section-frontendmentor/images', '/efekty/adds/testimonials-grid-section-frontendmentor/images', 'testimonials_grid_section_images')
register_directory_route('frontend/static/efekty/adds/workers/img', '/efekty/adds/workers/img', 'workers_img')
register_directory_route('frontend/static/efekty/adds/hero/assets', '/efekty/adds/hero/assets', 'hero_assets')
register_directory_route('frontend/static/efekty/adds/hero/assets/video', '/efekty/adds/hero/assets/video', 'hero_assets_video')
register_directory_route('frontend/static/efekty/adds/hero/assets/mobile', '/efekty/adds/hero/assets/mobile', 'hero_assets_mobile')
register_directory_route('frontend/static/efekty/adds/hero/assets/loga', '/efekty/adds/hero/assets/loga', 'hero_loga')
# frontend/templates/index/js
# efekty/adds/hero/assets/video/Screenshot 2024-05-17 at 14-08-14 Orły Polska Fundacja Promocji i Wspierania Sportu.png

# Rejestracja tras dla plików
register_file_route('frontend/static/full_logo.png', '/full_logo.png', 'full_logo')
register_file_route('frontend/static/logo_1080p.mp4', '/logo_1080p.mp4', 'logo_1080p')
register_file_route('frontend/static/logo.svg', '/logo.svg', 'logo_svg')

