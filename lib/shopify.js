const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const endpoint = `https://${domain}/api/2024-07/graphql.json`;

async function shopifyFetch(query, variables) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token
    },
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (!res.ok || json.errors) {
    console.error('Shopify error:', res.status, JSON.stringify(json, null, 2));
    throw new Error('Shopify API error');
  }
  return json.data;
}

export async function getProducts(limit = 12) {
  const query = `
    { products(first: ${limit}) {
        edges { node {
          id
          title
          handle
          featuredImage { url altText }
          priceRange { minVariantPrice { amount currencyCode } }
        } }
      }}`;
  const data = await shopifyFetch(query);
  return data.products.edges.map(e => e.node);
}

export async function getProductByHandle(handle) {
  const query = `
    query($handle: String!){
      product(handle: $handle) {
        id
        title
        handle
        descriptionHtml
        images(first: 8) { edges { node { url altText } } }
        variants(first: 20) { edges { node { id title price { amount currencyCode } } } }
      }
    }`;
  const data = await shopifyFetch(query, { handle });
  return data.product;
}

// --- CART HELPERS ---

export async function createCartWithLine(variantId, quantity = 1) {
  const query = `
    mutation CartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart { id checkoutUrl }
        userErrors { message }
      }
    }`;

  const data = await shopifyFetch(query, {
    lines: [{ merchandiseId: variantId, quantity }]
  });

  const err = data.cartCreate?.userErrors?.[0]?.message;
  if (err) throw new Error(err);
  return data.cartCreate.cart; // { id, checkoutUrl }
}

// ===== CART API (Storefront) =====
function cartFragment() {
  return `
    fragment CartFields on Cart {
      id
      checkoutUrl
      cost { totalAmount { amount currencyCode } subtotalAmount { amount currencyCode } }
      lines(first: 50) {
        edges { node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price { amount currencyCode }
              image { url altText }
              product { title handle }
            }
          }
        } }
      }
    }`;
}

export async function cartCreate(lines) {
  const query = `
    ${cartFragment()}
    mutation CreateCart($lines:[CartLineInput!]) {
      cartCreate(input:{ lines:$lines }) {
        cart { ...CartFields }
        userErrors { message }
      }
    }`;
  const data = await shopifyFetch(query, { lines });
  const err = data.cartCreate?.userErrors?.[0]?.message;
  if (err) throw new Error(err);
  return data.cartCreate.cart;
}

export async function cartGet(cartId) {
  const query = `
    ${cartFragment()}
    query GetCart($id: ID!) { cart(id:$id) { ...CartFields } }`;
  const data = await shopifyFetch(query, { id: cartId });
  return data.cart;
}

export async function cartLinesAdd(cartId, lines) {
  const query = `
    ${cartFragment()}
    mutation AddLines($cartId:ID!, $lines:[CartLineInput!]!) {
      cartLinesAdd(cartId:$cartId, lines:$lines) {
        cart { ...CartFields }
        userErrors { message }
      }
    }`;
  const data = await shopifyFetch(query, { cartId, lines });
  const err = data.cartLinesAdd?.userErrors?.[0]?.message;
  if (err) throw new Error(err);
  return data.cartLinesAdd.cart;
}

export async function cartLinesUpdate(cartId, lines) {
  const query = `
    ${cartFragment()}
    mutation UpdateLines($cartId:ID!, $lines:[CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId:$cartId, lines:$lines) {
        cart { ...CartFields }
        userErrors { message }
      }
    }`;
  const data = await shopifyFetch(query, { cartId, lines });
  const err = data.cartLinesUpdate?.userErrors?.[0]?.message;
  if (err) throw new Error(err);
  return data.cartLinesUpdate.cart;
}

export async function cartLinesRemove(cartId, lineIds) {
  const query = `
    ${cartFragment()}
    mutation RemoveLines($cartId:ID!, $lineIds:[ID!]!) {
      cartLinesRemove(cartId:$cartId, lineIds:$lineIds) {
        cart { ...CartFields }
        userErrors { message }
      }
    }`;
  const data = await shopifyFetch(query, { cartId, lineIds });
  const err = data.cartLinesRemove?.userErrors?.[0]?.message;
  if (err) throw new Error(err);
  return data.cartLinesRemove.cart;
}
