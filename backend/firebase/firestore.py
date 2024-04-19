import firebase_admin
from firebase_admin import db, credentials
from firebase_admin import firestore

# Use the application default credentials.
cred = credentials.Certificate("C:/Users/yhm1kor/experiments/ice-cream-shop/backend/firebase/credentials.json")

firebase_admin.initialize_app(cred)
db = firestore.client()

def read_employee_data():
    emp_ref = db.collection("Employees")
    docs = emp_ref.stream()

    for doc in docs:
        return (f"{doc.id} => {doc.to_dict()}")