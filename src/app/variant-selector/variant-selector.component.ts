import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  IonHeader,
  IonContent,
  IonInput,
  IonIcon,
  IonCardContent,
  IonCard,
  IonButton,
  IonCardTitle,
  IonCardSubtitle,
  IonCardHeader,
  IonCol,
  IonRow,
  IonGrid,
  IonButtons,
  IonTitle,
IonToolbar, 
} from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-variant-selector',
  templateUrl: './variant-selector.component.html',
  styleUrls: ['./variant-selector.component.scss'],
  imports:[CommonModule, IonicModule]
})
export class VariantSelectorComponent {
  @Input() variants: any[] = [];

  constructor(private modalCtrl: ModalController) {}

  selectVariant(variant: any) {
    this.modalCtrl.dismiss(variant);
  }

  close() {
    this.modalCtrl.dismiss(null);
  }
}
