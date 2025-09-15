// components/Layout.js
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    // Layout de altura completa
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2">
            <img
              src="/logo.png"
              alt="COA Eyewear"
              className="h-10 w-auto object-contain"
            />
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

      {/* Main crece y empuja el footer hacia abajo */}
      <main className="mx-auto w-full max-w-5xl flex-grow p-6">
        {children}
      </main>

      {/* Footer pegado abajo */}
      <footer className="border-t text-center opacity-70">
        © {new Date().getFullYear()} COA Eyewear — Handmade in Puerto Rico

        {/* Franja de azulejos */}
        <div
          className="mt-10 w-full"
          style={{
            height: 120,                // equivalente aprox. a "h-30"
            backgroundImage: 'url(/tile.png)',
            backgroundSize: '120px',
            backgroundRepeat: 'repeat',
            opacity: 0.45,
          }}
        />
      </footer>
    </div>
  );
}
