import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { IonSpinner, IonIcon, IonButton, IonContent, IonSkeletonText, IonCardContent, IonFooter, IonItemSliding, IonItemOption, IonItemOptions, IonItem, IonCard } from '@ionic/angular/standalone'
import { HeaderComponent } from '../header/header.component';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { NavController } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
  imports: [IonSpinner, IonIcon, IonButton, CommonModule, IonContent, IonSkeletonText, IonCardContent, FooterComponent, IonFooter, HeaderComponent, IonItemSliding, IonItemOptions, IonItemOption, IonItem, IonCard]
})
export class WishlistComponent implements OnInit {


  loading2: boolean = false
  loading: boolean = true
  wishlistProducts: any;

  constructor(private navCtrl: NavController, private apiService: ApiService, private toastController: ToastController,) { }

  ngOnInit() {
    this.loadWishList()
  }

  loadWishList() {
    this.apiService.getWishlistProducts().subscribe({
      next: (res: any) => {
        this.wishlistProducts = res?.data?.nodes || [];
        console.log(this.wishlistProducts)
        this.loading = false
      },
      error: (err) => {
        console.error("Error fetching wishlist products", err);
        this.loading = false
      }
    });
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning' | 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color,
    });
    toast.present();
  }
  // Add To Cart 
  async addToCart(variantId: string, productId: string, quantity: number) {
    this.loading2 = true;
    try {
      const cartId = localStorage.getItem('cart_id');
      if (!cartId) {
        throw new Error('Cart ID not found in localStorage.');
      }

      const res: any = await firstValueFrom(this.apiService.addToCart(cartId, variantId, quantity));
      console.log('Cart updated', res);

      this.presentToast('Item added to cart', 'primary');

      // Trigger header update
      this.apiService.getCartQuantity().subscribe();

    } catch (error) {
      console.error('Add to cart error:', error);
      this.presentToast('Error adding to cart', 'danger');
    } finally {
      const existing = JSON.parse(localStorage.getItem('wishlist') || '[]');
      if (existing.includes(productId)) {
        existing.splice(existing.indexOf(productId), 1);
        localStorage.setItem('wishlist', JSON.stringify(existing));
      }
      this.loadWishList()
      this.loading2 = false;
    }
  }

  AddToCart(id: any, pid: string) {
    console.log(pid)
    this.addToCart(id, pid, 1)
  }

  deleteFromWishlist(id: string) {
    const existing = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (existing.includes(id)) {
      existing.splice(existing.indexOf(id), 1);
      localStorage.setItem('wishlist', JSON.stringify(existing));
    }
    this.loadWishList()
  }

  goToProdDetail(id:string){
    this.navCtrl.navigateForward(['/productdetail'], {
      queryParams: { id: id }
    });
  }

}
