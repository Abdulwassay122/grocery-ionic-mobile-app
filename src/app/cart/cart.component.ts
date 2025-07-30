import { Component, OnInit } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { register } from 'swiper/element/bundle';

register();
@Component({
  imports: [
    CommonModule,
    IonicModule
  ],
  standalone:true,
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class CartComponent implements OnInit {

  cartItems: { id: number, name: string, price: number, quantity: number }[] = [];

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
    this.cartItems = [
      { id: 1, name: 'Fresh Carrot', price: 1800, quantity: 2 },
      { id: 2, name: 'Banana', price: 1100, quantity: 5 },
      { id: 3, name: 'Orange', price: 1300, quantity: 3 }
    ]
  }

  goToHome() {
    this.navCtrl.navigateBack(['/home']);
  }

  getQuantity() {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }
  getTotal() {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  increaseQuantity(item: any) {
    item.quantity++;
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.removeItem(item);
    }
  }

  removeItem(item: any) {
    this.cartItems = this.cartItems.filter(i => i.id !== item.id);
  }


}
