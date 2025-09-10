import Layout from '../../components/Layout';
import { getProductByHandle } from '../../lib/shopify';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useEffect, useMemo, useState } from 'react';

export default function ProductPage() {
  const { query } = useRouter();
  const { data: product, error } = useSWR(
    () => query.handle ? ['product', query.handle] : null,
    () => getProductByHandle(query.handle)
  );

  const [variantId, setVariantId] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  // prepare data
  const images = product?.images?.edges?.map(e => e.node) || [];
  const variants = product?.variants?.edges?.map(e => e.node) || [];
  const price = useMemo(() => {
    const first = variants[0];
    return first?.price?.amount ? `${first.price.amount} ${first.price.currencyCode}` : '';
  }, [variants]);

  useEffect(() => {
    const first = variants?.[0]?.id;
    if (first) setVariantId(first);
  }, [product]);

  if (error) return <Layout><p>Could not load product.</p></Layout>;
  if (!product) return <Layout><p>Loading…</p></Layout>;

  async function addToCart() {
    try {
      setLoading(true);
      const cartId = typeof window !== 'undefined' ? localStorage.getItem('cartId') : null;
      const res = await fetch(`/api/cart/add?variantId=${encodeURIComponent(variantId)}&qty=1${cartId ? `&cartId=${encodeURIComponent(cartId)}` : ''}`);
      const data = await res.json();
      if (data.cartId) localStorage.setItem('cartId', data.cartId);
      window.location.href = '/cart';
    } catch (e) {
      console.error(e);
      alert('Could not add to cart');
    } finally {
      setLoading(false);
    }
  }

  async function buyNow() {
    const res = await fetch(`/api/checkout?variantId=${encodeURIComponent(variantId)}&qty=1`);
    const data = await res.json();
    if (data.checkoutUrl) window.location.href = data.checkoutUrl;
  }

  const shortDesc = product.description?.slice(0, 220) || '';
  const needsToggle = (product.description || '').length > 220;

  return (
    <Layout>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Gallery */}
        <div>
          {images[activeIndex] && (
            <img
              src={images[activeIndex].url}
              alt={product.title}
              className="w-full rounded-2xl"
            />
          )}
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.map((img, i) => (
                <button
                  key={img.url}
                  onClick={() => setActiveIndex(i)}
                  className={`border rounded-xl overflow-hidden ${i === activeIndex ? 'border-black' : 'border-neutral-200'}`}
                >
                  <img src={img.url} alt={img.altText || product.title} className="w-full h-20 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          {price && <div className="mt-2 text-lg font-medium">{price}</div>}

          {/* Variants */}
          {variants.length > 0 && (
            <div className="mt-4">
              <label className="block mb-2 text-sm text-neutral-700">Variant</label>
              <select
                value={variantId}
                onChange={(e)=>setVariantId(e.target.value)}
                className="rounded-lg border border-neutral-300 px-3 py-2"
              >
                {variants.map(v => (
                  <option key={v.id} value={v.id}>{v.title}</option>
                ))}
              </select>
            </div>
          )}

          {/* Description (short / expand) */}
          <div className="mt-6 text-neutral-700 leading-relaxed">
            {!expanded ? (
              <>
                <p>{shortDesc}{needsToggle && '…'}</p>
                {needsToggle && (
                  <button onClick={()=>setExpanded(true)} className="mt-2 underline text-sm">
                    Read more
                  </button>
                )}
              </>
            ) : (
              <>
                <p>{product.description}</p>
                {needsToggle && (
                  <button onClick={()=>setExpanded(false)} className="mt-2 underline text-sm">
                    Show less
                  </button>
                )}
              </>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button onClick={addToCart} disabled={loading || !variantId} className="btn btn-outline">
              Add to cart
            </button>
            <button onClick={buyNow} disabled={!variantId} className="btn btn-primary">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
