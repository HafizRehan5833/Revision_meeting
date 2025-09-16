from agents import Agent, OpenAIChatCompletionsModel, ModelSettings, Runner,function_tool
from openai import AsyncOpenAI
from db_connect.db import get_database
import os
from dotenv import load_dotenv
load_dotenv()


# Database connection
client = get_database()
db = client["revision"]
collection = db["studentsdata"]



@function_tool
def read_students():
    print("Fetching all students...")
    """Fetch all students from the database.
    Returns:
        dict: A dictionary containing the list of students and any error message.
    Args:
        None
    
        """
    try:
        students = collection.find({})
        students_list = []
        for stud in students:
            stud["_id"] = str(stud["_id"])  # Convert ObjectId to string
            students_list.append(stud)
        print("Students fetched:", students_list)    

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

@function_tool
def add_student(name: str, age: int, grade: str):
    print("Adding student...")
    """Add a new student to the database.
    Args:
        name (str): The name of the student.
        age (int): The age of the student.
        grade (str): The grade of the student.
    Returns:
        dict: A dictionary containing the result of the insertion operation.
    """
    try:
        result = collection.insert_one({"name": name, "age": age, "grade": grade})
        return {
            "Data": {"id": str(result.inserted_id)},
            "Error": False,
            "Message": "Student added successfully"
        }
    except Exception as e:
        return {
            "Data": {},
            "Error": True,
            "Message": str(e)
        }
    except Exception as e:
        return {
            "Data": {},
            "Error": True,
            "Message": str(e)
        }

@function_tool
def delete_student(name: str):
    print("Deleting student...")
    """"    Delete a student by name.
        Args:
            name (str): The name of the student to delete.
        Returns:
            dict: A dictionary containing the result of the deletion operation.

    """
    try:
        result = collection.delete_one({"name": name})
        if result.deleted_count > 0:
            return {
                "Data": {"name": name},
                "Error": False,
                "Message": "Student deleted successfully"
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
        
@function_tool
def update_student(name: str, age: int = None):
    print("Updating student...")
    """Update a student's information in the database.
    Args:
        name (str): The name of the student to update.
        age (int, optional): The new age of the student. Defaults to None.
    Returns:
        dict: A dictionary containing the result of the update operation.
    """
    try:
        update_fields = {}
        if age is not None:
            update_fields["age"] = age
        

        if not update_fields:
            return {
                "Data": {},
                "Error": True,
                "Message": "No fields to update"
            }

        result = collection.update_one({"name": name}, {"$set": update_fields})
        if result.matched_count > 0:
            return {
                "Data": {"name": name},
                "Error": False,
                "Message": "Student updated successfully"
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