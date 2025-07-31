import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { IonButton, IonContent } from '@ionic/angular/standalone';


register();
@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.scss'],
  imports:[IonButton, IonContent]
})
export class FirstComponent implements OnInit {

  constructor(private router: Router) {}
  
  goToSignup(){
    this.router.navigate(['/signup']);
  }
  goToLogin(){
    this.router.navigate(['/login']);
  }

  ngOnInit() { }
}
