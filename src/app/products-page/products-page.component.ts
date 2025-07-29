import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem } from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NavController } from '@ionic/angular';

register();
@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, RouterModule],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductsPageComponent  implements OnInit {
  goToProducts() {
    this.navCtrl.navigateBack(['/home']);
  }
  goToProductdetail() {
    this.navCtrl.navigateForward(['/productdetail']);
  }
  constructor(private navCtrl: NavController) { }

  ngOnInit() {}

}
