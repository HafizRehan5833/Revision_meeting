from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson import ObjectId
load_dotenv()



# Database connection
def get_database():
    try:
        print("Connecting to database...")
        client = MongoClient(os.getenv("db_url"))
        print("link:",client)
        print("Database connection successful.")
        return client
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None
