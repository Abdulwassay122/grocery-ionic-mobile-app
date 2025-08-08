import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { ApiService } from '../api.service';
import { Browser } from '@capacitor/browser';
import { NavigationService } from '../navigation.service';
import { FooterComponent } from '../footer/footer.component';
import { ToastController } from '@ionic/angular';
import { Location } from '@angular/common';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

register();
@Component({
  imports: [
    CommonModule,
    IonicModule,
    FooterComponent
  ],
  standalone: true,
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  providers: [InAppBrowser],
})

export class CartComponent implements OnInit {

  cart: any = null
  cartItems: any[] = [];
  externalUrl: string = '';
  loading : boolean = true;
  loading2 : boolean = false;


  constructor(private iab: InAppBrowser, private location: Location, private toastController: ToastController, private navCtrl: NavController, private apiService: ApiService, private navigationService: NavigationService) { }

  ngOnInit() {
    this.loadCart()
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
  async loadCart() {
    const cartId = localStorage.getItem("cart_id");
    console.log("Cart Id : ", cartId);

    if (cartId) {
      this.apiService.getCart(cartId).subscribe({
        next: (res: any) => {
          try {
            this.cart = res.data.cart;
            console.log("Cart Data : ", res);

            if (
              this.cart &&
              this.cart.lines &&
              Array.isArray(this.cart.lines.edges)
            ) {
              this.cartItems = this.parseCartItems(this.cart);
              console.log("CartIOtem",this.cart)
            } else {
              this.cartItems = [];
            }
          } catch (err) {
            console.error("Error parsing cart:", err);
            this.cartItems = [];
          } finally {
            this.loading = false;
            this.loading2 = false;
          }
        },
        error: (err) => {
          console.error("Failed to fetch cart:", err);
          this.cartItems = [];
          this.loading = false;
          this.loading2 = false;
        }
      });
    } else {
      console.warn("No cart ID found");
      this.cartItems = [];
      this.loading = false;
      this.loading2 = false;
    }
  }



  parseCartItems(cart: any): any[] {
    return cart.lines.edges.map((edge: any) => {
      const item = edge.node;
      const product = item.merchandise.product;
      const image = product.images.edges[0]?.node.url;

      return {
        prodId: item.merchandise.product.id,
        Lineid: item.id,
        id: item.merchandise.id,
        name: product.title,
        quantity: item.quantity,
        price: item.merchandise.price.amount,
        currency: item.merchandise.price.currencyCode,
        image: image || 'assets/images/Rectangle 319.png',
        quality: item.merchandise.title,
        quantityAvailable: item.merchandise.quantityAvailable
      };
    });
  }


  goToBack() {
    this.location.back();
  }

  getQuantity() {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }
  getTotal() {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }


  // Add To Cart 
  async addToCart(variantId: string, quantity: number) {
    this.loading2 = true;
    try {
      const cartId = localStorage.getItem('cart_id');
      if (!cartId) {
        throw new Error('Cart ID not found in localStorage.');
      }
      // Convert observable to promise
      const res: any = await this.apiService.addToCart(cartId, variantId, quantity).toPromise();
      console.log('Cart updated', res);
      this.loadCart()
    } catch (error) {
      console.error('Add to cart error:', error);
      this.loading2 = false
    }
  }
  AddToCart(item: any) {
    if(item.quantityAvailable !== item.quantity){
      this.addToCart(item.id, 1)
    }else{
      this.presentToast("No More tock available.", "danger")
    }
  }
  

  // remove item from cart 
  removeItem(item: any) {
    const cartId = localStorage.getItem("cart_id");
    if (!cartId) return;

    this.loading2 = true;
    this.apiService.removeCartItem(cartId, item.Lineid).subscribe({
      next: (res: any) => {
        this.cartItems = this.cartItems.filter(i => i.Lineid !== item.Lineid);
        this.loadCart();
        this.loading2 = false;
      },
      error: (err) => {
        console.error('Failed to remove item:', err);
        this.loading2 = false;
      }
    });
  }

  decreaseQuantity(item: any) {
    const cartId = localStorage.getItem("cart_id");
    if (!cartId) return;

    this.loading2 = true;

    if (item.quantity > 1) {
      const newQty = item.quantity - 1;
      this.apiService.updateCartItem(cartId, item.Lineid, newQty).subscribe({
        next: (res: any) => {
          item.quantity = newQty;
          this.loadCart();
        },
        error: (err: any) => {
          console.error('Failed to update quantity:', err);
          this.loading2 = false;
        }
      });
    } else {
      this.removeItem(item)
    }
  }
  
  goToProdDetail(id:string){
    this.navCtrl.navigateForward(['/productdetail'], {
      queryParams: { id: id }
    });
  }


  openCheckout(url = this.cart.checkoutUrl) {
    console.log(url)
    const browser = this.iab.create(url, '_blank', {
      location: 'yes',
      toolbar: 'yes',
      clearcache: 'yes',
      clearsessioncache: 'yes',
    });

    browser.on('exit').subscribe(() => {
      console.log('Browser closed');
      // You can refresh the cart or navigate
    });
  }

}

