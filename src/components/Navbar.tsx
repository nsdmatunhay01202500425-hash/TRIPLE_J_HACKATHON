import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { MapPin, Menu, User, X } from 'lucide-react'
import Logo from './Logo'

const LINKS = [
  { to: '/predict', label: 'Price Prediction' },
  { to: '/markets', label: 'Market Prices' },
  { to: '/history', label: 'Price History' },
  { to: '/intelligence', label: 'Market Analysis' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link to="/" className="focus-ring rounded-md">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `focus-ring rounded-md px-3 py-2 text-[13.5px] font-medium transition-colors ${
                  isActive ? 'text-ink' : 'text-muted hover:text-ink'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button className="focus-ring flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-[13px] text-ink hover:bg-agricon-faint">
            <MapPin size={14} className="text-muted" />
            Davao City
          </button>
          <button className="focus-ring flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted hover:bg-agricon-faint">
            <User size={15} />
          </button>
        </div>

        <button
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-md border border-line text-ink md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-ink/30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white p-5 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <button
                className="focus-ring flex h-8 w-8 items-center justify-center rounded-md text-muted"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2.5 text-[15px] font-medium ${
                      isActive ? 'bg-agricon-faint text-agricon-deep' : 'text-ink'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-6 flex items-center gap-2 border-t border-line pt-5 text-sm text-muted">
              <MapPin size={14} /> Davao City
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
