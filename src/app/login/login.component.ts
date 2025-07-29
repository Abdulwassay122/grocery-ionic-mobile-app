import { Component, OnInit } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  imports: [IonicModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  constructor(private navCtrl: NavController) { }

  ngOnInit() { }
  goToFirst() {
    this.navCtrl.navigateBack(['/first']);
  }
  onLogin(){
    if(this.password === 'admin' && this.email === 'admin'){
      this.navCtrl.navigateRoot(['/home']);
    }
  }
}
