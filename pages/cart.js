import Layout from '../components/Layout';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const cid = () => localStorage.getItem('cartId');

  async function refresh() {
    try {
      const id = cid();
      if (!id) { setCart(null); setLoading(false); return; }
      const res = await fetch(`/api/cart/get?cartId=${encodeURIComponent(id)}`);
      const data = await res.json();
      setCart(data.cart || null);
    } finally { setLoading(false); }
  }

  useEffect(() => { refresh(); }, []);

  async function changeQty(lineId, qty) {
    setLoading(true);
    const res = await fetch(`/api/cart/update?cartId=${encodeURIComponent(cid())}&lineId=${encodeURIComponent(lineId)}&qty=${qty}`);
    const data = await res.json();
    setCart(data.cart); setLoading(false);
  }

  async function removeLine(lineId) {
    setLoading(true);
    const res = await fetch(`/api/cart/remove?cartId=${encodeURIComponent(cid())}&lineId=${encodeURIComponent(lineId)}`);
    const data = await res.json();
    setCart(data.cart); setLoading(false);
  }

  if (loading) return <Layout><p>Loading cart…</p></Layout>;

  if (!cart || !cart.lines?.edges?.length) {
    return (
      <Layout>
        <h2>Cart</h2>
        <p>Your cart is empty.</p>
        <a className="btn" href="/shop">Keep shopping</a>
      </Layout>
    );
  }

  const lines = cart.lines.edges.map(e => e.node);

  return (
    <Layout>
      <h2>Cart</h2>
      <div style={{display:'grid', gap:16}}>
        {lines.map(line => {
          const v = line.merchandise;
          return (
            <div key={line.id} style={{display:'grid', gridTemplateColumns:'80px 1fr auto', gap:12, alignItems:'center', border:'1px solid #eee', padding:12, borderRadius:12}}>
              {v.image && <img src={v.image.url} alt={v.image.altText||v.product.title} style={{width:80, height:80, objectFit:'cover', borderRadius:8}}/>}
              <div>
                <div style={{fontWeight:600}}>{v.product.title}</div>
                <div style={{opacity:.7}}>{v.title}</div>
                <div>{v.price?.amount} {v.price?.currencyCode}</div>
              </div>
              <div style={{display:'flex', gap:8, alignItems:'center'}}>
                <button onClick={()=>changeQty(line.id, Math.max(1, line.quantity-1))}>-</button>
                <span>{line.quantity}</span>
                <button onClick={()=>changeQty(line.id, line.quantity+1)}>+</button>
                <button onClick={()=>removeLine(line.id)} style={{marginLeft:12}}>Remove</button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{marginTop:20, display:'flex', justifyContent:'space-between', alignItems:'center', gap:12}}>
        <a className="btn" href="/shop" style={{background:'transparent', border:'1px solid #ddd', color:'inherit'}}>Keep shopping</a>
        <div style={{fontWeight:600}}>
          Subtotal: {cart.cost?.subtotalAmount?.amount} {cart.cost?.subtotalAmount?.currencyCode}
        </div>
        <a className="btn" href={cart.checkoutUrl}>Checkout</a>
      </div>
    </Layout>
  );
}
