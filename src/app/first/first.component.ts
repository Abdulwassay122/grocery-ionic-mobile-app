import { Component, OnInit } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';

register();
@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

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
