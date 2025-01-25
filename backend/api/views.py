from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import random
import pymongo
from django.core.mail import send_mail
from django.contrib.auth.hashers import check_password
from django.contrib.auth import get_user_model
from .models import Inventory

client = pymongo.MongoClient("mongodb+srv://HCqpxhFHemEzvcWx:HCqpxhFHemEzvcWx@cluster0.srrgh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["inventory"]
collection_users = db["users"]
collection_otp = db["otp"]
collection_inventory = db["inventory"]

@api_view(['POST'])
def register(request):
    print(request.data)
    
    existing_user = collection_users.find_one({"email": request.data["email"]})
    if existing_user:
        existing_user["_id"] = str(existing_user["_id"])  # Convert ObjectId to string
        return Response({'message':'email already exists', "data":existing_user}, status=status.HTTP_200_OK)
    
    inserted_data = collection_users.insert_one(request.data)
    # Create a response data object with the string version of ObjectId
    response_data = request.data.copy()
    response_data["_id"] = str(inserted_data.inserted_id)
    return Response({'message':'added successfully', "data":response_data}, status=status.HTTP_200_OK)

@api_view(['POST'])
def verify_email_via_otp(request):
    email = request.data["email"]
    otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
    
    subject = 'Email Verification OTP'
    message = f'Your OTP for email verification is: {otp}'
    from_email = 'naveenkumar.intern@gmail.com'
    recipient_list = [email]
    
    try:
        send_mail(subject, message, from_email, recipient_list)
        collection_otp.update_one(
            {"email": email},
            {"$set": {"otp": otp}},
            upsert=True
        )
        return Response({'message':'OTP sent successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'message':'Failed to send OTP'}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
def verify_otp(request):
    email = request.data["email"]
    otp = request.data["otp"]
    user = collection_otp.find_one({"email": email})
    
    if user and user["otp"] == otp:
        return Response({'message':'OTP verified successfully'}, status=status.HTTP_200_OK)
    else:
        return Response({'message':'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    if not email or not password:
        return Response({'message': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = collection_users.find_one({'email': email})
    print(user)
    if user and password == user['password']:
        # Convert ObjectId to string before sending in response
        user['_id'] = str(user['_id'])
        return Response({'message': 'Login successfully', 'data': user}, status=status.HTTP_200_OK)
    else:
        return Response({'message': 'Login failed'}, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['POST'])
def forgot_password(request):
    email = request.data.get('email')
    if not email:
        return Response({'message': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = collection_users.find_one({'email': email})
    if user:
        otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        
        subject = 'Password Reset OTP'
        message = f'Your OTP for password reset is: {otp}'
        from_email = 'naveenkumar.intern@gmail.com'
        recipient_list = [email]
        
        try:
            send_mail(subject, message, from_email, recipient_list)
            collection_otp.update_one(
                {"email": email},
                {"$set": {"otp": otp}},
                upsert=True
            )
            return Response({'message':'OTP sent successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message':'Failed to send OTP'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
def reset_password(request):
    
    email = request.data.get('email')
    otp = request.data.get('otp')
    new_password = request.data.get('new_password')

    user = collection_otp.find_one({'email': email})
    if user:
        if user['otp'] == otp:
            collection_users.update_one({'email': email}, {'$set': {'password': new_password}})
            return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    try:
        # Get counts from MongoDB collections
        managers_count = collection_users.count_documents({'role': 'manager'})
        employees_count = collection_users.count_documents({'role': 'employee'})
        inventory_count = collection_inventory.count_documents({})
        
        # Get recent activities (last 5 users)
        recent_users = list(collection_users.find({}, {'name': 1, 'date_joined': 1}).sort('date_joined', -1).limit(5))
        recent_activities = []
        for user in recent_users:
            if 'name' in user and 'date_joined' in user:
                recent_activities.append({
                    'type': 'user_joined',
                    'user': user['name'],
                    'timestamp': user['date_joined']
                })
        
        return Response({
            'managers_count': managers_count,
            'employees_count': employees_count, 
            'inventory_count': inventory_count,
            'recent_activities': recent_activities
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_managers(request):
    try:
        managers = list(collection_users.find({'role': 'manager'}, {
            '_id': 1,
            'name': 1, 
            'email': 1,
            'date_joined': 1,
            'is_active': 1
        }))
        
        manager_data = [{
            'id': str(manager['_id']),
            'name': manager.get('name', ''),
            'email': manager.get('email', ''),
            'status': 'Active' if manager.get('is_active', True) else 'Inactive',
            'joined_date': manager.get('date_joined')
        } for manager in managers]
        
        return Response(manager_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_employees(request):
    try:
        # Query MongoDB directly instead of using Django ORM
        employees = list(collection_users.find({'role': 'employee'}, {
            '_id': 1,
            'name': 1,
            'email': 1, 
            'date_joined': 1,
            'is_active': 1
        }))
        
        employee_data = [{
            'id': str(employee['_id']),
            'name': employee.get('name', ''),
            'email': employee.get('email', ''),
            'status': 'Active' if employee.get('is_active', True) else 'Inactive',
            'joined_date': employee.get('date_joined')
        } for employee in employees]
        
        return Response(employee_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


