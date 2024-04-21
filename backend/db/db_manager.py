# DBManager encapsulates CRUD operations
from typing import Any, Dict, Optional

from firebase_admin import firestore

from db.firebase.firestore_manager import FirestoreManager
from app.models.enums.collections import Collection


class DBManager:

    firestore_manager: FirestoreManager = None

    def __init__(self):
        if DBManager.firestore_manager is None:
            # Initialize the class-level attribute only once
            DBManager.firestore_manager = FirestoreManager()
        # Use the shared instance
        self.firestore_manager = DBManager.firestore_manager

    def create(self, collection_name: Collection, data: Dict[str, Any]) -> firestore.DocumentReference:
        """
        Create a new document in the specified collection.
        """
        collection = self.firestore_manager.get_collection(collection_name)
        return collection.add(data)

    def read_all_entries(self, collection_name: Collection):
        """
        Read a document by its ID from the specified collection.
        """
        collection = self.firestore_manager.get_collection(collection_name)
        docs = collection.stream()

        employee_list = []
        for doc in docs:
            employee_data = doc.id, doc.to_dict()
            employee_list.append(employee_data)
        return employee_list
    
    def read_by_id(self, collection_name: str, document_id: str):
        """
        Read a document by its ID from the specified collection.
        """
        collection = self.firestore_manager.get_collection(collection_name)
        return collection.document(document_id).get().to_dict()

    def update_by_id(self, collection_name: Collection, document_id: str, updated_data: Dict[str,Any]) -> None:
        """
        Update a document in the specified collection.
        """
        collection = self.firestore_manager.get_collection(collection_name)
        collection.document(document_id).update(updated_data)

    def delete_by_id(self, collection_name: Collection, document_id: str) -> None:
        """
        Delete a document by its ID from the specified collection.
        """
        collection = self.firestore_manager.get_collection(collection_name)
        collection.document(document_id).delete()