import { Component, OnInit } from '@angular/core';
import { IonNote, IonLabel, IonList, IonContent, IonButton, IonHeader, IonItem, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent  } from '@ionic/angular/standalone';
import { FooterComponent } from '../footer/footer.component';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [ CommonModule, FooterComponent, IonContent, IonButton, IonHeader, IonItem, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonLabel, IonNote ]
})
export class ProfileComponent implements OnInit {

  customer: any;
  loading: boolean = true;

  constructor(private location: Location, private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    const isGuest = localStorage.getItem('shopify_customer_type') === 'guest'
    if (isGuest) {
      this.router.navigate(['/first']);
    }
    
    this.apiService.getCustomerInfo().subscribe((res: any) => {
      this.customer = res?.data?.customer;
      console.log("Customer", this.customer);
      this.loading = false
    });
  }

  Logout() {
    const cartId = localStorage.getItem('cart_id')
    if (!cartId) {
      throw new Error("cart_id in localstorage is not Found.")
    }
    this.apiService.resetCartBuyerIdentity(cartId)
    this.apiService.logout().subscribe(() => {
      this.router.navigate(['/first']);
    });
  }
  goBack(){
    this.location.back();
  }
  goToOrders(){
    this.router.navigate(['/orders']);
  }
}
