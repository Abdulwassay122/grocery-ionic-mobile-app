import { Routes } from '@angular/router';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FirstComponent } from './first/first.component';
import { CartComponent } from './cart/cart.component';
import { ProfileComponent } from './profile/profile.component';

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
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'first', component: FirstComponent },
  { path: 'cart', component: CartComponent },
  { path: 'profile', component: ProfileComponent },
  {
    path: '',
    redirectTo: 'first',
    pathMatch: 'full',
  },
];
