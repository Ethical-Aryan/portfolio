from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import mysql.connector
import os
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Admin Configuration
ADMIN_USERNAME = 'admin'
# Change this in production or use environment variable
ADMIN_PASSWORD_HASH = generate_password_hash('aryan2025') 

# MySQL Configuration
db_config = {
    'user': 'root', # Replace with your MySQL username
    'password': '', # Replace with your MySQL password
    'host': 'localhost',
    'database': 'portfolio',
    'autocommit': True
}

def get_db_connection():
    try:
        conn = mysql.connector.connect(**db_config)
        return conn
    except mysql.connector.Error as err:
        print(f"Error connecting to MySQL Database: {err}")
        return None

def init_db():
    try:
        # Connect without database first to create it if it doesn't exist
        conn = mysql.connector.connect(
            host=db_config['host'],
            user=db_config['user'],
            password=db_config['password'],
            autocommit=True
        )
        cursor = conn.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_config['database']}")
        cursor.close()
        conn.close()

        # Connect to the database and create the table
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS client_projects (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    client_name VARCHAR(100) NOT NULL,
                    category VARCHAR(50) NOT NULL,
                    description TEXT NOT NULL,
                    tech_stack VARCHAR(255),
                    live_url VARCHAR(255),
                    image_url VARCHAR(255),
                    year VARCHAR(4),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Check if we need to seed initial data (the two e-commerce projects)
            cursor.execute("SELECT COUNT(*) FROM client_projects")
            if cursor.fetchone()[0] == 0:
                print("Seeding initial projects...")
                seed_data = [
                    ('The Core Originals', 'E-Commerce', 'A full-featured e-commerce platform for a fashion/accessories brand. Built with Flask & MySQL, featuring product management, cart, checkout, and Razorpay payment integration.', 'Python, Flask, MySQL, Razorpay', 'https://thecoreoriginals.com', '', '2025'),
                    ('Dosutra', 'E-Commerce', 'A modern e-commerce web application with a clean UI, dynamic product categories, admin dashboard, and full order management system. Mobile-first design.', 'Python, Flask, MySQL, JavaScript', 'https://dosutra.com', '', '2025')
                ]
                cursor.executemany('''
                    INSERT INTO client_projects 
                    (client_name, category, description, tech_stack, live_url, image_url, year) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                ''', seed_data)
                
            cursor.close()
            conn.close()
            print("Database initialized successfully.")
    except Exception as e:
        print(f"Database initialization failed: {e}")

# Initialize DB on startup
init_db()

@app.route('/')
def index():
    conn = get_db_connection()
    projects = []
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM client_projects ORDER BY created_at ASC")
        projects = cursor.fetchall()
        cursor.close()
        conn.close()
    return render_template('index.html', is_admin='admin_logged_in' in session, projects=projects)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if username == ADMIN_USERNAME and check_password_hash(ADMIN_PASSWORD_HASH, password):
            session['admin_logged_in'] = True
            return redirect(url_for('admin_dashboard'))
        else:
            return render_template('login.html', error='Invalid credentials')
            
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('admin_logged_in', None)
    return redirect(url_for('index'))

@app.route('/admin')
def admin_dashboard():
    if 'admin_logged_in' not in session:
        return redirect(url_for('login'))
        
    conn = get_db_connection()
    projects = []
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM client_projects ORDER BY created_at DESC")
        projects = cursor.fetchall()
        cursor.close()
        conn.close()
        
    return render_template('admin.html', projects=projects)

# API endpoint to handle fetching, adding, editing, deleting projects
@app.route('/api/projects', methods=['GET', 'POST', 'PUT', 'DELETE'])
def api_projects():
    if 'admin_logged_in' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
        
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection error'}), 500
        
    cursor = conn.cursor(dictionary=True)
    
    if request.method == 'GET':
        cursor.execute("SELECT * FROM client_projects ORDER BY created_at DESC")
        projects = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(projects)
        
    elif request.method == 'POST':
        data = request.json
        try:
            cursor.execute('''
                INSERT INTO client_projects 
                (client_name, category, description, tech_stack, live_url, image_url, year) 
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            ''', (data['clientName'], data['category'], data['description'], 
                 data.get('techStack', ''), data.get('liveUrl', ''), 
                 data.get('imageUrl', ''), data.get('year', '')))
            new_id = cursor.lastrowid
            cursor.close()
            conn.close()
            return jsonify({'id': new_id, 'message': 'Project added successfully'})
        except Exception as e:
            return jsonify({'error': str(e)}), 400
            
    elif request.method == 'PUT':
        data = request.json
        try:
            cursor.execute('''
                UPDATE client_projects 
                SET client_name=%s, category=%s, description=%s, tech_stack=%s, 
                    live_url=%s, image_url=%s, year=%s 
                WHERE id=%s
            ''', (data['clientName'], data['category'], data['description'], 
                 data.get('techStack', ''), data.get('liveUrl', ''), 
                 data.get('imageUrl', ''), data.get('year', ''), data['id']))
            cursor.close()
            conn.close()
            return jsonify({'message': 'Project updated successfully'})
        except Exception as e:
            return jsonify({'error': str(e)}), 400
            
    elif request.method == 'DELETE':
        project_id = request.json.get('id')
        try:
            cursor.execute("DELETE FROM client_projects WHERE id=%s", (project_id,))
            cursor.close()
            conn.close()
            return jsonify({'message': 'Project deleted successfully'})
        except Exception as e:
            return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
