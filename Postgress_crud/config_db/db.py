from sqlalchemy import create_engine #type:ignore
from sqlalchemy.orm import sessionmaker #  type:ignore
import os
from dotenv import load_dotenv
load_dotenv()

try:
    print("Connecting with database....")
    db_url = os.getenv("db_url")
    print(db_url)
    engine = create_engine(db_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception as e:
    print(f"Error connecting to database: {e}")