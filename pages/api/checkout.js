import { createCartWithLine } from '../../lib/shopify';

export default async function handler(req, res) {
  try {
    const { variantId, qty } = req.query;
    if (!variantId) return res.status(400).json({ error: 'Missing variantId' });

    const cart = await createCartWithLine(variantId, Number(qty || 1));
    return res.status(200).json({ checkoutUrl: cart.checkoutUrl });
  } catch (e) {
    console.error('Checkout API error:', e?.message || e);
    return res.status(500).json({ error: 'Checkout failed' });
  }
}
