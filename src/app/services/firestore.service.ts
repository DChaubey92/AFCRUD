import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { initializeApp, FirebaseApp } from "firebase/app";
import {
  initializeFirestore,
  Firestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private customApp: FirebaseApp;
  private customFirestore: Firestore;
  private customFirestore2: Firestore;
  private collectionItems = 'items';
  private collectionUsers = 'users';

  constructor() {
    // Initialize the custom Firebase app
    this.customApp = initializeApp(environment.firebase);

    // Initialize Firestore instances
    this.customFirestore = initializeFirestore(this.customApp, {}, 'rs3-dev-crm');
    this.customFirestore2 = initializeFirestore(this.customApp, {}, '(default)');
  }

  // Fetch all users
  getUsers() {
    const collectionRef = collection(this.customFirestore, this.collectionUsers);
    return getDocs(collectionRef)
      .then((snapshot) => {
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        throw error;
      });
  }

  // Fetch all items
  getItems() {
    const collectionRef2 = collection(this.customFirestore2, this.collectionItems);
    return getDocs(collectionRef2)
      .then((snapshot) => {
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      })
      .catch((error) => {
        console.error('Error fetching items:', error);
        throw error;
      });
  }

  // Add a new document to the "users" collection
  addUser(userData: any) {
    const collectionRef = collection(this.customFirestore, this.collectionUsers);
    return addDoc(collectionRef, userData)
      .then((docRef) => docRef.id)
      .catch((error) => {
        console.error('Error adding user:', error);
        throw error;
      });
  }

  // Update a document in the "users" collection
  updateUser(userId: string, updatedData: any) {
    const docRef = doc(this.customFirestore, this.collectionUsers, userId);
    return updateDoc(docRef, updatedData)
      .then(() => true)
      .catch((error) => {
        console.error('Error updating user:', error);
        throw error;
      });
  }

  // Delete a document from the "users" collection
  deleteUser(userId: string) {
    const docRef = doc(this.customFirestore, this.collectionUsers, userId);
    return deleteDoc(docRef)
      .then(() => true)
      .catch((error) => {
        console.error('Error deleting user:', error);
        throw error;
      });
  }

  // Add a new document to the "items" collection
  addItem(itemData: any) {
    const collectionRef2 = collection(this.customFirestore2, this.collectionItems);
    return addDoc(collectionRef2, itemData)
      .then((docRef) => docRef.id)
      .catch((error) => {
        console.error('Error adding item:', error);
        throw error;
      });
  }

  // Update a document in the "items" collection
  updateItem(itemId: string, updatedData: any) {
    const docRef2 = doc(this.customFirestore2, this.collectionItems, itemId);
    return updateDoc(docRef2, updatedData)
      .then(() => true)
      .catch((error) => {
        console.error('Error updating item:', error);
        throw error;
      });
  }

  // Delete a document from the "items" collection
  deleteItem(itemId: string) {
    const docRef2 = doc(this.customFirestore2, this.collectionItems, itemId);
    return deleteDoc(docRef2)
      .then(() => true)
      .catch((error) => {
        console.error('Error deleting item:', error);
        throw error;
      });
  }
}