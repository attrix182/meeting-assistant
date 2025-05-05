import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes, withHashLocation()), provideFirebaseApp(() => initializeApp(
    {
      apiKey: "AIzaSyCZqC8KRTR7ExCV9SolakHPUKm-GkhW75o",
      authDomain: "meeting-assistant-12951.firebaseapp.com",
      projectId: "meeting-assistant-12951",
      storageBucket: "meeting-assistant-12951.firebasestorage.app",
      messagingSenderId: "554112034265",
      appId: "1:554112034265:web:2b54213ff92f9bf3e365c8"
    }
  )), provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase()),
provideHttpClient()]
};
