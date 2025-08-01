import { Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavController, IonicModule } from '@ionic/angular';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../navigation.service';
import { IonSpinner } from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import { HeaderComponent } from '../header/header.component';


register();
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, IonSpinner, HeaderComponent]
})
export class ProductDetailComponent implements OnInit {
  loading: boolean = true
  loading2: boolean = false
  product: any = null;
  quantity: number = 1;
  selectedVariant: any;
  constructor(private toastController: ToastController, private navigationService: NavigationService, private navCtrl: NavController, private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params:any) => {
      console.log('Query Params:', params);

      const productId = params['id'];

      if (!productId) {
        console.warn('❌ No ID found. Using fallback.');
        this.fetchProduct('gid://shopify/Product/7256223219783'); // Fallback test ID
      } else {
        console.log('✅ Found product ID:', productId);
        this.fetchProduct(productId);
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
  fetchProduct(id: string) {
    console.log('Fetching product with ID:', id);

    this.apiService.getProductById(id).subscribe({
      next: (res: any) => {
        const data = res?.data?.product;
        console.log('Product API response:', data);

        if (data) {
          const variants = data.variants.edges.map((edge: any) => ({
            id: edge.node.id,
            title: edge.node.title,
            price: edge.node.price.amount,
            currency: edge.node.price.currencyCode,
            imageUrl: edge.node.image?.url,
            available: edge.node.availableForSale
          }));

          this.product = {
            id: data.id,
            title: data.title,
            description: data.description,
            imageUrl: data.images.edges[0]?.node.url,
            variants: variants
          };

          this.selectedVariant = variants[0];
        } else {
          console.warn(' Product not found in response');
        }
      },
      error: (err) => {
        console.error(' API Error:', err);
      }
    });
    this.loading = false
    console.log(this.loading)
  }

  selectVariant(variant: any) {
    this.selectedVariant = variant;
    console.log("Selected Variant: ", this.selectedVariant.id)
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

  increaseQuantity() {
    if (this.selectedVariant && this.selectedVariant.available) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    } else {
      this.quantity = 1
    }
  }

  // Add To Cart 
  async initializeCart() {
    let cartId = localStorage.getItem('cart_id');
    if (!cartId) {
      const res: any = await this.apiService.createCart().toPromise();
      cartId = res.data.cartCreate.cart.id;
      localStorage.setItem('cart_id', cartId || '');
    }
    return cartId as string;
  }
  async addToCart(variantId: string, quantity: number) {
    this.loading2 = true;
    try {
      const cartId: string = await this.initializeCart();

      const res: any = await this.apiService.addToCart(cartId, variantId, quantity).toPromise();
      console.log('Cart updated', res);
      this.presentToast('Item added to cart', 'primary')
    } catch (error) {
      console.error('Add to cart error:', error);
    } finally {
      this.loading2 = false
    }
  }
  AddToCart() {
    this.addToCart(this.selectedVariant.id, this.quantity)
  }

}
