from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Medicine(Base):
         __tablename__ = 'medicines'
         id = Column(Integer, primary_key=True, index=True)
         name = Column(String, nullable=False)
         price = Column(String, nullable=True)
         quantity = Column(Integer, nullable=True)