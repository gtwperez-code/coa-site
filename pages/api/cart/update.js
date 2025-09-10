import { cartLinesUpdate } from '../../../lib/shopify';
export default async function handler(req, res) {
  try {
    const { cartId, lineId, qty } = req.query;
    const cart = await cartLinesUpdate(cartId, [{ id: lineId, quantity: Number(qty) }]);
    res.status(200).json({ cart });
  } catch (e) {
    console.error('cart/update error:', e?.message || e);
    res.status(500).json({ error: 'update-failed' });
  }
}
