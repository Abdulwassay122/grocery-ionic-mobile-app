import { Component, OnInit } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SignupComponent implements OnInit {
  email = '';
  password = '';
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  constructor(private navCtrl: NavController) { }
  goToFirst() {
    this.navCtrl.navigateBack(['/first']);
  }
  ngOnInit() { }

}
