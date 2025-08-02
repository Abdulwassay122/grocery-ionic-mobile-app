import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonFooter, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports:[IonFooter, IonIcon]
})
export class FooterComponent  implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {}

  goToCart() {
    this.navCtrl.navigateForward(['/cart']);
  }
  goToProfile() {
    this.navCtrl.navigateForward(['/profile']);
  }
  goToHome() {
    this.navCtrl.navigateBack(['/home']);
  }
}
