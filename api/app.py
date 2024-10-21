import jwt
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tms.db'
app.config['SECRET_KEY'] = 'your_secret_key'  # Change this to a secure secret key
db = SQLAlchemy(app)

# ... (previous model definitions)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False)

# ... (other models)

with app.app_context():
    db.create_all()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['user_id']).first()
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        current_user = args[0]
        if current_user.role != 'admin':
            return jsonify({'message': 'Admin privileges required!'}), 403
        return f(*args, **kwargs)
    return decorated

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(username=data['username'], password=hashed_password, role=data['role'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Registered successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    auth = request.json
    if not auth or not auth.get('username') or not auth.get('password'):
        return jsonify({'message': 'Could not verify'}), 401
    user = User.query.filter_by(username=auth.get('username')).first()
    if user and check_password_hash(user.password, auth.get('password')):
        token = jwt.encode({'user_id': user.id, 'exp': datetime.utcnow() + timedelta(hours=24)},
                           app.config['SECRET_KEY'], algorithm="HS256")
        return jsonify({'token': token, 'role': user.role})
    return jsonify({'message': 'Could not verify'}), 401

# CRUD operations for Tenant
@app.route('/api/tenants', methods=['GET'])
@token_required
def get_tenants(current_user):
    tenants = Tenant.query.all()
    return jsonify([tenant.to_dict() for tenant in tenants])

@app.route('/api/tenants', methods=['POST'])
@token_required
def create_tenant(current_user):
    data = request.json
    new_tenant = Tenant(**data)
    db.session.add(new_tenant)
    db.session.commit()
    return jsonify(new_tenant.to_dict()), 201

@app.route('/api/tenants/<int:id>', methods=['PUT'])
@token_required
def update_tenant(current_user, id):
    tenant = Tenant.query.get_or_404(id)
    data = request.json
    for key, value in data.items():
        setattr(tenant, key, value)
    db.session.commit()
    return jsonify(tenant.to_dict())

@app.route('/api/tenants/<int:id>', methods=['DELETE'])
@token_required
@admin_required
def delete_tenant(current_user, id):
    tenant = Tenant.query.get_or_404(id)
    db.session.delete(tenant)
    db.session.commit()
    return jsonify({'message': 'Tenant deleted successfully'})

# Similar CRUD operations for Landlord and Property...

@app.route('/api/report', methods=['GET'])
@token_required
def generate_report(current_user):
    report = {
        'total_tenants': Tenant.query.count(),
        'total_landlords': Landlord.query.count(),
        'total_properties': Property.query.count(),
        'occupied_properties': Property.query.filter_by(is_occupied=True).count(),
        'vacant_properties': Property.query.filter_by(is_occupied=False).count(),
        'total_rent': sum(tenant.rent_amount for tenant in Tenant.query.all()),
        'late_payments': Tenant.query.filter(Tenant.due_date < datetime.now()).count()
    }
    return jsonify(report)

@app.errorhandler(404)
def not_found(error):
    return jsonify({'message': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'message': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True)