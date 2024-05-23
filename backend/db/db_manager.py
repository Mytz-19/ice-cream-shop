# DBManager encapsulates CRUD operations
from typing import Any, Dict, Optional

from firebase_admin import firestore

from db.firebase.firestore_manager import FirestoreManager
from app.models.enums.collections import Collection


class DBManager:

    firestore_manager = None

    def __init__(self):
        if DBManager.firestore_manager is None:
            # Initialize the class-level attribute only once
            DBManager.firestore_manager = FirestoreManager()
        # Use the shared instance
        self.firestore_manager = DBManager.firestore_manager

    def close(self):
        self.firestore_manager.close_connection()

    def create(self, collection_name: Collection, data: Any) -> str:
        """
        Create a new document in the specified collection.
        """
        timestamp, collection = self.firestore_manager.get_collection(collection_name).add(data)
        return collection.id

    def read_all_entries(self, collection_name: Collection):
        """
        Read a document by its ID from the specified collection.
        """
        collection = self.firestore_manager.get_collection(collection_name)
        return collection.stream()
    
    def read_by_id(self, collection_name: Collection, document_id: str):
        """
        Read a document by its ID from the specified collection.
        """
        collection = self.firestore_manager.get_collection(collection_name)
        return collection.document(document_id).get().to_dict()

    def update_by_id(self, collection_name: Collection, document_id: str, updated_data: Dict[str, Any]) -> bool:
        """
        Update a document in the specified collection.
        """
        collection = self.firestore_manager.get_collection(collection_name)
        collection.document(document_id).update(updated_data)
        return True

    def delete_by_id(self, collection_name: Collection, document_id: str) -> bool:
        """
        Delete a document by its ID from the specified collection.
        """
        collection = self.firestore_manager.get_collection(collection_name)
        collection.document(document_id).delete()
        return True
