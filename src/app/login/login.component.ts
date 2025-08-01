import { Component, OnInit } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

import {
  IonLabel,
  IonItem,
  IonContent,
  IonButton,
  IonInput,
} from '@ionic/angular/standalone';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    IonLabel,
    IonItem,
    IonContent,
    IonButton,
    IonInput,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  showPassword = false;
  errorEmail = '';
  errorPass = '';
  Error = '';

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private apiService: ApiService
  ) {}

  ngOnInit() {}
  goToFirst() {
    this.navCtrl.navigateBack(['/first']);
  }

  async presentToast(
    message: string,
    color: 'success' | 'danger' | 'warning' | 'primary'
  ) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color,
    });
    toast.present();
  }

  onLogin() {
    console.log('object');
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
      this.apiService.signInCustomer(this.email, this.password).subscribe({
        next: (res: any) => {
          console.log('Full response:', res);

          const result = res.data?.customerAccessTokenCreate;

          if (!result) {
            this.Error = 'Unexpected error. Please try again later.';
            return;
          }

          // Check for user-facing GraphQL errors (like wrong email/password)
          if (result.customerUserErrors.length > 0) {
            const err = result.customerUserErrors[0];

            // This is the most common login failure
            if (err.message === 'Unidentified customer') {
              this.errorEmail = 'Invalid email or password.';
              this.errorPass = 'Invalid email or password.';
            } else if (err.field?.includes('email')) {
              this.errorEmail = err.message;
            } else if (err.field?.includes('password')) {
              this.errorPass = err.message;
            } else {
              this.Error = err.message;
            }
            return;
          }

          // Successful login
          const tokenData = result.customerAccessToken;
          if (tokenData?.accessToken) {
            console.log('Login Success:', tokenData);
            localStorage.setItem('customerAccessToken', tokenData.accessToken);
            this.email = '';
            this.password = '';
            // optionally redirect or call another method
          } else {
            this.Error = 'Login failed. No token received.';
          }
        },

        error: (err) => {
          console.error('Network or server error:', err);
          this.presentToast(
            'Something went wrong. Please try again later.',
            'danger'
          );
          this.Error = 'Something went wrong. Please try again later.';
        },
      });
    }
  }
}
