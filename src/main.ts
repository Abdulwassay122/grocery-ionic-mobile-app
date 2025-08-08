import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { addIcons } from 'ionicons';
import { trashOutline, chevronBackOutline, searchOutline, mailOutline, notificationsOutline, locationOutline, chevronDownOutline, chevronForwardOutline, homeOutline, heartOutline, cartOutline, personOutline, addOutline, removeOutline, eyeOutline, eyeOffOutline, personCircleOutline, heartSharp, closeOutline, calendarNumberOutline, calendarClearSharp, cardOutline, cubeOutline, basketOutline, locateOutline, bagOutline, arrowForwardOutline } from 'ionicons/icons';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom, PLATFORM_ID } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { IonicModule } from '@ionic/angular';

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
  'person-circle-outline': personCircleOutline,
  'heart-sharp': heartSharp,
  'close-outline': closeOutline,
  'calendar-outline': calendarClearSharp,
  'card-outline': cardOutline,
  'cube-outline': cubeOutline,
  'basket-outline': basketOutline,
  'locate-outline': locateOutline,
  'bag-outline': bagOutline,
  'arrow-forward-outline': arrowForwardOutline,
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
    importProvidersFrom(
      IonicModule.forRoot({
        animated: false  // ✅ Disable Ionic animations here
      })
    ),
    provideRouter(routes)
  ],
});
