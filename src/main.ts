import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { addIcons } from 'ionicons';
import { trashOutline, chevronBackOutline, searchOutline, mailOutline, notificationsOutline, locationOutline, chevronDownOutline, chevronForwardOutline, homeOutline, heartOutline, cartOutline, personOutline, addOutline, removeOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { provideHttpClient } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

addIcons({
  'chevron-back-outline': chevronBackOutline,
  'search-outline': searchOutline,
  'mail-outline': mailOutline,
  'notifications-outline': notificationsOutline,
  'location-outline': locationOutline,
  'chevron-down-outline': chevronDownOutline,
  'chevron-forward-outline': chevronForwardOutline,
  'heart-outline': heartOutline,
  'home-outline': homeOutline,
  'person-outline': personOutline,
  'cart-outline': cartOutline,
  'remove-outline': removeOutline,
  'add-outline': addOutline,
  'trash-outline': trashOutline,
  'eye-outline': eyeOutline,
  'eye-off-outline': eyeOffOutline,
});
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    {
      provide: PLATFORM_ID,
      useValue: 'browser' // still valid for Capacitor runtime in browser
    },
    InAppBrowser,
  ],
});
