import { Inject, Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  query,
  where,
  updateDoc,
  deleteDoc,
  DocumentData,
  collectionSnapshots,
  orderBy
} from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { writeBatch, getDocs } from '@angular/fire/firestore'; // usa los de AngularFire

import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';
import imageCompression from 'browser-image-compression';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  firestore: Firestore = inject(Firestore);
  storage = getStorage(); // Firebase Storage instance
  constructor() {}

  async uploadImage(file: File, path: string): Promise<string> {
    // Opciones de compresión
    const options = {
      maxSizeMB: 0.5, // Tamaño máximo en MB
      maxWidthOrHeight: 1920, // Dimensión máxima
      useWebWorker: true, // Usar Web Worker para no bloquear el hilo principal
    };

    try {
      // Comprime la imagen
      const compressedFile = await imageCompression(file, options);

      // Sube la imagen comprimida
      const fileRef = ref(this.storage, path);
      await uploadBytes(fileRef, compressedFile);
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.error('Error al comprimir o subir la imagen:', error);
      throw error;
    }
  }

  async insert(collectionName: string, data: any): Promise<void> {
    const docRef = doc(collection(this.firestore, collectionName));
    data.id = docRef.id;
    await setDoc(docRef, data);
  }

  getFirestore() {
    return this.firestore;
  }

  async insertCustomID(collectionName: string, idCustom: any, data: any): Promise<void> {
    const docRef = doc(this.firestore, `${collectionName}/${idCustom}`);
    data.id = idCustom;
    await setDoc(docRef, data);
  }

  getAll(collectionName: string): Observable<any[]> {
    console.log('getAll', collectionName);
    const colRef = collection(this.firestore, collectionName);
    return collectionSnapshots(colRef).pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.data() as DocumentData;
          data['id'] = a.id;
          return data;
        })
      )
    );
  }

  getAllOrderByDate(collectionName: string): Observable<any[]> {
    console.log('getAll', collectionName);
    const colRef = collection(this.firestore, collectionName);
    const q = query(colRef, orderBy('created_date', 'desc'));
    return collectionSnapshots((q)).pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.data() as DocumentData;
          data['id'] = a.id;
          return data;
        })
      )
    );
  }

  getByParameter(collectionName: string, parametro: string, value: any): Observable<any[]> | any {
    if(!value || !parametro) return;
    console.log('get', collectionName, parametro, value);
    const colRef = collection(this.firestore, collectionName);
    const q = query(colRef, where(parametro, '==', value));
    return collectionSnapshots(q).pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.data() as DocumentData;
          data['id'] = a.id;
          return data;
        })
      )
    );
  }

  getByParameterContains(collectionName: string, parametro: string, value: any): Observable<any[]> | any {
    if(!value || !parametro) return;
    console.log('get', collectionName, parametro, value);
    const colRef = collection(this.firestore, collectionName);

    const q = query(colRef, where(parametro, 'array-contains', value));
    return collectionSnapshots(q).pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.data() as DocumentData;
          data['id'] = a.id;
          return data;
        })
      )
    );
  }

  getByParameterContainsOrderByDate(collectionName: string, parametro: string, value: any): Observable<any[]> | any {
    if(!value || !parametro) return;
    console.log('get', collectionName, parametro, value);
    const colRef = collection(this.firestore, collectionName);

    const q = query(colRef, where(parametro, 'array-contains', value), orderBy('created_date', 'desc'));
    return collectionSnapshots(q).pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.data() as DocumentData;
          data['id'] = a.id;
          return data;
        })
      )
    );
  }

  getAllOnce(collectionName: string): Observable<any[]> {
    console.log('getAllOnce', collectionName);
    const colRef = collection(this.firestore, collectionName);
    return collectionSnapshots(colRef).pipe(
      take(1), // Limita la suscripción a un solo valor
      map((actions) =>
        actions.map((a) => {
          const data = a.data() as DocumentData;
          data['id'] = a.id;
          return data;
        })
      )
    );
  }

  getByParameterOnce(collectionName: string, parametro: string, value: any): any {
    if(!value || !parametro) return;
    const colRef = collection(this.firestore, collectionName);
    const q = query(colRef, where(parametro, '==', value));
    return getDocs(q).then((res) => res.docs.map((doc) => doc.data()));
  }

  async update(id: string, collectionName: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, `${collectionName}/${id}`);
    await updateDoc(docRef, data);
  }

  async deleteCollection(collectionName: string): Promise<void> {
    const colRef = collection(this.firestore, collectionName);
    const snapshot = await getDocs(colRef);
    const batch = writeBatch(this.firestore);

    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }

  async delete(collectionName: string, id: string): Promise<void> {
    const docRef = doc(this.firestore, `${collectionName}/${id}`);
    await deleteDoc(docRef);
  }

  async deleteImage(filePath: string): Promise<void> {
    const fileRef = ref(this.storage, filePath);
    try {
      await deleteObject(fileRef);
      console.log('Imagen eliminada correctamente de Firebase Storage');
    } catch (error) {
      console.error('Error al eliminar la imagen de Firebase Storage:', error);
      throw error;
    }
  }


}
