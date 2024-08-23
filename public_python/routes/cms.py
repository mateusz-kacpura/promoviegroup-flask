from flask import Blueprint, render_template, request, redirect, url_for
from flask_login import login_required
from services.cms_service import create_post, get_posts

cms_bp = Blueprint('cms', __name__)

@cms_bp.route('/admin')
@login_required
def admin_dashboard():
    posts = get_posts()
    return render_template('admin_dashboard.html', posts=posts)

@cms_bp.route('/admin/post/new', methods=['GET', 'POST'])
@login_required
def new_post():
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        create_post(title, content)
        return redirect(url_for('cms.admin_dashboard'))
    return render_template('new_post.html')