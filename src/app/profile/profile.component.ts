import { Component, OnInit } from '@angular/core';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { FooterComponent } from '../footer/footer.component';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [FooterComponent, IonContent, IonButton]
})
export class ProfileComponent implements OnInit {


  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    const isGuest = localStorage.getItem('shopify_customer_type') === 'guest'
    if(isGuest){
      this.router.navigate(['/login']); 
    }
   }

  Logout() {
    this.apiService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
    const cartId = localStorage.getItem('cart_id')
    if(!cartId){
      throw new Error("cart_id in localstorage is not Found.")
    }
    this.apiService.resetCartBuyerIdentity(cartId)
  }
}
