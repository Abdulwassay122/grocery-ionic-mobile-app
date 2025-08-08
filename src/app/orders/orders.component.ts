import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import {IonThumbnail, IonGrid, IonListHeader,IonChip,IonRow , IonCol, IonTitle, IonToolbar,IonNote, IonLabel, IonList, IonContent, IonButton, IonHeader, IonItem, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent  } from '@ionic/angular/standalone';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  imports:[CommonModule,IonThumbnail,IonGrid, IonListHeader, IonChip,IonRow , IonCol, IonToolbar, IonTitle , IonNote, IonLabel, IonList, IonContent, IonButton, IonHeader, IonItem, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent ]
})
export class OrdersComponent implements OnInit {
  customer: any = {
    firstName: '',
    lastName: '',
    email: '',
    orders: [],
  };

  constructor(private apiService: ApiService, private location: Location) {}

  ngOnInit() {
    this.loadCustomer()
  }
  loadCustomer() {
    const accessToken = localStorage.getItem('customerAccessToken');
    console.log(accessToken);
    if (!accessToken) {
      throw new Error('access token not found!');
    }

    this.apiService.getOrders(accessToken).subscribe((customerData: any) => {
      console.log(customerData);

      this.customer = {
        firstName: customerData.data.customer.firstName,
        lastName: customerData.data.customer.lastName,
        email: customerData.data.customer.email,
        orders: customerData.data.customer.orders.edges.map((edge:any) => ({
          id: edge.node.id,
          orderNumber: edge.node.orderNumber,
          processedAt: edge.node.processedAt,
          totalPrice: edge.node.totalPrice,
          subtotalPrice: edge.node.subtotalPrice,
          totalShippingPrice: edge.node.totalShippingPrice,
          lineItems: edge.node.lineItems.edges.map((itemEdge:any) => itemEdge.node),
          shippingAddress: edge.node.shippingAddress,
          fulfillmentStatus: edge.node.fulfillmentStatus,
          financialStatus: edge.node.financialStatus,
        })),
      };
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PAID':
        return 'success';
      case 'UNFULFILLED':
        return 'warning';
      case 'FULFILLED':
        return 'primary';
      default:
        return 'medium';
    }
  }
  parseFloat(value: string): number {
  return parseFloat(value);
}
formatCurrency(amount: string, currencyCode: string): string {
  return `${currencyCode} ${parseFloat(amount).toFixed(2)}`;
}
goToBack(){
    this.location.back();
}

}
