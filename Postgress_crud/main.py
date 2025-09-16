from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from config_db.db import SessionLocal, engine
from models.medicine_model import Medicine
from pydantic import BaseModel
from typing import List


# Create database tables
Medicine.metadata.create_all(bind=engine)

app = FastAPI()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- SCHEMAS ----------
class MedicineCreate(BaseModel):
    name: str
    price: float
    quantity: int


class MedicineBase(BaseModel):
    id: int
    name: str
    price: float
    quantity: int

    class Config:
        orm_mode = True


class MedicineResponse(BaseModel):
    data: MedicineBase
    message: str
    status: str


class MedicinesListResponse(BaseModel):
    data: List[MedicineBase]
    message: str
    status: str


# ---------- ROUTES ----------
@app.post("/medicine/", response_model=MedicineResponse)
def create_medicine(medicine: MedicineCreate, db: Session = Depends(get_db)):
    # Get the last ID and assign next one
    last = db.query(Medicine).order_by(Medicine.id.desc()).first()
    new_id = 1 if not last else last.id + 1

    new_medicine = Medicine(
        id=new_id,
        name=medicine.name,
        price=medicine.price,
        quantity=medicine.quantity
    )
    db.add(new_medicine)
    db.commit()
    db.refresh(new_medicine)
    return {
        "data": new_medicine,
        "message": "Medicine created successfully",
        "status": "success"
    }


@app.get("/all", response_model=MedicinesListResponse)
def get_medicines(db: Session = Depends(get_db)):
    medicines = db.query(Medicine).order_by(Medicine.id).all()
    return {
        "data": medicines,
        "message": "Medicines fetched successfully",
        "status": "success"
    }


@app.get("/medicine/{medicine_name}", response_model=MedicineResponse)
def get_medicine(medicine_name: str, db: Session = Depends(get_db)):
    medicine = db.query(Medicine).filter(Medicine.name == medicine_name).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return {
        "data": medicine,
        "message": "Medicine fetched successfully",
        "status": "success"
    }


@app.delete("/medicine/{medicine_id}", response_model=MedicinesListResponse)
def delete_medicine(medicine_id: int, db: Session = Depends(get_db)):
    medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    # Delete the selected record
    db.delete(medicine)
    db.commit()

    # Resequence IDs
    medicines = db.query(Medicine).order_by(Medicine.id).all()
    for new_id, med in enumerate(medicines, start=1):
        med.id = new_id
    db.commit()

    updated_list = db.query(Medicine).order_by(Medicine.id).all()
    return {
        "data": updated_list,
        "message": "Medicine deleted and IDs resequenced successfully",
        "status": "success"
    }


@app.put("/medicine/{medicine_id}", response_model=MedicineResponse)
def update_medicine(medicine_id: int, medicine: MedicineCreate, db: Session = Depends(get_db)):
    existing_medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not existing_medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    existing_medicine.name = medicine.name
    existing_medicine.price = medicine.price
    existing_medicine.quantity = medicine.quantity

    db.commit()
    db.refresh(existing_medicine)

    return {
        "data": existing_medicine,
        "message": "Medicine updated successfully",
        "status": "success"
    }