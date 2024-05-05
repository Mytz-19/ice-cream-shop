from typing import List, Union

import firebase_admin
from firebase_admin import db, credentials
from firebase_admin import firestore

from app.models.enums.collections import Collection

CREDENTIALS_PATH = "db/firebase/credentials.json"


class FirestoreManager:
    
    def __init__(self):
        cred = credentials.Certificate(CREDENTIALS_PATH)
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
        self._db = firestore.client()

    def get_collection(self, collection: Collection):
        """
        Retrieve a reference to a Firestore collection.
        
        Args:
            collection (str): Name of the collection.
        
        Returns:
            Union[None, firestore.CollectionReference]: Collection reference or None if the collection doesn't exist.
        """
        try:
            return self._db.collection(collection)
        except(Exception) as err:
            raise ConnectionError("Failed to retrieve collection") from err

    @staticmethod
    def close_connection():
        """
        Close the Firestore connection when closing the application.
        """
        firestore_instance = firebase_admin.get_app()
        if firestore_instance is not None:
            firebase_admin.delete_app()