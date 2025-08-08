import { Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { IonSearchbar } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { VariantSelectorComponent } from '../variant-selector/variant-selector.component';


register();
@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss'],
  imports: [FormsModule, FooterComponent, CommonModule, IonicModule],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductsPageComponent implements OnInit {
  @ViewChild('searchInput', { static: false }) searchInput!: IonSearchbar;
  
  searchTerm: string = '';
  loading: boolean = true;
  loading2: boolean = false;
  loading3: boolean = false;
  posts: any[] = [];
  collections: any[] = [];
  filteredPosts: any[] = [];
  shouldFocusSearch: boolean = false;
  collectionName: any = '';
  lastCursor: string | null = null;
  hasNextPage: boolean = true;
  searching: boolean = false;
  searchQuery: string = '';
  private debounceTimer: any = null;
  wisllist: string[] = [];
  Error: boolean = false;
  
  constructor(
    private toastController: ToastController,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private apiService: ApiService,
    private modalController: ModalController,
  ) {}

  ngAfterViewInit() {
    console.log('shouldFocus', this.shouldFocusSearch);
    if (this.shouldFocusSearch === true) {
      setTimeout(() => {
        this.searchInput.setFocus();
      }, 1000);
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.collectionName = params['collection'];
      const focus = params['focus'];
      console.log('Collection:', this.collectionName);

      if (focus == 1) {
        this.shouldFocusSearch = true;
      }

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

      if (this.collectionName === undefined) {
        this.getAllProducts();
      } else {
        console.log('Params found correctly.');
        this.getProductsByCollection(this.collectionName, 5, this.lastCursor);
      }
    });

    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  getAllProducts(): Promise<void> {
    this.Error = false;
    this.loading2 = true;
    return new Promise((resolve, reject) => {
      if (!this.hasNextPage) {
        return resolve();
      }

      this.apiService.getPosts(4, this.lastCursor).subscribe({
        next: (res: any) => {
          const edges = res?.data?.products?.edges || [];
          const lastEdge = edges[edges.length - 1];
          this.lastCursor = lastEdge?.cursor ?? null;
          this.hasNextPage = res.data.products.pageInfo.hasNextPage;

          const newPosts = edges.map((edge: any) => {
            console.log('vv', edge.node.variants.edges[0].node.id);
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
              cursor: edge.cursor,
            };
          });

          this.posts.push(...newPosts);
          this.filteredPosts = this.posts;
          console.log('Loaded products:', this.posts);
          if (this.filteredPosts.length === 0) {
            this.Error = true;
          }

          resolve();
          this.loading2 = false;
        },
        error: (err) => {
          console.error('Error loading products', err);
          reject(err);
          this.loading2 = false;
        },
      });
    });
  }

  getProductsByCollection(
    collection: string,
    first: number,
    after: string | null
  ) {
    this.Error = false;
    this.loading2 = true;
    console.log('first');
    console.log(this.hasNextPage);
    console.log(this.lastCursor);
    if (!this.hasNextPage) return;

    this.apiService
      .fetchCollectionProductsByHandle(collection, first, after)
      .subscribe((res: any) => {
        const edges = res?.data?.collectionByHandle?.products?.edges || [];
        const pageInfo = res?.data?.collectionByHandle?.products?.pageInfo;

        const newPosts = edges.map((edge: any) => {
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
            cursor: edge.cursor,
          };
        });

        this.posts.push(...newPosts);
        this.filteredPosts = this.posts;

        this.lastCursor = edges[edges.length - 1]?.cursor ?? null;
        this.hasNextPage = pageInfo?.hasNextPage ?? false;

        console.log('Loaded products:', this.posts);
        if (this.filteredPosts.length === 0) {
          this.Error = true;
        }
        this.loading2 = false;
        console.log(this.hasNextPage);
        console.log(this.lastCursor);
      });
  }

  searchProducts(query: string, first: number, after: string | null) {
    this.Error = false;
    this.loading2 = true;
    this.apiService
      .searchProducts(query, first, after)
      .subscribe((res: any) => {
        const edges = res?.data?.products?.edges || [];
        const pageInfo = res?.data?.products?.pageInfo;

        const newPosts = edges.map((edge: any) => {
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
            cursor: edge.cursor,
          };
        });

        this.posts.push(...newPosts);
        this.filteredPosts = this.posts;

        this.lastCursor = edges[edges.length - 1]?.cursor ?? null;
        this.hasNextPage = pageInfo?.hasNextPage ?? false;
        console.log('Loaded products:', this.posts);
        this.loading2 = false;
        if (this.filteredPosts.length === 0) {
          this.Error = true;
        }
      });
  }

  goToCart() {
    this.navCtrl.navigateForward(['/cart']);
  }
  goToBack() {
    this.navCtrl.navigateForward(['/home']);
  }
  goToProductdetail(productId: string) {
    this.navCtrl.navigateForward(['/productdetail'], {
      queryParams: { id: productId },
    });
  }

  addToCart(variantId: string) {
    this.loading3 = true;

    const cartId = localStorage.getItem('cart_id');
    if (!cartId) {
      this.presentToast('Cart ID not found', 'danger');
      this.loading3 = false;
      return;
    }

    this.apiService.addToCart(cartId, variantId, 1).subscribe({
      next: () => {
        this.apiService.getCartQuantity().subscribe();
        this.presentToast('Item added to cart', 'primary');
        this.loading3 = false;
      },
      error: (err) => {
        console.error('Add to cart error:', err);
        this.presentToast('Failed to add to cart', 'danger');
        this.loading3 = false;
      },
      complete: () => {
        this.loading3 = false;
      },
    });
  }

  addToWishList(id: string) {
    const existing = JSON.parse(localStorage.getItem('wishlist') || '[]');
    this.wisllist = existing;
    console.log('cc', this.wisllist);

    if (existing.includes(id)) {
      existing.splice(existing.indexOf(id), 1);
      localStorage.setItem('wishlist', JSON.stringify(existing));
    } else {
      existing.push(id);
      localStorage.setItem('wishlist', JSON.stringify(existing));
    }
  }

  isWished(id: string) {
    const existing = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return existing.includes(id);
  }

  clearSearch() {
    this.searchTerm = '';
    this.searching = false;
    this.posts = [];
    this.filteredPosts = [];
    this.lastCursor = null;
    this.hasNextPage = true;
    this.collectionName
      ? this.getProductsByCollection(this.collectionName, 5, null)
      : this.getAllProducts();
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

  // confirm controller
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
      // enterAnimation: this.enterAnimation,
      // leaveAnimation: this.leaveAnimation,
    });

    await modal.present();

    const { data: selectedVariant } = await modal.onWillDismiss();
    if (selectedVariant) {
      console.log('Selected Variant:', selectedVariant);
      this.addToCart(selectedVariant.id);
    }
  }

  onInput(event: any) {
    const query = event.target.value.trim();
    this.searchQuery = query;
    this.searchTerm = query;

    if (this.debounceTimer) {
      console.log('debounce', this.debounceTimer);
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.posts = [];
      this.filteredPosts = [];
      this.lastCursor = null;
      this.hasNextPage = true;

      if (query.length > 0) {
        this.searching = true;
        this.searchProducts(`title:*${query}*`, 5, null);
      } else {
        this.searching = false;
        this.collectionName
          ? this.getProductsByCollection(this.collectionName, 5, null)
          : this.getAllProducts();
      }
    }, 400);
  }

  isActive(name: any) {
    if (name == this.collectionName) {
      return 'categoryActive';
    }
    return '';
  }

  goToCollection(name: string) {
    this.hasNextPage = true;
    this.lastCursor = null;
    this.posts = [];
    if (this.collectionName === name) {
      this.navCtrl.navigateRoot(['/products']);
      return;
    }
    this.navCtrl.navigateForward(['/products'], {
      queryParams: { collection: name },
    });
  }

  // filterPosts(searchTerm: string) {
  //   const term = searchTerm.toLowerCase();

  //   this.filteredPosts = this.posts.filter(post =>
  //     post.title.toLowerCase().includes(term) ||
  //     post.description.toLowerCase().includes(term) ||
  //     post.price?.toString().includes(term) ||
  //     post.currency?.toLowerCase().includes(term)
  //   );
  // }

  loadMore(event: any) {
    if (!this.hasNextPage) {
      event.target.complete();
      return;
    }

    if (this.searching) {
      this.searchProducts(`title:${this.searchQuery}`, 5, this.lastCursor);
    } else if (this.collectionName) {
      this.getProductsByCollection(this.collectionName, 5, this.lastCursor);
    } else {
      this.getAllProducts();
    }

    setTimeout(() => {
      event.target.complete();
    }, 500);
  }
}
