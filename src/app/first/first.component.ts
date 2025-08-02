import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { ApiService } from '../api.service';
import { ToastController } from '@ionic/angular';

register();
@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.scss'],
  imports: [IonButton, IonContent, IonIcon]
})
export class FirstComponent implements OnInit {

  constructor(private toastController: ToastController, private router: Router, private apiService: ApiService) { }
  ngOnInit() { }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning' | 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color,
    });
    toast.present();
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
  async initializeCart() {
    const res: any = await this.apiService.createCart().toPromise();
    const cartId = res.data.cartCreate.cart.id;
    localStorage.setItem('cart_id', cartId || '');
    return cartId as string;
  }
  contAsGuest() {
    localStorage.setItem("shopify_customer_type", "guest")
    this.initializeCart()
    this.presentToast('Wecome as Guest.', 'primary')
    this.router.navigate(['/home']);
  }

}
