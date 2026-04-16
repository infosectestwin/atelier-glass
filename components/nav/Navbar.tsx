import Link from 'next/link'
import { CATEGORIES } from '@/lib/categories'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-white font-bold text-xl tracking-tight">
            Atelier Glass
          </Link>

          {/* Category links */}
          <div className="hidden sm:flex items-center gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-200"
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Auth placeholder */}
          <div className="flex items-center">
            <Link
              href="/auth/signin"
              className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Mobile category links */}
        <div className="sm:hidden flex gap-4 pb-3 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="text-white/70 hover:text-white text-sm font-medium whitespace-nowrap transition-colors duration-200"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
