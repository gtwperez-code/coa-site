import Layout from '../components/Layout';
import Link from 'next/link';
import { getProducts } from '../lib/shopify';

export default function Shop({ products, error }) {
  if (error) return <Layout><h2 className="text-2xl font-semibold">Shop</h2><p>Could not load products.</p></Layout>;
  if (!products) return <Layout><h2 className="text-2xl font-semibold">Shop</h2><p>Loading…</p></Layout>;

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-6">Shop</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <article key={p.id} className="rounded-2xl border border-neutral-200 p-3">
            {p.featuredImage && (
              <img
                src={p.featuredImage.url}
                alt={p.featuredImage.altText || p.title}
                className="w-full rounded-xl"
              />
            )}
            <h3 className="mt-3 mb-1 font-medium">{p.title}</h3>
            <p className="text-sm text-neutral-600">
              {p.priceRange?.minVariantPrice?.amount} {p.priceRange?.minVariantPrice?.currencyCode}
            </p>
            <div className="mt-3">
              <Link className="btn btn-outline" href={`/product/${p.handle}`}>View</Link>
            </div>
          </article>
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const products = await getProducts(12);
    return { props: { products } };
  } catch {
    return { props: { products: null, error: true } };
  }
}
