import { Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../navigation.service';

register();
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule]
})
export class ProductDetailComponent implements OnInit {
  loading: boolean = true
  product: any = null;
  quantity: number = 1;
  selectedVariant: any;
  constructor(private navigationService: NavigationService, private navCtrl: NavController, private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
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
          console.warn('❌ Product not found in response');
        }
      },
      error: (err) => {
        console.error('❌ API Error:', err);
      }
    });
    this.loading = false
    console.log(this.loading)
  }

  selectVariant(variant: any) {
    this.selectedVariant = variant;
    console.log(variant)
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

}
