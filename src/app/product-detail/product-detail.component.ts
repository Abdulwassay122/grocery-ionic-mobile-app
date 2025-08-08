import { Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../navigation.service';
import { IonSpinner } from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import { HeaderComponent } from '../header/header.component';
import { Location } from '@angular/common';

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
  isWished = false;
  constructor(private location: Location, private toastController: ToastController, private navigationService: NavigationService, private navCtrl: NavController, private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe((params: any) => {
      console.log('Query Params:', params);

      const productId = params['id'];
      // initializing the wishlist
      const existing = JSON.parse(localStorage.getItem('wishlist') || '[]');
      console.log("Wishlist:", existing, "product id ", productId);

      // Make sure product is defined
      if (productId && existing.includes(productId)) {
        this.isWished = true;
        console.log('true')
      } else {
        this.isWished = false;
        console.log('false')
      }

      if (!productId) {
        console.warn(' No ID found. Using fallback.');
        this.fetchProduct('gid://shopify/Product/7256223219783'); // Fallback test ID
        console.log(localStorage.getItem('wishlist')?.includes(this.product.id))

      } else {
        console.log(' Found product ID:', productId);
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
            available: edge.node.availableForSale,
            quantityAvailable: edge.node.quantityAvailable
          }));

          this.product = {
            id: data.id,
            collection: data.collections.edges[0].node.title,
            title: data.title,
            description: data.description,
            imageUrl: data.images.edges[0]?.node.url,
            variants: variants
          };

          this.selectedVariant = variants[0];
          this.loading = false
        } else {
          console.warn(' Product not found in response');
          this.loading = false
        }
      },
      error: (err) => {
        console.error(' API Error:', err);
        this.loading = false
      }
    });
    console.log(this.loading)
  }

  selectVariant(variant: any) {
    this.selectedVariant = variant;
    console.log("Selected Variant: ", this.selectedVariant.id)
  }

  goToBack() {
    this.location.back();
  }



  increaseQuantity() {
    console.log(this.selectedVariant)
    if (this.selectedVariant && this.selectedVariant.quantityAvailable !== this.quantity) {
      this.quantity++;
    } else {
      this.presentToast("No More tock available.", "danger")
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
  addToCart(variantId: string, quantity: number) {
    this.loading2 = true;

    const cartId = localStorage.getItem('cart_id');
    if (!cartId) {
      this.presentToast('Cart ID not found', 'danger');
      this.loading2 = false;
      return;
    }

    this.apiService.addToCart(cartId, variantId, quantity).subscribe({
      next: () => {
        this.apiService.getCartQuantity().subscribe();
        this.presentToast('Item added to cart', 'primary');
      },
      error: (err) => {
        console.error('Add to cart error:', err);
        this.presentToast('Failed to add to cart', 'danger');
      },
      complete: () => {
        this.loading2 = false; // ✅ now it stops at the correct time
      }
    });
  }
  AddToCart() {
    this.addToCart(this.selectedVariant.id, this.quantity)
  }



  //  add to wishlist 
  addToWishList(id: string) {
    const existing = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (existing.includes(id)) {
      existing.splice(existing.indexOf(id), 1);
      localStorage.setItem('wishlist', JSON.stringify(existing));
      this.isWished = false
    } else {
      existing.push(id);
      localStorage.setItem('wishlist', JSON.stringify(existing));
      this.isWished = true
    }
  }
}
