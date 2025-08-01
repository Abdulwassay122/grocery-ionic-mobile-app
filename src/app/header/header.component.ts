import { Component, OnInit } from '@angular/core';
import { IonItem, IonIcon, IonInput, IonHeader } from '@ionic/angular/standalone';
import { NavigationService } from '../navigation.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports:[ IonItem, IonIcon, IonInput, IonHeader ]
})
export class HeaderComponent  implements OnInit {

  constructor( private navigationService: NavigationService, private navCtrl: NavController ) { }

  ngOnInit() {}


   goToBack() {
    const previousRoute = this.navigationService.getPreviousUrl();

    if (previousRoute) {
      this.navCtrl.navigateBack([previousRoute]);
    } else {
      // Fallback if there's no previous route (e.g., first page load)
      this.navCtrl.navigateBack(['/home']);
    }
  }

  goToCart(){
    this.navCtrl.navigateForward(['/cart']);
  }

}
