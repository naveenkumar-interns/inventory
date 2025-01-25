from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["inventory"]
collection = db["users"]

@api_view(['POST'])
def register(request):
    print(request.data)
    data = collection.insert_one(request.data)
    return Response({'message':'added successfully',"data":data}, status=status.HTTP_200_OK)

@api_view(['POST'])
def login(request):
    print(request.data)
    data = collection.find_one(request.data)
    if data:
        return Response({'message':'login successfully',"data":data}, status=status.HTTP_200_OK)
    else:
        return Response({'message':'login failed'}, status=status.HTTP_400_BAD_REQUEST)



