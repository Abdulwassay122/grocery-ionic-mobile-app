import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { addIcons } from 'ionicons';
import { chevronBackOutline, searchOutline, mailOutline, notificationsOutline, locationOutline, chevronDownOutline, chevronForwardOutline, homeOutline, heartOutline, cartOutline, personOutline, addOutline, removeOutline } from 'ionicons/icons';
import { provideHttpClient } from '@angular/common/http';

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
});
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient()
  ],
});
