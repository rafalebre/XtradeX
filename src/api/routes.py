import os
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product, Service, Message, Trade, ProductCategory, ProductSubcategory, ServiceCategory, ServiceSubcategory
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from werkzeug.security import check_password_hash
from datetime import datetime
from datetime import timedelta
from dateutil import parser
from requests import Request, Session

api = Blueprint('api', __name__)

@api.route('/register', methods=['POST'])
def register():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    if not email:
        return jsonify({"msg": "Missing email parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400
    
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"msg": "A user with this email already exists"}), 400

    new_user = User()
    new_user.email = email
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    # Cria um token de acesso para o novo usuário logo após seu registro
    access_token = create_access_token(identity=email, expires_delta=timedelta(minutes=60))

    # Criar um dicionário para representar o novo usuário
    user_dict = new_user.to_dict()
    
    return jsonify({"msg": "User created successfully", "user": user_dict, "access_token": access_token}), 201


@api.route('/login', methods=['POST'])
def login():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    if not email:
        return jsonify({"msg": "Missing email parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"msg": "Bad username or password"}), 401

    # removendo a senha do usuário
    user_dict = user.to_dict()
    access_token = create_access_token(identity=email, expires_delta=timedelta(minutes=60))
    return jsonify(access_token=access_token, user=user_dict)

@api.route('/profile', methods=['GET'])
@jwt_required()
def print_user_info():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(user.to_dict()), 200

@api.route('/user/me', methods=['GET'])
@jwt_required()
def get_user_info():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(user.to_dict()), 200

@api.route('/user/me', methods=['DELETE'])
@jwt_required()
def delete_user_info():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"msg": "User deleted"}), 200
    

@api.route('/user/me', methods=['PUT'])
@jwt_required()
def update_user_info():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json()

    if not data:
        return jsonify({"msg": "Missing JSON in request"}), 400

    # Verificar se o username já existe
    if "username" in data:
        existing_user = User.query.filter_by(username=data["username"]).first()
        if existing_user and existing_user.email != user_email:
            return jsonify({"msg": "Username already in use"}), 400

    for field in ["first_name", "last_name", "username"]:
        if field in data:
            setattr(user, field, data[field])
        elif getattr(user, field) is None:  # check if field is required and not set
            return jsonify({f"msg": f"Missing {field} parameter"}), 400

    optional_fields = ["gender", "birth_date", "phone", "location", "latitude", "longitude", "image_url"]
    for field in optional_fields:
        if field in data and data[field] != '':
            setattr(user, field, data[field])

    db.session.commit()

    return jsonify({"msg": "User information updated successfully"}), 200



@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_email = get_jwt_identity()
    current_user = User.query.filter_by(email=current_user_email).first()
    return jsonify(logged_in_as=current_user.to_dict()), 200


@api.route('/products', methods=['GET'])
def get_products():
    category_id = request.args.get('category_id')
    subcategory_id = request.args.get('subcategory_id')

    top_left_lat = request.args.get('top_left_lat')
    top_left_long = request.args.get('top_left_long')
    bottom_right_lat = request.args.get('bottom_right_lat')
    bottom_right_long = request.args.get('bottom_right_long')

    # convert to float
    if top_left_lat and top_left_long and bottom_right_lat and bottom_right_long:
        top_left_lat = float(top_left_lat)
        top_left_long = float(top_left_long)
        bottom_right_lat = float(bottom_right_lat)
        bottom_right_long = float(bottom_right_long)

    query = Product.query

    if category_id:
        query = query.filter_by(category_id=category_id)

    if subcategory_id:
        query = query.filter_by(subcategory_id=subcategory_id)

    # filter the products based on location
    if top_left_lat and top_left_long and bottom_right_lat and bottom_right_long:
        query = query.filter(
            Product.latitude <= top_left_lat,
            Product.latitude >= bottom_right_lat,
            Product.longitude >= top_left_long,
            Product.longitude <= bottom_right_long
        )

    products = query.all()
    return jsonify([product.to_dict() for product in products])



@api.route('/products', methods=['POST'])
@jwt_required()
def create_product():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json()

    if not data:
        return jsonify({"msg": "Missing JSON in request"}), 400

    required_fields = ["name", "description", "category", "condition", "currency" ]
    for field in required_fields:
        if field not in data:
            return jsonify({"msg": f"Missing {field} parameter"}), 400

    category_id = data['category']
    subcategory_id = data['subcategory']

    category = ProductCategory.query.get(category_id)
    subcategory = ProductSubcategory.query.get(subcategory_id)

    if not category or not subcategory:
        return jsonify({"msg": "Category or Subcategory not found"}), 404

    estimated_value = float(data['estimated_value'].replace(',', '.')) if 'estimated_value' in data else None

    new_product = Product(
        user_id=user.id,
        name=data['name'],
        description=data['description'],
        category_id=category.id,
        subcategory_id=subcategory.id,
        condition=data['condition'],
        currency=data['currency'],
        estimated_value=estimated_value,
        location=data['location'],
        latitude=data.get('latitude'),
        longitude=data.get('longitude'),
        image_url=data.get('image_url') # Aqui recebemos a URL da imagem do front-end
    )

    db.session.add(new_product)
    db.session.commit()

    return jsonify(new_product.to_dict()), 201


@api.route('/products/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json()

    if not data:
        return jsonify({"msg": "Missing JSON in request"}), 400

    product = Product.query.get(product_id)

    if not product:
        return jsonify({"msg": "Product not found"}), 404

    for key, value in data.items():
        setattr(product, key, value)

    db.session.commit()

    return jsonify(product.to_dict()), 200

@api.route('/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    product = Product.query.get(product_id)

    if not product:
        return jsonify({"msg": "Product not found"}), 404

    db.session.delete(product)
    db.session.commit()

    return jsonify({"msg": "Product deleted"}), 200


@api.route('/product-categories', methods=['GET'])
def get_product_categories():
    categories = ProductCategory.query.all()
    return jsonify([category.to_dict() for category in categories]), 200

@api.route('/product-subcategories', methods=['GET'])
def get_product_subcategories():
    category_id = request.args.get('category_id')
    if category_id:
        subcategories = ProductSubcategory.query.filter_by(category_id=category_id).all()
    else:
        subcategories = ProductSubcategory.query.all()
    return jsonify([subcategory.to_dict() for subcategory in subcategories]), 200

@api.route('/product-categories/<int:category_id>/subcategories', methods=['GET'])
def get_product_subcategories_by_category(category_id):
    subcategories = ProductSubcategory.query.filter_by(category_id=category_id).all()
    return jsonify([subcategory.to_dict() for subcategory in subcategories]), 200

@api.route('/services', methods=['GET'])
def get_services():
    category_id = request.args.get('category_id')
    subcategory_id = request.args.get('subcategory_id')

    top_left_lat = request.args.get('top_left_lat')
    top_left_long = request.args.get('top_left_long')
    bottom_right_lat = request.args.get('bottom_right_lat')
    bottom_right_long = request.args.get('bottom_right_long')

    # convert to float
    if top_left_lat and top_left_long and bottom_right_lat and bottom_right_long:
        top_left_lat = float(top_left_lat)
        top_left_long = float(top_left_long)
        bottom_right_lat = float(bottom_right_lat)
        bottom_right_long = float(bottom_right_long)

    query = Service.query

    if category_id:
        query = query.filter_by(category_id=category_id)

    if subcategory_id:
        query = query.filter_by(subcategory_id=subcategory_id)

    # filter the services based on location, excluding online services
    if top_left_lat and top_left_long and bottom_right_lat and bottom_right_long:
        query = query.filter(
            Service.latitude <= top_left_lat,
            Service.latitude >= bottom_right_lat,
            Service.longitude >= top_left_long,
            Service.longitude <= bottom_right_long,
            Service.online == False   # this is just a placeholder condition, replace with your actual condition
        )

    services = query.all()
    return jsonify([service.to_dict() for service in services])



@api.route('/services', methods=['POST'])
@jwt_required()
def create_service():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json()

    if not data:
        return jsonify({"msg": "Missing JSON in request"}), 400

    required_fields = ["name", "description", "category", "currency"]
    for field in required_fields:
        if field not in data:
            return jsonify({"msg": f"Missing {field} parameter"}), 400

    category_id = data['category']
    subcategory_id = data['subcategory']

    category = ServiceCategory.query.get(category_id)
    subcategory = ServiceSubcategory.query.get(subcategory_id)

    if not category or not subcategory:
        return jsonify({"msg": "Category or Subcategory not found"}), 404

    estimated_value = float(data['estimated_value'].replace(',', '.')) if 'estimated_value' in data else None

    new_service = Service(
        user_id=user.id,
        name=data['name'],
        description=data['description'],
        category_id=category.id,
        subcategory_id=subcategory.id,
        currency=data['currency'],
        estimated_value=estimated_value,
        online=data.get('online', False),  # novo campo
        location=(data['location'] if not data.get('online', False) else "online"),  # modificação
        latitude=(data.get('latitude') if not data.get('online', False) else None),  # modificação
        longitude=(data.get('longitude') if not data.get('online', False) else None),  # modificação
        image_url=data.get('image_url')
    )

    db.session.add(new_service)
    db.session.commit()

    return jsonify(new_service.to_dict()), 201

@api.route('/services/<int:service_id>', methods=['PUT'])
@jwt_required()
def update_service(service_id):
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json()

    if not data:
        return jsonify({"msg": "Missing JSON in request"}), 400

    service = Service.query.get(service_id)

    if not service:
        return jsonify({"msg": "Service not found"}), 404

    for key, value in data.items():
        setattr(service, key, value)

    db.session.commit()

    return jsonify(service.to_dict()), 200

@api.route('/services/<int:service_id>', methods=['DELETE'])
@jwt_required()
def delete_service(service_id):
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    service = Service.query.get(service_id)

    if not service:
        return jsonify({"msg": "Service not found"}), 404

    db.session.delete(service)
    db.session.commit()

    return jsonify({"msg": "Service deleted"}), 200

@api.route('/service-categories', methods=['GET'])
def get_service_categories():
    categories = ServiceCategory.query.all()
    return jsonify([category.to_dict() for category in categories]), 200

@api.route('/service-subcategories', methods=['GET'])
def get_service_subcategories():
    category_id = request.args.get('category_id')
    if category_id:
        subcategories = ServiceSubcategory.query.filter_by(category_id=category_id).all()
    else:
        subcategories = ServiceSubcategory.query.all()
    return jsonify([subcategory.to_dict() for subcategory in subcategories]), 200

@api.route('/service-categories/<int:category_id>/subcategories', methods=['GET'])
def get_service_subcategories_by_category(category_id):
    subcategories = ServiceSubcategory.query.filter_by(category_id=category_id).all()
    return jsonify([subcategory.to_dict() for subcategory in subcategories]), 200

@api.route('/items/search', methods=['GET'])
def search_items():
    name = request.args.get('name')
    top_left_lat = request.args.get('top_left_lat')
    top_left_long = request.args.get('top_left_long')
    bottom_right_lat = request.args.get('bottom_right_lat')
    bottom_right_long = request.args.get('bottom_right_long')

    # Convert to float
    if top_left_lat and top_left_long and bottom_right_lat and bottom_right_long:
        top_left_lat = float(top_left_lat)
        top_left_long = float(top_left_long)
        bottom_right_lat = float(bottom_right_lat)
        bottom_right_long = float(bottom_right_long)

    if not name:
        return jsonify({"msg": "Missing name parameter"}), 400

    query_product = Product.query.filter(Product.name.ilike(f'%{name}%'))
    query_service = Service.query.filter(Service.name.ilike(f'%{name}%'))

    # filter the products and services based on location
    if top_left_lat and top_left_long and bottom_right_lat and bottom_right_long:
        query_product = query_product.filter(
            Product.latitude <= top_left_lat,
            Product.latitude >= bottom_right_lat,
            Product.longitude >= top_left_long,
            Product.longitude <= bottom_right_long
        )

        query_service = query_service.filter(
            Service.latitude <= top_left_lat,
            Service.latitude >= bottom_right_lat,
            Service.longitude >= top_left_long,
            Service.longitude <= bottom_right_long,
            Service.online == False
        )

    # Get all products and services
    products = query_product.all()
    services = query_service.all()

    # Convert the products and services into dictionaries
    products_list = [product.to_dict() for product in products]
    services_list = [service.to_dict() for service in services]

    # Return a JSON object with both, products and services
    return jsonify({"products": products_list, "services": services_list})

@api.route('/services/online', methods=['GET'])
def get_online_services():
    category_id = request.args.get('category_id')
    subcategory_id = request.args.get('subcategory_id')
    searchTerm = request.args.get('search_term')

    query = Service.query.filter_by(online=True)

    if category_id:
        query = query.filter_by(category_id=category_id)

    if subcategory_id:
        query = query.filter_by(subcategory_id=subcategory_id)

    if searchTerm:
        query = query.filter(Service.name.contains(searchTerm))

    services = query.all()
    return jsonify([service.to_dict() for service in services])



@api.route('/user/items', methods=['GET'])
@jwt_required()
def get_user_items():
    # Obtém o email do usuário a partir do token JWT.
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    # Buscando produtos e serviços cadastrados pelo usuário
    products = Product.query.filter_by(user_id=user.id).all()
    services = Service.query.filter_by(user_id=user.id).all()

    # Convertendo produtos e serviços em dicionários
    products_list = [product.to_dict() for product in products]
    services_list = [service.to_dict() for service in services]

    # Retornando um objeto JSON com produtos e serviços
    return jsonify({"products": products_list, "services": services_list})

@api.route('/trades', methods=['POST'])
@jwt_required()
def create_trade():
    sender_email = get_jwt_identity()
    sender = User.query.filter_by(email=sender_email).first()

    if not sender:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json()

    if not data:
        return jsonify({"msg": "Missing JSON in request"}), 400

    # Verificar se pelo menos um produto ou serviço é enviado para cada lado da troca
    sender_has_item = 'sender_product_id' in data or 'sender_service_id' in data
    receiver_has_item = 'receiver_product_id' in data or 'receiver_service_id' in data

    if not (sender_has_item and receiver_has_item):
        return jsonify({"msg": "Sender and receiver must have at least one item (product or service)"}), 400

    receiver_id = data.get('receiver_id')
    receiver_product_id = data.get('receiver_product_id')
    receiver_service_id = data.get('receiver_service_id')

    receiver = User.query.get(receiver_id)
    
    if not receiver:
        return jsonify({"msg": "Receiver not found"}), 404

    if receiver_product_id:
        receiver_product = Product.query.get(receiver_product_id)
        if not receiver_product:
            return jsonify({"msg": "Receiver Product not found"}), 404
    else:
        receiver_product_id = None

    if receiver_service_id:
        receiver_service = Service.query.get(receiver_service_id)
        if not receiver_service:
            return jsonify({"msg": "Receiver Service not found"}), 404
    else:
        receiver_service_id = None

    new_trade = Trade(
        sender_id=sender.id,
        receiver_id=receiver.id,
        sender_product_id=data.get('sender_product_id'),
        receiver_product_id=receiver_product_id,
        sender_service_id=data.get('sender_service_id'),
        receiver_service_id=receiver_service_id,
        message=data.get('message'),
        status="Pending"
    )

    # A data de última atualização é definida aqui, quando a negociação é criada
    new_trade.last_update = datetime.utcnow()

    db.session.add(new_trade)
    db.session.commit()

    return jsonify(new_trade.to_dict()), 201


@api.route('/trades', methods=['GET'])
@jwt_required()
def get_trades():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    sent_trades = Trade.query.filter_by(sender_id=user.id).all()
    received_trades = Trade.query.filter_by(receiver_id=user.id).all()

    # Utilizando o método `to_dict()` e incluindo os detalhes dos produtos e serviços
    sent_trades_list = [trade.to_dict(include_product_service=True) for trade in sent_trades]
    received_trades_list = [trade.to_dict(include_product_service=True) for trade in received_trades]

    new_sent_trades = [trade for trade in sent_trades if trade.last_update and user.last_checked and trade.last_update > user.last_checked]
    new_received_trades = [trade for trade in received_trades if trade.last_update and user.last_checked and trade.last_update > user.last_checked]

    user.last_checked = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "sent_trades": sent_trades_list,
        "received_trades": received_trades_list,
        "new_sent_trades": [trade.to_dict(include_product_service=True) for trade in new_sent_trades],
        "new_received_trades": [trade.to_dict(include_product_service=True) for trade in new_received_trades]
    }), 200


@api.route('/trades/<int:trade_id>', methods=['PUT'])
@jwt_required()
def respond_to_trade(trade_id):
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    trade = Trade.query.get(trade_id)

    if not trade:
        return jsonify({"msg": "Trade not found"}), 404

    if user.id != trade.receiver_id:
        return jsonify({"msg": "Unauthorized"}), 401

    data = request.get_json()

    if not data:
        return jsonify({"msg": "Missing JSON in request"}), 400

    if 'status' not in data:
        return jsonify({"msg": "Missing 'status' parameter"}), 400

    status = data['status']
    if status not in ['Accepted', 'Declined']:
        return jsonify({"msg": "Invalid status"}), 400

    trade.status = status
    trade.last_update = datetime.utcnow()  # A data de última atualização é definida aqui, quando a negociação é alterada
    db.session.commit()

    sender = User.query.get(trade.sender_id)

    # Aqui incluímos as informações do usuário que enviou a proposta na resposta
    response = {
        "msg": "Trade status updated successfully",
        "trade": trade.to_dict(include_product_service=True),
        "sender": {
            "email": sender.email,
            "first_name": sender.first_name,
            "phone": sender.phone,
        }
    }

    return jsonify(response), 200



# Criar uma nova wishlist
@api.route('/users/wishlist', methods=['POST'])
@jwt_required()
def create_wishlist():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    if not user:
        return {"error": "User not found"}, 404

    wishlist = Wishlist(user_id=user.id)
    db.session.add(wishlist)
    db.session.commit()

    return {"message": "Wishlist created successfully"}, 201

# Obter a wishlist de um usuário
@api.route('/users/wishlist', methods=['GET'])
@jwt_required()
def get_wishlist():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    if not user:
        return {"error": "User not found"}, 404

    wishlist = user.wishlist
    if wishlist is None:
        return {"error": "Wishlist not found"}, 404

    return {"wishlist": [item.to_dict() for item in wishlist.items]}, 200

# Adicionar um produto ou serviço aos favoritos de um usuário
@api.route('/users/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    data = request.get_json()
    product_id = data.get('product_id')
    service_id = data.get('service_id')

    if product_id is not None:
        product = Product.query.get(product_id)
        if product is None:
            return {"error": "Product not found"}, 404
        favorite = Favorite(user_id=user.id, product_id=product_id)
    elif service_id is not None:
        service = Service.query.get(service_id)
        if service is None:
            return {"error": "Service not found"}, 404
        favorite = Favorite(user_id=user.id, service_id=service_id)
    else:
        return {"error": "Product or service id is required"}, 400

    db.session.add(favorite)
    db.session.commit()

    return {"message": "Favorite added successfully"}, 201

# Obter os favoritos de um usuário
@api.route('/users/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    if not user:
        return {"error": "User not found"}, 404

    favorites = user.favorites
    return {"favorites": [favorite.to_dict() for favorite in favorites]}, 200


