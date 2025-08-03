import { Component, OnInit } from '@angular/core';
import {
  IonItem,
  IonIcon,
  IonInput,
  IonHeader,
} from '@ionic/angular/standalone';
import { NavigationService } from '../navigation.service';
import { NavController } from '@ionic/angular';
import { ApiService } from '../api.service';

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
    private navigationService: NavigationService,
    private navCtrl: NavController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.apiService.getCartQuantity().subscribe({
      next: (res: any) => {
        this.quantity = res.data.cart.totalQuantity;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching cart quantity:', err);
        this.loading = false;
      },
    });
  }

  goToBack() {
    const previousRoute = this.navigationService.getPreviousUrl();

    if (previousRoute) {
      this.navCtrl.navigateBack([previousRoute]);
    } else {
      // Fallback if there's no previous route (e.g., first page load)
      this.navCtrl.navigateBack(['/home']);
    }
  }

  goToCart() {
    this.navCtrl.navigateForward(['/cart']);
  }
}
