import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonFooter, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [ CommonModule, IonFooter, IonIcon]
})
export class FooterComponent implements OnInit {

  homeRoute: boolean = true
  wishRoute: boolean = false
  cartRoute: boolean = false
  ProfileRoute: boolean = false


  constructor(private router: Router, private navCtrl: NavController) { }

  ngOnInit() { }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  goToCart() {
    this.navCtrl.navigateForward(['/cart']);
  }
  goToProfile() {
    const isGuest = localStorage.getItem('shopify_customer_type') === 'guest'
    isGuest ? this.navCtrl.navigateForward(['/login']) : this.navCtrl.navigateForward(['/profile'])
  }
  goToHome() {
    this.navCtrl.navigateBack(['/home']);
  }
  goToWish() {
    this.navCtrl.navigateForward(['/wishlist']);
  }
}
