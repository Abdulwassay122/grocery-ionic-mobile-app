import { Routes } from '@angular/router';
import { ProductDetailComponent } from './product-detail/product-detail.component';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./products-page/products-page.component').then(
        (m) => m.ProductsPageComponent
      ),
  },
 { path: 'productdetail', component: ProductDetailComponent },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
