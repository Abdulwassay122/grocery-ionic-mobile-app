import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { CommonModule } from '@angular/common';
import { ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {
  IonLabel,
  IonItem,
  IonContent,
  IonButton,
  IonInput,
  IonIcon,
} from '@ionic/angular/standalone';
import { ApiService } from '../api.service';
import { Location } from '@angular/common';

register();
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [
    CommonModule,
    IonInput,
    FormsModule,
    FormsModule,
    IonLabel,
    IonItem,
    IonContent,
    IonButton,
    IonInput,
    IonIcon,
  ],
})
export class SignupComponent implements OnInit {
  firstname = '';
  lastname = '';
  email = '';
  password = '';
  showPassword = false;
  errorEmail = '';
  errorPass = '';
  Error = '';

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  constructor(private location: Location, private toastController: ToastController, private navCtrl: NavController, private apiService: ApiService) {}
  goToBack() {
    this.location.back();
  }
  ngOnInit() {}

  async presentToast(message: string, color: 'success' | 'danger' | 'warning' | 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2000, 
      position: 'top',
      color,
    });
    toast.present();
  }

  onSignUp() {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    this.errorEmail = '';
    this.errorPass = '';

    if (this.email.length === 0) {
      this.errorEmail = 'Email is required.';
    } else if (!regex.test(this.email)) {
      this.errorEmail = 'Please enter a valid email.';
    }
    if (this.password.length === 0) {
      this.errorPass = 'Password is required.';
    } else if (this.password.length < 8) {
      this.errorPass = 'Password must be at least 8 characters.';
    }

    if (!this.errorEmail && !this.errorPass) {
      this.apiService
        .createCustomer(
          this.email,
          this.password,
          this.firstname,
          this.lastname
        )
        .subscribe({
          next: (res: any) => {
            const result = res.data.customerCreate;
            console.log("result: ",result)

            if (result.customerUserErrors.length > 0) {
              const err = result.customerUserErrors[0];
              if (err.field?.includes('email')) {
                this.errorEmail = err.message;
              } else if (err.field?.includes('password')) {
                this.errorPass = err.message;
              } else {
                this.Error = err.message;
              }
            } else {
              console.log('Customer created:', result.customer);
              localStorage.setItem('customer', JSON.stringify(result.customer));
              this.firstname = '';
              this.lastname = '';
              this.email = '';
              this.password = '';
              this.presentToast('Customer Created Successfully.', 'primary')
              this.navCtrl.navigateForward(['/login']);
            }
          },
          error: (err) => {
            console.error('Server error:', err);
            this.presentToast('Something went wrong. Please try again later.', 'danger')
            this.Error = 'Something went wrong. Please try again later.';
          },
        });
    }
  }
}
