import { cartLinesRemove } from '../../../lib/shopify';
export default async function handler(req, res) {
  try {
    const { cartId, lineId } = req.query;
    const cart = await cartLinesRemove(cartId, [lineId]);
    res.status(200).json({ cart });
  } catch (e) {
    console.error('cart/remove error:', e?.message || e);
    res.status(500).json({ error: 'remove-failed' });
  }
}
