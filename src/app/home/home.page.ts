import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonIcon, IonFooter } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';

register();
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [ FooterComponent, CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonIcon, IonFooter],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class HomePage {
  posts: any[] = [];

  loading : boolean = true

  constructor(private navCtrl: NavController, private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getPosts().subscribe((res: any) => {
      const edges = res?.data?.products?.edges || [];

      this.posts = edges.map((edge: any) => {
        const variant = edge.node.variants.edges[0]?.node;
        return {
          id: edge.node.id,
          title: edge.node.title,
          description: edge.node.description,
          imageUrl: edge.node.images.edges[0]?.node.url,
          altText: edge.node.images.edges[0]?.node.altText,
          price: variant?.price?.amount,
          currency: variant?.price?.currencyCode
        };
      });

      console.log("Loaded products:", this.posts);
      this.loading = false
    });
  }

  goToProducts() {
    this.navCtrl.navigateForward(['/products']);
  }
  goToCart() {
    this.navCtrl.navigateForward(['/cart']);
  }
  goToProfile() {
    this.navCtrl.navigateForward(['/profile']);
  }
  goToProductdetail(productId: string) {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && typeof activeElement.blur === 'function') {
      activeElement.blur();
    }
    this.navCtrl.navigateForward(['/productdetail'], {
      queryParams: { id: productId }
    });
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
