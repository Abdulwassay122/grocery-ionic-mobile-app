import { Component, OnInit } from '@angular/core';
import { IonHeader, IonContent, IonInput,  IonIcon , IonCardContent, IonCard} from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common'; 


register();
@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss'],
  imports: [CommonModule, IonHeader, IonContent, IonInput, IonIcon, IonCardContent, IonCard],
  standalone: true,
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductsPageComponent implements OnInit {

  loading: boolean = true

  posts: any[] = [];

  constructor(private navCtrl: NavController, private apiService: ApiService) { }

  goToProducts() {
    this.navCtrl.navigateBack(['/home']);
  }
  goToProductdetail(productId: string) {
    this.navCtrl.navigateForward(['/productdetail'], {
      queryParams: { id: productId }
    });
  }

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
    });
    setTimeout(() => {
      this.loading = false
    }, 1000);
  }
  
  goToCart(){
    this.navCtrl.navigateForward(['/cart']);
  }
}
