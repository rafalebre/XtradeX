from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime


db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    first_name = db.Column(db.String(120))
    last_name = db.Column(db.String(120))
    username = db.Column(db.String(120))
    gender = db.Column(db.String(120))
    birth_date = db.Column(db.Date)
    phone = db.Column(db.String(120))
    location = db.Column(db.String(120))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    image_url = db.Column(db.String, nullable=True)
    last_checked = db.Column(db.DateTime, default=datetime.utcnow)


    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "username": self.username,
            "gender": self.gender,
            "birth_date": self.birth_date.isoformat() if self.birth_date else None,
            "phone": self.phone,
            "location": self.location,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "image_url": self.image_url
        }

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)



class Product(db.Model):
    __tablename__ = 'product'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('product_category.id'))  # nova coluna
    subcategory_id = db.Column(db.Integer, db.ForeignKey('product_subcategory.id'))  # nova coluna
    condition = db.Column(db.String(120), nullable=False)
    currency = db.Column(db.String(10))
    estimated_value = db.Column(db.Float, nullable=False)
    location = db.Column(db.String(120))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    image_url = db.Column(db.String, nullable=True)

    user = db.relationship('User', backref='products')
    category = db.relationship('ProductCategory', backref='products')  # nova relação
    subcategory = db.relationship('ProductSubcategory', backref='products')  # nova relação

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "description": self.description,
            "category": self.category.to_dict() if self.category else None,
            "subcategory": self.subcategory.to_dict() if self.subcategory else None,
            "condition": self.condition,
            "currency": self.currency,
            "estimated_value": self.estimated_value,
            "location": self.location,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "image_url": self.image_url
        }

class ProductCategory(db.Model):
    __tablename__ = 'product_category'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    subcategories = db.relationship('ProductSubcategory', backref='product_category')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'subcategories': [subcategory.to_dict() for subcategory in self.subcategories]
        }
        
class ProductSubcategory(db.Model):
    __tablename__ = 'product_subcategory'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('product_category.id'))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category_id': self.category_id
        }


class Service(db.Model):
    __tablename__ = 'service'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('service_categories.id'))  # nova coluna
    subcategory_id = db.Column(db.Integer, db.ForeignKey('service_subcategories.id'))  # nova coluna
    currency = db.Column(db.String(10))
    estimated_value = db.Column(db.Float, nullable=False)
    location = db.Column(db.String(120))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    online = db.Column(db.Boolean, default=False, nullable=False)
    image_url = db.Column(db.String, nullable=True)
    

    user = db.relationship('User', backref='services')
    category = db.relationship('ServiceCategory', backref='services')  # nova relação
    subcategory = db.relationship('ServiceSubcategory', backref='services')  # nova relação

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "description": self.description,
            "category": self.category.to_dict() if self.category else None,
            "subcategory": self.subcategory.to_dict() if self.subcategory else None,
            "currency": self.currency,
            "estimated_value": self.estimated_value,
            "location": self.location,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "online": self.online,
            "image_url": self.image_url
        }

class ServiceCategory(db.Model):
    __tablename__ = 'service_categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    subcategories = db.relationship('ServiceSubcategory', backref='category', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "subcategories": [subcategory.to_dict() for subcategory in self.subcategories]
        }


class ServiceSubcategory(db.Model):
    __tablename__ = 'service_subcategories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('service_categories.id'), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category_id": self.category_id
        }

class Trade(db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    sender_product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=True)
    receiver_product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=True)
    sender_service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=True)
    receiver_service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=True)
    message = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    last_update = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) # adicionado

    sender = db.relationship('User', foreign_keys=[sender_id])
    receiver = db.relationship('User', foreign_keys=[receiver_id])
    sender_product = db.relationship('Product', foreign_keys=[sender_product_id])
    receiver_product = db.relationship('Product', foreign_keys=[receiver_product_id])
    sender_service = db.relationship('Service', foreign_keys=[sender_service_id])
    receiver_service = db.relationship('Service', foreign_keys=[receiver_service_id])

    def to_dict(self, include_product_service=False):
        data = {
            "id": self.id,
            "sender_id": self.sender_id,
            "receiver_id": self.receiver_id,
            "sender_product_id": self.sender_product_id,
            "receiver_product_id": self.receiver_product_id,
            "sender_service_id": self.sender_service_id,
            "receiver_service_id": self.receiver_service_id,
            "message": self.message,
            "status": self.status,
            "last_update": self.last_update.isoformat() if self.last_update else None, # adicionado
            "sender_item_name": self.sender_product.name if self.sender_product else self.sender_service.name,
            "receiver_item_name": self.receiver_product.name if self.receiver_product else self.receiver_service.name,
            "sender_email": self.sender.email,
        }

        if include_product_service:
            if self.sender_product:
                data["sender_product_details"] = self.sender_product.to_dict()  # Aqui precisamos de um método `to_dict()` na classe Product também

            if self.receiver_product:
                data["receiver_product_details"] = self.receiver_product.to_dict()

            if self.sender_service:
                data["sender_service_details"] = self.sender_service.to_dict()  # Aqui precisamos de um método `to_dict()` na classe Service também

            if self.receiver_service:
                data["receiver_service_details"] = self.receiver_service.to_dict()

        return data



class Message(db.Model):
    __tablename__ = 'message'

    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'))
    content = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "sender_id": self.sender_id,
            "receiver_id": self.receiver_id,
            "product_id": self.product_id,
            "service_id": self.service_id,
            "content": self.content
        }


class Wishlist(db.Model):
    __tablename__ = 'wishlist'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    description = db.Column(db.String, nullable=False)
    importance = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "description": self.description,
            "importance": self.importance
        }



class Favorite(db.Model):
    __tablename__ = 'favorite'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'))

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "product_id": self.product_id,
            "service_id": self.service_id
        }
