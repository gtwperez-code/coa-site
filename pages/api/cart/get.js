import { cartGet } from '../../../lib/shopify';
export default async function handler(req, res) {
  try {
    const { cartId } = req.query;
    const cart = await cartGet(cartId);
    res.status(200).json({ cart });
  } catch (e) {
    console.error('cart/get error:', e?.message || e);
    res.status(500).json({ error: 'get-failed' });
  }
}
