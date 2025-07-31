import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.SHOPIFY_STOREFRONT_URL

  constructor(private http: HttpClient) { }



  getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': environment.SHOPIFY_STOREFRONT_TOKEN
    });
  }

  // To Fetch Random Products
  getPosts(): Observable<any> {
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
    }, { headers: this.getHeaders() });

  }

  // To Fetch Product By Id
  getProductById(id: string): Observable<any> {
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
    }, { headers: this.getHeaders() });
  }

  // To Create Cart
  createCart() {
    const query = `
      mutation {
        cartCreate {
          cart {
            id
            createdAt
          }
        }
      }`;
    return this.http.post(this.apiUrl, { query }, { headers: this.getHeaders() });
  }

  // TO add product in Cart
  addToCart(cartId: string, variantId: string, quantity: number) {
    const query = `
      mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            lines(first: 10) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      title
                    }
                  }
                }
              }
            }
          }
        }
      }`;
    const variables = {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }]
    };
    return this.http.post(this.apiUrl, { query, variables }, { headers: this.getHeaders() });
  }

  // To Get Products From Cart 
  getCart(cartId: string) {
    const query = `
      query GetCart($cartId: ID!) {
        cart(id: $cartId) {
          id
          checkoutUrl
          totalQuantity
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
    const variables = { cartId };
    return this.http.post(this.apiUrl, { query, variables }, { headers: this.getHeaders() });
  }

  // to remove item from cart 
  removeCartItem(cartId: string, lineId: string) {
    const REMOVE_ITEM_MUTATION = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
    return this.http.post(this.apiUrl, {
      query: REMOVE_ITEM_MUTATION,
      variables: {
        cartId,
        lineIds: [lineId]
      }
    }, {
      headers: this.getHeaders()
    });
  }

  // to update item from cart 
  updateCartItem(cartId: string, lineId: string, quantity: number) {
    const UPDATE_CART_LINE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;
    return this.http.post(this.apiUrl, {
      query: UPDATE_CART_LINE_MUTATION,
      variables: {
        cartId,
        lines: [
          {
            id: lineId,
            quantity: quantity
          }
        ]
      }
    }, {
      headers: this.getHeaders()
    });
  }


}
