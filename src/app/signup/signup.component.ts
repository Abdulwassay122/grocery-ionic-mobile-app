import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { CommonModule } from '@angular/common'; 
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { IonLabel, IonItem, IonContent, IonButton, IonInput, IonIcon } from '@ionic/angular/standalone';


register();
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports:[CommonModule, IonInput, FormsModule, FormsModule, IonLabel, IonItem, IonContent, IonButton, IonInput, IonIcon ]
})
export class SignupComponent implements OnInit {
  firstname = '';
  lastname = '';
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

  onSignUp(){
    console.log(this.firstname, this.lastname, this.email, this.password)
  }

}
