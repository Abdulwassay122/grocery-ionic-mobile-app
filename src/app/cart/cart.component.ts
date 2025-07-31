import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { ApiService } from '../api.service';
import { Browser } from '@capacitor/browser';

register();
@Component({
  imports: [
    CommonModule,
    IonicModule,
  ],
  standalone: true,
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {

  cart: any = null
  cartItems: any[] = [];

  loading = true;

  constructor(private navCtrl: NavController, private apiService: ApiService) { }

  ngOnInit() {
    this.loadCart()
  }

  async loadCart() {
    const cartId = localStorage.getItem("cart_id");
    console.log("Cart Id : ", cartId);


    if (cartId) {
      this.apiService.getCart(cartId).subscribe({
        next: (res: any) => {
          try {
            this.cart = res.data.cart;
            console.log("Cart Data : ", this.cart);

            if (
              this.cart &&
              this.cart.lines &&
              Array.isArray(this.cart.lines.edges)
            ) {
              this.cartItems = this.parseCartItems(this.cart);
            } else {
              this.cartItems = [];
            }
          } catch (err) {
            console.error("Error parsing cart:", err);
            this.cartItems = [];
          } finally {
            this.loading = false;
          }
        },
        error: (err) => {
          console.error("Failed to fetch cart:", err);
          this.cartItems = [];
          this.loading = false;
        }
      });
    } else {
      console.warn("No cart ID found");
      this.cartItems = [];
      this.loading = false;
    }
  }



  parseCartItems(cart: any): any[] {
    return cart.lines.edges.map((edge: any) => {
      const item = edge.node;
      const product = item.merchandise.product;
      const image = product.images.edges[0]?.node.url;

      return {
        Lineid: item.id,
        id: item.merchandise.id,
        name: product.title,
        quantity: item.quantity,
        price: item.merchandise.price.amount,
        currency: item.merchandise.price.currencyCode,
        image: image || 'assets/images/Rectangle 319.png',
        quality: item.merchandise.title
      };
    });
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

  // Add To Cart 
  async initializeCart() {
    let cartId = localStorage.getItem('cart_id');
    if (!cartId) {
      const res: any = await this.apiService.createCart().toPromise();
      cartId = res.data.cartCreate.cart.id;
      localStorage.setItem('cart_id', cartId || '');
      this.loading = false;
    }
    return cartId as string;
  }
  async addToCart(variantId: string, quantity: number) {
    this.loading = true;
    try {
      const cartId: string = await this.initializeCart();

      // 👇 Convert observable to promise
      const res: any = await this.apiService.addToCart(cartId, variantId, quantity).toPromise();
      console.log('Cart updated', res);
      this.loadCart()
    } catch (error) {
      console.error('Add to cart error:', error);
    } finally {
      this.loading = false;
    }
  }
  AddToCart(id: string) {
    this.addToCart(id, 1)
  }

  // remove item from cart 
  removeItem(item: any) {
    const cartId = localStorage.getItem("cart_id");
    if (!cartId) return;

    this.loading = true;
    this.apiService.removeCartItem(cartId, item.Lineid).subscribe({
      next: (res: any) => {
        this.cartItems = this.cartItems.filter(i => i.Lineid !== item.Lineid);
        this.loadCart();
      },
      error: (err) => {
        console.error('Failed to remove item:', err);
        this.loading = false;
      }
    });
  }

  decreaseQuantity(item: any) {
    const cartId = localStorage.getItem("cart_id");
    if (!cartId) return;

    this.loading = true;

    if (item.quantity > 1) {
      const newQty = item.quantity - 1;
      this.apiService.updateCartItem(cartId, item.Lineid, newQty).subscribe({
        next: (res: any) => {
          item.quantity = newQty;
          this.loadCart();
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Failed to update quantity:', err);
          this.loading = false;
        }
      });
    } else {
      this.apiService.removeCartItem(cartId, item.Lineid).subscribe({
        next: (res: any) => {
          this.cartItems = this.cartItems.filter(i => i.id !== item.Lineid);
          this.loadCart();
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to remove item:', err);
          this.loading = false;
        }
      });
    }
  }

  async openCheckout() {
    console.log(this.cart.checkoutUrl)
    // const checkoutUrl = this.cart?.checkoutUrl;

    // if (!checkoutUrl) {
    //   console.warn('Checkout URL is not available.');
    //   return;
    // }

    // try {
    //   await Browser.open({
    //     url: checkoutUrl,
    //     presentationStyle: 'fullscreen', // iOS only
    //   });
    // } catch (error) {
    //   console.error('Browser failed to open:', error);
    // }
  }
}
