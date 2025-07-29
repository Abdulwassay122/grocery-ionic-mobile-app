import { Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavController } from '@ionic/angular';

register();
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductDetailComponent  implements OnInit {

  constructor(private navCtrl: NavController) { }
  goToBack(){
    this.navCtrl.navigateBack(['/products']);
  }
  ngOnInit() {}

}
