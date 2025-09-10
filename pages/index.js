import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      {/* Hero */}
      {/* Hero with background image */}
<section className="relative overflow-hidden rounded-3xl border border-neutral-200">
  <div
    className="absolute inset-0 bg-center bg-cover"
    style={{ backgroundImage: 'url(/hero.jpeg)' }}
    aria-hidden="true"
  />
  <div className="relative px-6 py-24 sm:px-10 sm:py-28 text-center bg-black/30 text-white">
    <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight drop-shadow">
      COA Eyewear
    </h1>
    <p className="mt-4 max-w-xl mx-auto text-neutral-100/90">
      Handmade eyewear from Puerto Rico — crafted with care, designed to live beautifully.
    </p>
    <div className="mt-8 flex items-center justify-center gap-3">
      <Link href="/shop" className="btn btn-primary">Shop now</Link>
      <Link href="/about" className="btn btn-ghost">About COA</Link>
    </div>
  </div>
</section>


      {/* Feature blurb */}
      <section className="mt-12 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border p-5">
          <h3 className="font-medium">Handmade</h3>
          <p className="text-sm text-neutral-600 mt-1">
            Each frame tells a story — materials chosen with intention.
          </p>
        </div>
        <div className="rounded-2xl border p-5">
          <h3 className="font-medium">Small batch</h3>
          <p className="text-sm text-neutral-600 mt-1">
            Limited quantities, unique pieces — no two drops are the same.
          </p>
        </div>
        <div className="rounded-2xl border p-5">
          <h3 className="font-medium">Puerto Rico</h3>
          <p className="text-sm text-neutral-600 mt-1">
            Rooted in the island — designed for sun, salt, and everyday life.
          </p>
        </div>
      </section>
    </Layout>
  );
}
