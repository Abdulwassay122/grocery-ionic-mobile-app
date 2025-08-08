import { Component, OnInit } from '@angular/core';
import {
  IonItem,
  IonIcon,
  IonInput,
  IonHeader,
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonItem, IonIcon, IonInput, IonHeader],
})
export class HeaderComponent implements OnInit {
  quantity: any = 0;
  loading: boolean = true;
  constructor(
    private location: Location,
    private navCtrl: NavController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.apiService.cartQuantity$.subscribe(qty => {
      this.quantity = qty;
      this.loading = false
      console.log("Headerss",this.quantity)
    });
    // initial fetch
    this.apiService.getCartQuantity().subscribe(qty => {
      this.quantity = qty.data.cart.totalQuantity;
      this.loading = false
    });
  }

  goToBack() {
    this.location.back();
  }

  goToCart() {
    this.navCtrl.navigateForward(['/cart']);
  }
}
