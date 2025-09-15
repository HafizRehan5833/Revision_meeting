from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()

# Database connection
def get_database():
    print("Connecting to database...")
    client = MongoClient(os.getenv("db_url"))
    return client

client = get_database()

# Database main
db = client["revision"]
collection = db["studentsdata"]

app = FastAPI()

# Pydantic model for student data
class Student(BaseModel):
    name: str
    age: int
    grade: str

@app.get("/")
def read_root():
    return {"message": "Welcome to the Student API"}


#for all data
@app.get("/student")
def get_students():
    try:
        students = collection.find()
        students_list = []
        for stud in students:    
            students_list.append(
                {
                    "id": str(stud["_id"]),   # convert ObjectId to string
                    "name": stud.get("name", ""),
                    "age": stud.get("age"),
                    "grade": stud.get("grade", "")
                }
            )
        return {
            "Data": students_list,
            "Error": False,
            "Message": "All students data fetched successfully"
        }
    
    except Exception as e:
        return {
            "Data": [],
            "Error": True,
            "Message": str(e)
        }


#for single data
@app.get("/student/{student_id}")
def get_student(student_name: str):
    try:
        student = collection.find_one({"name": student_name})
        if student:
            return {
                "Data": {
                    "id": str(student["_id"]),  # convert ObjectId to string
                    "name": student.get("name", ""),
                    "age": student.get("age", 0),
                    "grade": student.get("grade", "")
                },
                "Error": False,
                "Message": "Student data fetched successfully"
            }
        else:
            return {
                "Data": {},
                "Error": True,
                "Message": "Student not found"
            }
    
    except Exception as e:
        return {
            "Data": {},
            "Error": True,
            "Message": str(e)
        }
    

#for creating data in database
@app.post("/student/add")
def create_student(student: Student):
    try:
        result = collection.insert_one(student.dict())
        return {
            "data": {"id": str(result.inserted_id)},
            "error": None,
            "message": "Student created successfully",
            "status": "success"
        }

    except Exception as e:
        return {
            "Status": "Error",
            "Message": "Error in inserting data",
            "Error": str(e),
            "Data": None
        }


#Delete student data by path parameter
@app.delete("/student/{name}")
def delete_student(name:str):
    try:
        result=collection.delete_one({"name":name})
        if result.deleted_count > 0:
            return {
                "Status":"Success",
                "Message":"Data deleted successfully",
                "Error":None,
                "Data":{"name":name}
            }
        else:
            return {
                "Status":"Data not found",
                "Message":"No data found to delete",
                "Error":None,
                "Data":None
            }
    except Exception as e:
            return{
                "Status":"Error",
                "Message":"Error in deleting data",
                "Error":str(e),
                "Data":None
            }
