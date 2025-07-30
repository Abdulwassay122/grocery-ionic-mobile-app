import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://groceryonhome.myshopify.com/api/2024-04/graphql.json';

  constructor(private http: HttpClient) { }

  getPosts(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': '688baa2f57101adb450a08d23a1671ba'
    });

    return this.http.post(this.apiUrl, {
      query: `query {
        products(first: 5) {
          edges {
            node {
              id
              title
              description
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }`
    }, { headers });

  }

  getProductById(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': '688baa2f57101adb450a08d23a1671ba'
    });

    const query = `
    query getProduct($id: ID!) {
      product(id: $id) {
        id
        title
        description
        images(first: 5) {
          edges {
            node {
              url
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              availableForSale
              
              price {
                amount
                currencyCode
              }
              image {
                url
              }
            }
          }
        }
      }
    }
  `;

    return this.http.post(this.apiUrl, {
      query,
      variables: { id }
    }, { headers });
  }

}
