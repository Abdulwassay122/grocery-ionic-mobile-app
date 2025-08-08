import { Component } from '@angular/core';
import {
  IonSpinner,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonItem,
  IonIcon,
  IonFooter,
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { IonicModule, ModalController } from '@ionic/angular';
import { VariantSelectorComponent } from '../variant-selector/variant-selector.component';

register();
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonSpinner,
    FooterComponent,
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonItem,
    IonIcon,
    IonFooter,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage {
  posts: any[] = [];
  cartQuantity: number = 0;
  wishQuantity: any = 0;
  loading: boolean = true;
  loading2: boolean = false;
  collections: any[] = [];

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private navCtrl: NavController,
    private apiService: ApiService
  ) {}

  ionViewWillEnter() {
    console.log('Page is about to become active');
    const existing = JSON.parse(localStorage.getItem('wishlist') || '[]');
    this.wishQuantity = existing.length;
    // Do your logic here
  }

  ngOnInit(): void {
    this.apiService.fetchCollections().subscribe((res: any) => {
      const edges = res?.data?.collections?.edges || [];
      // console.log(edges)
      this.collections = edges.map((edge: any) => {
        return {
          id: edge.node.id,
          title: edge.node.title,
          imageUrl: edge.node.image.url,
        };
      });
      console.log(this.collections);
    });

    // to  fetch wishlist lenght
    const existing = JSON.parse(localStorage.getItem('wishlist') || '[]');
    this.wishQuantity = existing.length;

    // to fetch cart Quantity
    this.apiService.cartQuantity$.subscribe((qty) => {
      this.cartQuantity = qty;
      this.loading = false;
    });
    // initial fetch
    this.apiService.getCartQuantity().subscribe((qty) => {
      this.cartQuantity = qty.data.cart.totalQuantity;
      this.loading = false;
    });

    this.apiService.getPosts(10, null).subscribe((res: any) => {
      const edges = res?.data?.products?.edges || [];
      console.log(res);

      this.posts = edges.map((edge: any) => {
        const variant = edge.node.variants.edges[0]?.node;
        return {
          varient: edge.node.variants,
          id: edge.node.id,
          title: edge.node.title,
          description: edge.node.description,
          imageUrl: edge.node.images.edges[0]?.node.url,
          altText: edge.node.images.edges[0]?.node.altText,
          price: variant?.price?.amount,
          currency: variant?.price?.currencyCode,
        };
      });

      console.log('Loaded products:', this.posts);
      this.loading = false;
    });
  }

  goToProducts() {
    this.navCtrl.navigateForward(['/products']);
  }
  goToCart() {
    this.navCtrl.navigateForward(['/cart']);
  }
  goToWish() {
    this.navCtrl.navigateForward(['/wishlist']);
  }
  goToProfile() {
    this.navCtrl.navigateForward(['/profile']);
  }
  goToSearch() {
    this.navCtrl.navigateForward(['/products'], {
      queryParams: { focus: 1 },
    });
  }

  goToProductdetail(productId: string) {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && typeof activeElement.blur === 'function') {
      activeElement.blur();
    }
    this.navCtrl.navigateForward(['/productdetail'], {
      queryParams: { id: productId },
    });
  }

  addToWishList(id: string) {
    const existing = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (existing.includes(id)) {
      existing.splice(existing.indexOf(id), 1);
      localStorage.setItem('wishlist', JSON.stringify(existing));
      this.wishQuantity -= 1;
    } else {
      existing.push(id);
      localStorage.setItem('wishlist', JSON.stringify(existing));
      this.wishQuantity += 1;
    }
  }

  async presentToast(
    message: string,
    color: 'success' | 'danger' | 'warning' | 'primary'
  ) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color,
    });
    toast.present();
  }

  addToCart(variantId: string) {
    this.loading2 = true;

    const cartId = localStorage.getItem('cart_id');
    if (!cartId) {
      this.presentToast('Cart ID not found', 'danger');
      this.loading2 = false;
      return;
    }

    this.apiService.addToCart(cartId, variantId, 1).subscribe({
      next: () => {
        this.apiService.getCartQuantity().subscribe();
        this.presentToast('Item added to cart', 'primary');
      },
      error: (err) => {
        console.error('Add to cart error:', err);
        this.presentToast('Failed to add to cart', 'danger');
      },
      complete: () => {
        this.loading2 = false;
      },
    });
  }

  isWished(id: string) {
    const existing = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return existing.includes(id);
  }

  goToCollection(name: string) {
    this.navCtrl.navigateForward(['/products'], {
      queryParams: { collection: name },
    });
  }

  // confirm Dialogue
  async openVariantModal(variants: any) {
    const cleanVariants = Array.isArray(variants)
      ? variants.map((v) => v.node)
      : variants?.edges?.map((v: any) => v.node) || [];

    const modal = await this.modalController.create({
      component: VariantSelectorComponent,
      componentProps: {
        variants: cleanVariants,
      },
      breakpoints: [0.25, 0.5, 0.8],
      initialBreakpoint: 0.5,
      cssClass: 'variant-modal',
    });

    await modal.present();

    const { data: selectedVariant } = await modal.onWillDismiss();
    if (selectedVariant) {
      console.log('Selected Variant:', selectedVariant);
      this.addToCart(selectedVariant.id); // or any action
    }
  }

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    loop: true,
    autoplay: {
      delay: 2000,
    },
  };
}
