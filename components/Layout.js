import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div>
      <header className="flex justify-between items-center px-6 py-4 border-b">
        <div className="flex items-center gap-3">
  <Link href="/" className="inline-flex items-center gap-2">
    <img src="/logo.png" alt="COA Eyewear" className="h-7 w-auto" />
    <span className="sr-only">COA Eyewear</span>
  </Link>
</div>

        <nav className="flex items-center gap-4">
          <Link href="/shop">Shop</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/cart">Cart</Link>
          <a
            href="https://instagram.com/coaeyewear"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto p-6">{children}</main>

      <footer className="p-6 border-t text-center opacity-70">
        © {new Date().getFullYear()} COA Eyewear — Handmade in Puerto Rico
{/* Tile pattern strip */}
<div
  className="mt-10 h-30 w-full rounded-full"
  style={{
    backgroundImage: 'url(/tile.png)',
    backgroundSize: '120px',
    backgroundRepeat: 'repeat',
    opacity: 0.45
  }}
/>

      </footer>
    </div>
  );
}
