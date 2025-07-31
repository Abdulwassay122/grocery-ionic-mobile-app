import { Component, OnInit } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { IonLabel, IonItem, IonContent, IonButton, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  imports: [ FormsModule, IonLabel, IonItem, IonContent, IonButton, IonInput],
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
