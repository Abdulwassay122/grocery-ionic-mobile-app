import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, finalize, Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import { BehaviorSubject, throwError } from 'rxjs';
import { first, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.SHOPIFY_STOREFRONT_URL;
  private cartQuantitySubject = new BehaviorSubject<number>(0);
  cartQuantity$ = this.cartQuantitySubject.asObservable();
  constructor(private http: HttpClient) {}

  getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': environment.SHOPIFY_STOREFRONT_TOKEN,
    });
  }

  // To Fetch Random Products
  getPosts(first: any, after: any): Observable<any> {
    const query = `
    query GetProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
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
            variants(first: 5) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
`;

    return this.http.post(
      this.apiUrl,
      {
        query,
        variables: {
          first,
          after,
        },
      },
      { headers: this.getHeaders() }
    );
  }

  // To Fetch Product By Id
  getProductById(id: string): Observable<any> {
    const query = `
    query getProduct($id: ID!) {
      product(id: $id) {
        id
        title
        description
        collections(first: 1) {
          edges {
            node {
              id
              title
            }
          }
        }
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
              quantityAvailable
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

    return this.http.post(
      this.apiUrl,
      {
        query,
        variables: { id },
      },
      { headers: this.getHeaders() }
    );
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
    return this.http.post(
      this.apiUrl,
      { query },
      { headers: this.getHeaders() }
    );
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
      lines: [{ merchandiseId: variantId, quantity }],
    };
    return this.http.post(
      this.apiUrl,
      { query, variables },
      { headers: this.getHeaders() }
    );
  }

  // To Get Products From Cart
  getCartQuantity() {
    const cartId = localStorage.getItem('cart_id');
    if (!cartId) {
      this.cartQuantitySubject.next(0);
      return throwError(() => new Error('Cart ID not found!'));
    }

    const query = `
      query GetCart($cartId: ID!) {
        cart(id: $cartId) {
          totalQuantity
        }
      }
    `;
    const variables = { cartId };

    return this.http
      .post(this.apiUrl, { query, variables }, { headers: this.getHeaders() })
      .pipe(
        // tap allows side effect (set quantity)
        tap((res: any) => {
          const qty = res?.data?.cart?.totalQuantity ?? 0;
          this.cartQuantitySubject.next(qty);
        }),
        catchError((err) => {
          console.error('Failed to fetch cart quantity:', err);
          this.cartQuantitySubject.next(0);
          return throwError(() => err);
        })
      );
  }

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
                    quantityAvailable
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      id
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
    return this.http.post(
      this.apiUrl,
      { query, variables },
      { headers: this.getHeaders() }
    );
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
    return this.http.post(
      this.apiUrl,
      {
        query: REMOVE_ITEM_MUTATION,
        variables: {
          cartId,
          lineIds: [lineId],
        },
      },
      {
        headers: this.getHeaders(),
      }
    );
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
    return this.http.post(
      this.apiUrl,
      {
        query: UPDATE_CART_LINE_MUTATION,
        variables: {
          cartId,
          lines: [
            {
              id: lineId,
              quantity: quantity,
            },
          ],
        },
      },
      {
        headers: this.getHeaders(),
      }
    );
  }

  //  Authentication
  // customerCreate Sign up
  createCustomer(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) {
    const query = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `;

    const variables = {
      input: {
        email,
        password,
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
      },
    };

    return this.http.post(
      this.apiUrl,
      { query, variables },
      { headers: this.getHeaders() }
    );
  }

  getWishlistProducts(): Observable<any> {
    const productIds: string[] = JSON.parse(
      localStorage.getItem('wishlist') || '[]'
    );

    if (!productIds.length) {
      return of([]); // nothing to fetch
    }

    const query = `
    query GetWishlistProducts($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          id
          title
          description
          images(first: 1) {
            edges {
              node {
                url
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
              id
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
  `;

    const variables = { ids: productIds };

    return this.http.post(
      this.apiUrl,
      { query, variables },
      {
        headers: this.getHeaders(),
      }
    );
  }

  getCustomerInfo(): Observable<any> {
    const accessToken = localStorage.getItem('customerAccessToken');
    console.log('cc', accessToken);
    const query = `
    query GetCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        email
        phone
        createdAt
        orders(first: 5) {
          edges {
            node {
              id
              name
              totalPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

    const variables = { customerAccessToken: accessToken };

    return this.http.post(
      this.apiUrl,
      {
        query,
        variables,
      },
      { headers: this.getHeaders() }
    );
  }

  // to Signup User
  signInCustomer(email: string, password: string) {
    const query = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `;

    const variables = {
      input: { email, password },
    };

    return this.http.post(
      this.apiUrl,
      { query, variables },
      { headers: this.getHeaders() }
    );
  }

  connectCartToCustomer(cartId: string, accessToken: string) {
    const query = `
    mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
      cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
        cart {
          id
          buyerIdentity {
            customer {
              id
              email
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

    const variables = {
      cartId,
      buyerIdentity: { customerAccessToken: accessToken },
    };

    return this.http.post(
      this.apiUrl,
      { query, variables },
      {
        headers: this.getHeaders(),
      }
    );
  }

  logout() {
    const accessToken = localStorage.getItem('customerAccessToken');

    const query = `
    mutation customerAccessTokenDelete($accessToken: String!) {
      customerAccessTokenDelete(customerAccessToken: $accessToken) {
        deletedAccessToken
        userErrors {
          field
          message
        }
      }
    }
  `;

    const variables = { accessToken };

    return this.http
      .post<any>(
        this.apiUrl,
        { query, variables },
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(
        finalize(() => {
          localStorage.removeItem('customerAccessToken');
          localStorage.removeItem('cart_id');
          localStorage.removeItem('customer');
          localStorage.removeItem('shopify_customer_type');
        }),
        catchError((err) => {
          console.error('Logout API failed:', err);
          // Still clear local data
          return of(null);
        })
      );
  }

  resetCartBuyerIdentity(cartId: string) {
    const query = `
    mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
      cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
        cart {
          id
          buyerIdentity {
            email
            customer {
              id
              email
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

    const variables = {
      cartId,
      buyerIdentity: {
        customerAccessToken: null,
        email: null,
      },
    };

    return this.http.post<any>(
      this.apiUrl,
      { query, variables },
      {
        headers: this.getHeaders(),
      }
    );
  }

  fetchCollections(first: number = 10) {
    const query = `
    query fetchCollections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            title
            handle
            image {
              url
              altText
            }
          }
        }
      }
    }
  `;

    const variables = {
      first,
    };

    return this.http.post<any>(
      this.apiUrl,
      { query, variables },
      {
        headers: this.getHeaders(),
      }
    );
  }

  fetchCollectionProductsByHandle(handle: string, first: number, after: any) {
    const query = `
    query getCollectionProducts($handle: String!, $first: Int!,  $after: String) {
      collectionByHandle(handle: $handle) {
        id
        title
        products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
          edges {
          cursor
            node {
              id
              title
              handle
              description
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 5) {
              edges {
                node {
                  id
                  title
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
      }
    }
  `;

    const variables = {
      handle,
      first,
      after,
    };

    return this.http.post<any>(
      this.apiUrl,
      { query, variables },
      {
        headers: this.getHeaders(),
      }
    );
  }

  searchProducts(query: string, first: number, after: any) {
    const gqlQuery = `
    query searchProducts($query: String!, $first: Int!, $after: String) {
      products(first: $first, after: $after, query: $query) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            id
            title
            handle
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
    }
  `;

    const variables = {
      query,
      first,
      after,
    };

    return this.http.post<any>(
      this.apiUrl,
      { query: gqlQuery, variables },
      {
        headers: this.getHeaders(),
      }
    );
  }

  getOrders(accessToken: string) {
    const query = `query getCustomerOrders($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
      firstName
      lastName
      email
      orders(first: 10, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            totalPrice {
              amount
              currencyCode
            }
            subtotalPrice {
              amount
              currencyCode
            }
            totalShippingPrice {
              amount
              currencyCode
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                  variant {
                  image {
                    url
                  }
                  }
                  originalTotalPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
            shippingAddress {
              name
              address1
              city
              country
              zip
            }
            fulfillmentStatus
            financialStatus
          }
        }
      }
    }
  } `;
    const variables = {
      customerAccessToken: accessToken,
    };

    return this.http.post<any>(
      this.apiUrl,
      { query, variables },
      { headers: this.getHeaders() }
    );
  }
}
