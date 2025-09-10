import { cartCreate, cartLinesAdd } from '../../../lib/shopify';

export default async function handler(req, res) {
  try {
    const { cartId, variantId, qty } = req.query;
    const line = { merchandiseId: variantId, quantity: Number(qty || 1) };
    const cart = cartId ? await cartLinesAdd(cartId, [line]) : await cartCreate([line]);
    res.status(200).json({ cartId: cart.id, cart });
  } catch (e) {
    console.error('cart/add error:', e?.message || e);
    res.status(500).json({ error: 'add-failed' });
  }
}
